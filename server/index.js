import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import makeKey from "@jrc03c/make-key";

// Initialize environment variables
config();

// Connect to MongoDB
const { connect, connection, Schema, model } = mongoose;
const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Reconnecting...");
  setTimeout(connectDB, 5000);
});

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// URL Schema for users
const userUrlsSchema = new Schema({
  userId: { type: String, required: true },
  urls: [
    {
      slug: { type: String, required: true, unique: true },
      shortenedUrl: { type: String, required: true },
      url: { type: String, required: true },
      clicks: { type: Number, default: 0 },
      active: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
const UserUrls = model("UserUrls", userUrlsSchema);

const router = Router();

// Generate unique slug function
const generateUniqueSlug = async () => {
  let slug;
  let exists = true;
  while (exists) {
    slug = makeKey(6); // Generates a 6-character random key
    exists = await UserUrls.findOne({ "urls.slug": slug });
  }
  return slug;
};

// Shorten URL Route
router.post("/shorten", async (req, res) => {
  const { url, localUrls } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const normalizedUrl = url.startsWith("http") ? url : `http://${url}`;
    const slug = await generateUniqueSlug();
    const shortenedUrl = `${req.protocol}://${req.get("host")}/${slug}`;

    // For unauthenticated users (local storage)
    if (localUrls && localUrls.length >= 5) {
      return res
        .status(400)
        .json({ error: "Maximum 5 URLs for unregistered users" });
    }

    res.status(201).json({
      success: true,
      data: {
        slug,
        shortenedUrl,
        originalUrl: normalizedUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    res.status(500).json({ error: "Failed to shorten URL" });
  }
});

// Fetch User URLs Route
router.get("/urls", async (req, res) => {
  try {
    const userUrls = await UserUrls.find();
    res.status(200).json(userUrls || []);
  } catch (error) {
    console.error("Error fetching URLs:", error.message);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

// Delete User URL Route
router.delete("/urls/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await UserUrls.updateMany(
      {},
      { $pull: { urls: { slug: slug } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error.message);
    res.status(500).json({ error: "Failed to delete URL" });
  }
});

// Redirect Route
app.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    // Check for unauthenticated user's local storage URLs (passed from frontend)
    const localUrls = JSON.parse(req.headers["x-local-urls"] || "[]");
    const localUrlEntry = localUrls.find((url) => url.slug === slug);

    if (localUrlEntry) {
      return res.redirect(localUrlEntry.url);
    }

    // Fallback: Check MongoDB for the slug
    const userUrls = await UserUrls.findOne({ "urls.slug": slug });
    if (!userUrls) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const urlEntry = userUrls.urls.find((u) => u.slug === slug);
    res.redirect(urlEntry.url);
  } catch (error) {
    console.error("Error in slug lookup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Attach router
app.use("/api", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import makeKey from "@jrc03c/make-key"; // for generating unique slugs

dotenv.config();

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// URL Schema and Model
const urlSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  shortenedUrl: { type: String, required: true },
  url: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const Url = mongoose.model("Url", urlSchema);

// Helper to generate unique slug
const generateUniqueSlug = async () => {
  let slug;
  let exists = true;

  while (exists) {
    slug = makeKey(6);
    exists = await Url.exists({ slug });
  }
  return slug;
};

// POST /shorten - Create shortened URL
router.post("/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }

  // Normalize URL format
  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `http://${url}`;

  try {
    // Prevent re-shortening the same URL by checking for existing entry
    let existingUrl = await Url.findOne({ url: normalizedUrl });
    if (existingUrl) {
      return res.status(200).json({ success: true, data: existingUrl });
    }

    // Generate unique slug and create shortened URL
    const slug = await generateUniqueSlug();
    const shortenedUrl = `${req.protocol}://${req.get("host")}/${slug}`;

    // Save to DB
    const newUrl = new Url({ url: normalizedUrl, slug, shortenedUrl });
    const savedUrl = await newUrl.save();

    return res.status(201).json({ success: true, data: savedUrl });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to shorten URL" });
  }
});

// GET /urls - Fetch all URLs
router.get("/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

// Redirect endpoint for slug
app.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const url = await Url.findOneAndUpdate(
      { slug, active: true },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res
        .status(404)
        .json({ success: false, error: "Short URL not found" });
    }

    const destinationUrl = url.url.startsWith("http")
      ? url.url
      : `http://${url.url}`;
    res.redirect(301, destinationUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res
      .status(500)
      .json({ success: false, error: "Error processing redirect" });
  }
});

// Mount router and start server
app.use("/api", router);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

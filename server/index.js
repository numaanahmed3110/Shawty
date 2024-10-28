import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
// making unique keys............
import makeKey from "@jrc03c/make-key";

const app = express();
const router = express.Router();

dotenv.config();

// CORS configuration - must be first
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://shawty3110.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Schema definition..........
const urlSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  shortenedUrl: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Url = mongoose.model("Url", urlSchema);

// Function to check if slug exists and generate a unique one
async function generateUniqueSlug() {
  let slug = makeKey(6);
  let isUnique = false;

  while (!isUnique) {
    // Check if slug exists in database
    const existingUrl = await Url.findOne({ slug });
    if (!existingUrl) {
      isUnique = true;
    } else {
      // If slug exists, generate a new one
      slug = makeKey(6);
    }
  }

  return slug;
}

// URL Shortening endpoint
router.post("/shorten", async (req, res) => {
  console.log("Received shortening request:", req.body);

  try {
    // Add a 5 second delay
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Destructure URL from request body
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    // Add http:// if protocol is missing
    let normalizedUrl = url;
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = "http://" + normalizedUrl;
    }

    // Generate unique slug
    const slug = await generateUniqueSlug();

    // Prevent shortening of internal links
    if (normalizedUrl.includes("https://shawty3110.vercel.app")) {
      return res.status(400).json({
        success: false,
        error: "Cannot shorten URLs from this domain",
      });
    }

    // Create shortened URL
    const shortenedUrl = `${req.protocol}://${"shawty3110.vercel.app"}/${slug}`;

    // Create new URL document
    const newUrl = new Url({
      url: normalizedUrl,
      slug,
      shortenedUrl,
      clicks: 0,
      active: true,
    });

    // Save to database
    const savedUrl = await newUrl.save();
    console.log("Successfully shortened URL:", savedUrl);

    // Send success response
    return res.status(201).json({
      success: true,
      data: {
        slug: savedUrl.slug,
        originalUrl: savedUrl.url,
        shortenedUrl: savedUrl.shortenedUrl,
        clicks: savedUrl.clicks,
        active: savedUrl.active,
        createdAt: savedUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Detailed error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to shorten URL",
      details: error.message,
    });
  }
});

// Get all URLs endpoint
router.get("/urls", async (req, res) => {
  console.log("Received request for /api/urls");
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    console.log(`Found ${urls.length} URLs`);
    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch URLs",
      details: error.message,
    });
  }
});

// Redirect endpoint..........................................................
app.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(`Redirect request received for slug: ${slug}`);

  try {
    // 1. Find and update the URL document
    const url = await Url.findOneAndUpdate(
      {
        slug,
        active: true, // Only redirect if URL is active
      },
      {
        $inc: { clicks: 1 }, // Increment clicks
        $set: { lastAccessedAt: new Date() }, // Update last access time
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    // 2. Handle URL not found
    if (!url) {
      console.log(`URL not found for slug: ${slug}`);
      return res.status(404).render("error", {
        // Assuming you have an error view
        error: "Short link not found or has been deactivated",
      });
    }

    // 3. Validate the original URL
    if (!url.url.startsWith("http://") && !url.url.startsWith("https://")) {
      url.url = "http://" + url.url;
    }

    // 4. Log the redirect
    console.log(
      `Redirecting ${slug} to ${url.url} (Click count: ${url.clicks})`
    );

    // 5. Perform the redirect
    return res.redirect(url.url);
  } catch (error) {
    // 6. Error handling
    console.error("Error during redirect:", {
      slug,
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).render("error", {
      error: "An error occurred while processing your request",
    });
  }
});

// Mount router
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

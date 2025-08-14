// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

// Connection status
let isConnected = false;

/**
 * Connects to MongoDB using Mongoose.
 * If already connected, does nothing.
 * If connection is lost, will attempt to reconnect.
 */
export async function dbConnect(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
    });

    isConnected = true;

    console.log("✅ MongoDB connected:", db.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  // Reconnect if disconnected
  mongoose.connection.on("disconnected", async () => {
    console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
    isConnected = false;

    try {
      await mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
      isConnected = true;
      console.log("✅ MongoDB reconnected");
    } catch (reconnectError) {
      console.error("❌ Reconnection failed:", reconnectError);
    }
  });
}

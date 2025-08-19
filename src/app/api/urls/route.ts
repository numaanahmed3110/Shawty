import { dbConnect } from "@/lib/dbConnect";
import UrlModel from "@/models/urlSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    await dbConnect();
    const { userId } = await auth();

    const sessionId = new URL(req.url).searchParams.get("sessionId");
    console.log("🔍 Query params:", { userId, sessionId });

    let filter;
    if (userId) {
      filter = { userId };
    } else if (sessionId) {
      // Try multiple filter combinations
      filter = {
        $or: [
          { sessionId, userId: null },
          { sessionId, userId: { $exists: false } },
          { sessionId },
        ],
      };
    } else {
      return NextResponse.json([]);
    }

    console.log("🎯 Database filter:", filter);

    const limit = Number(new URL(req.url).searchParams.get("limit")) || 50;

    const urls = await UrlModel.find(filter).sort({ date: -1 }).limit(limit);

    console.log("📊 Found URLs:", urls.length);
    console.log("📄 First URL (if any):", urls[0]);

    // Also check what's actually in the database
    const allUrls = await UrlModel.find({}).limit(3);
    console.log(
      "🗃️ Sample from all URLs:",
      allUrls.map((url) => ({
        shortId: url.shortId,
        userId: url.userId,
        sessionId: url.sessionId,
      }))
    );

    // If no results, try a broader search for debugging
    if (urls.length === 0 && sessionId) {
      console.log("🔍 No results found, trying broader search...");
      const debugUrls = await UrlModel.find({
        $or: [
          { sessionId: { $regex: sessionId.substring(0, 10) } },
          { userId: null },
        ],
      }).limit(5);
      console.log(
        "🔍 Debug search results:",
        debugUrls.map((url) => ({
          shortId: url.shortId,
          sessionId: url.sessionId,
          userId: url.userId,
        }))
      );
    }
    // Construct shortUrl for each URL
    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const urlsWithShortUrl = urls.map((url) => ({
      ...url.toObject(),
      shortUrl: `${protocol}://${host}/${url.shortId}`,
    }));

    return NextResponse.json(urlsWithShortUrl);
  } catch (error) {
    console.error("Error fetching Urls: ", error);
    return NextResponse.json(
      { error: "Failed to fetch Urls" },
      { status: 500 }
    );
  }
}

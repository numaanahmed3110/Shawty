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

    const filter = userId ? { userId } : { userId: null };
    const limit = Number(new URL(req.url).searchParams.get("limit")) || 50;

    const urls = await UrlModel.find(filter).sort({ date: -1 }).limit(limit);

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

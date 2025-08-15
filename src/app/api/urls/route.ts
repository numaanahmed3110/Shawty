import { dbConnect } from "@/lib/dbConnect";
import UrlModel from "@/models/urlSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    await dbConnect();
    const urls = await UrlModel.find({}).sort({ date: -1 });

    return NextResponse.json(urls);
  } catch (error) {
    console.log("Error fetching Urls: ", error);
    return NextResponse.json(
      { error: "Failed to fetch Urls" },
      { status: 500 }
    );
  }
}

import { dbConnect } from "@/lib/dbConnect";
import UrlModel from "@/models/urlSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

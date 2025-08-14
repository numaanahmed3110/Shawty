import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import UrlModel from "@/models/urlSchema";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const UrlSchema = z.object({
      originalUrl: z
        .url("Invalid Url format")
        .min(1, "Url cannot be empty")
        .max(2048, "Url too long"),
    });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON format",
        },
        { status: 400 }
      );
    }
    const parseUrl = UrlSchema.safeParse(body);

    if (!parseUrl.success) {
      return NextResponse.json(
        {
          error: "Invalid Url format. Validation failed",
          details: parseUrl.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        {
          status: 400,
        }
      );
    }

    const { originalUrl } = parseUrl.data;

    const existingUrl = await UrlModel.findOne({ originalUrl });
    if (existingUrl) {
      const host = req.headers.get("host");
      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";
      const shortUrl = `${protocol}://${host}/${existingUrl.shortId}`;

      return NextResponse.json({
        shortId: existingUrl.shortId,
        originalUrl: existingUrl.originalUrl,
        shortUrl: shortUrl,
        clicks: existingUrl.clicks,
        status: existingUrl.status,
        date: existingUrl.date,
        message: "URL already exists",
      });
    }

    const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
    const shortId = nanoid();
    const host = req.headers.get("host");
    if (!host) {
      return NextResponse.json(
        { error: "Host header is required" },
        { status: 400 }
      );
    }

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const shortUrl = `${protocol}://${host}/${shortId}`;
    console.log(shortId, shortUrl);

    const newUrl = await UrlModel.create({
      shortId,
      originalUrl,
      clicks: 0,
      status: "active",
      date: new Date(),
    });

    return NextResponse.json({
      shortId: newUrl.shortId,
      originalUrl: newUrl.originalUrl,
      shortUrl: shortUrl,
      clicks: newUrl.clicks,
      status: newUrl.status,
      date: newUrl.date,
    });
  } catch {
    console.log("❌ Error Creating Shortned URL");

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

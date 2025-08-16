import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import UrlModel from "@/models/urlSchema";
import { dbConnect } from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    await dbConnect();

    const { userId } = await auth();

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

    const existingUrl = await UrlModel.findOne({
      originalUrl,
      userId: userId || null,
    });

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

    let shortId: string;
    const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
    do {
      shortId = nanoid();
    } while (await UrlModel.exists({ shortId }));

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
      userId: userId ?? null,
      clicks: 0,
      status: "active",
      date: new Date(),
    });

    return NextResponse.json({
      id: newUrl._id,
      shortId: newUrl.shortId,
      originalUrl: newUrl.originalUrl,
      shortUrl: shortUrl,
      userId: newUrl.userId,
      clicks: newUrl.clicks,
      status: newUrl.status,
      date: newUrl.date,
      message: userId
        ? "Url saved for user"
        : "Guest Url created (Url will expire in 7 days)",
    });
  } catch (error) {
    console.log("❌ Error Creating Shortned URL");

    return NextResponse.json(
      {
        error: "Failed to create shortened URL",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

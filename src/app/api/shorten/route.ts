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
      sessionId: z.string().optional(),
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

    const { originalUrl, sessionId } = parseUrl.data;
    console.log("🔍 Received data:", { originalUrl, sessionId, userId });

    if (!userId && sessionId) {
      const existingUrlCount = await UrlModel.countDocuments({
        sessionId,
        userId: null,
        status: "active",
      });

      console.log("📊 Existing URLs count for session:", existingUrlCount);

      if (existingUrlCount > 4) {
        return NextResponse.json(
          {
            error:
              "You've reached the limit of 4 URLs. Register now for unlimited usage!",
          },
          { status: 403 }
        );
      }
    }

    // Check if URL already exists
    let existingUrl;
    if (userId) {
      // For logged-in users, check by userId
      existingUrl = await UrlModel.findOne({
        originalUrl,
        userId,
        status: "active",
      });
    } else if (sessionId) {
      // For guest users, check by sessionId
      existingUrl = await UrlModel.findOne({
        originalUrl,
        sessionId,
        userId: null,
        status: "active",
      });
    }

    if (existingUrl) {
      console.log("🔄 URL already exists:", {
        shortId: existingUrl.shortId,
        sessionId: existingUrl.sessionId,
        userId: existingUrl.userId,
      });

      const host = req.headers.get("host");
      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";
      const shortUrl = `${protocol}://${host}/${existingUrl.shortId}`;

      return NextResponse.json({
        id: existingUrl._id,
        shortId: existingUrl.shortId,
        originalUrl: existingUrl.originalUrl,
        shortUrl: shortUrl,
        userId: existingUrl.userId,
        sessionId: existingUrl.sessionId,
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

    console.log("💾 About to create URL with:", {
      shortId,
      originalUrl,
      userId: userId ?? null,
      sessionId: !userId ? sessionId : null,
    });

    const newUrl = await UrlModel.create({
      shortId,
      originalUrl,
      userId: userId ?? null,
      sessionId: !userId ? sessionId : null,
      clicks: 0,
      status: "active",
      date: new Date(),
    });

    console.log("💾 Created URL document:", {
      shortId: newUrl.shortId,
      userId: newUrl.userId,
      sessionId: newUrl.sessionId,
      originalUrl: newUrl.originalUrl,
    });

    return NextResponse.json({
      id: newUrl._id,
      shortId: newUrl.shortId,
      originalUrl: newUrl.originalUrl,
      shortUrl: shortUrl,
      userId: newUrl.userId,
      sessionId: newUrl.sessionId,
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

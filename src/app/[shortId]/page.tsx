import UrlModel from "@/models/urlSchema";
import { dbConnect } from "@/lib/dbConnect";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: { shortId: string };
}) {
  try {
    const { shortId } = params;
    console.log("🔍 Received shortId:", shortId);
    console.log("📏 ShortId length:", shortId?.length);

    if (!shortId || shortId.length !== 10) {
      console.log("❌ Invalid shortId length or missing");
      notFound();
    }

    await dbConnect();
    console.log("✅ Database connected");

    // First, let's see ALL documents in the collection
    const allUrls = await UrlModel.find({}).limit(5);
    console.log("📊 Total URLs in database:", await UrlModel.countDocuments());
    console.log("📄 Sample documents:", allUrls);

    const urlEntry = await UrlModel.findOne({
      shortId: shortId,
      status: "active",
    });

    console.log("🎯 Looking for shortId:", shortId);
    console.log("📄 Found urlEntry:", urlEntry);

    if (!urlEntry) {
      console.log("❌ No active URL found for shortId:", shortId);
      notFound();
    }

    interface UpdateClickCountError {
      message: string;
      stack?: string;
    }

    updateClickCount(shortId).catch((error: UpdateClickCountError) => {
      console.log(`Failed to upadate click count for ${shortId}:`, error);
    });

    console.log("🔄 Redirecting to:", urlEntry.originalUrl);
    redirect(urlEntry.originalUrl);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.log("💥 Actual Error: ", error);
    notFound();
  }
}

//Seperate function to updte clicks asynchronously

async function updateClickCount(shortId: string) {
  try {
    await dbConnect();
    await UrlModel.findOneAndUpdate(
      { shortId: shortId },
      { $inc: { clicks: 1 } }
    );
  } catch (error) {
    console.log("Failed to update the click count: ", error);
  }
}

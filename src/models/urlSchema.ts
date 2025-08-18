import mongoose, { models, model } from "mongoose";

const { Schema } = mongoose;

export interface UrlDocument extends Document {
  shortId: string;
  originalUrl: string;
  userId: string | null;
  session_id: string | null;
  clicks: number;
  status: "active" | "inactive";
  date: Date;
}

const UrlSchema = new Schema<UrlDocument>({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: null,
  }, // Clerk userId OR null for guests
  session_id: {
    type: String,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

UrlSchema.index({ shortId: 1, status: 1 });
// also index userId+date for faster listing
UrlSchema.index({ userId: 1, date: -1 });
UrlSchema.index({ sessionId: 1, date: -1 }); // Add index for sessionId

UrlSchema.index(
  { date: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
    partialFilterExpression: {
      $or: [
        { userId: null, sessionId: null },
        { userId: null, sessionId: { $ne: null } },
      ],
    }, // only guests,
  }
);

const UrlModel = models.Url || model<UrlDocument>("Url", UrlSchema);

export default UrlModel;

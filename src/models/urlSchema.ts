import mongoose, { models, model } from "mongoose";

const { Schema } = mongoose;

export interface UrlDocument extends Document {
  shortId: string;
  originalUrl: string;
  userId: string | null;
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
    default: Date.now, // ✅ function reference, generates new timestamp per doc
    index: true,
  },
});

UrlSchema.index(
  {
    date: 1,
  },
  {
    expireAfterSeconds: 60 * 60 * 24 * 7, // 7 days
    partialFilterExpression: {
      userId: null, // only guests
    },
  }
);

const UrlModel = models.Url || model<UrlDocument>("Url", UrlSchema);

export default UrlModel;

import mongoose, { models, model } from "mongoose";

const { Schema } = mongoose;

export interface UrlDocument extends Document {
  shortId: string;
  originalUrl: string;
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
    default: Date.now(),
  },
});

const UrlModel = models.Url || model<UrlDocument>("Url", UrlSchema);

export default UrlModel;

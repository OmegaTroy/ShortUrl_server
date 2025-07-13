import { Schema, model } from "mongoose";

const shorUrlSchema = new Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
});

export default model("ShortUrl", shorUrlSchema);

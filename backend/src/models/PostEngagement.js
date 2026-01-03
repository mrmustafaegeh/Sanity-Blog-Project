import mongoose from "mongoose";

const postEngagementSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true }, // Sanity post _id

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("PostEngagement", postEngagementSchema);

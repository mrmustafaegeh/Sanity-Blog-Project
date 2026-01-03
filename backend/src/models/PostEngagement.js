import mongoose from "mongoose";

const postEngagementSchema = new mongoose.Schema(
  {
    postId: {
      type: String, // Sanity post _id
      required: true,
      index: true,
      unique: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    // 🔹 Cached for fast reads
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PostEngagement", postEngagementSchema);

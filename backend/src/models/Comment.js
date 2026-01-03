import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String, // Sanity post _id
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);

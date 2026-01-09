// backend/src/models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    // User who submitted
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Post content
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 100,
    },
    featuredImage: {
      type: String,
    },

    // Categories as references (will be Sanity IDs)
    categories: [
      {
        _type: String,
        _ref: String,
      },
    ],

    tags: [String],

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    readingTime: {
      type: Number,
      default: 5,
    },

    // Submission status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Rejection details
    rejectionReason: {
      type: String,
    },

    // Admin who reviewed
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    // Sanity post ID (after approval)
    sanityPostId: {
      type: String,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
submissionSchema.index({ userId: 1, status: 1 });
submissionSchema.index({ status: 1, submittedAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;

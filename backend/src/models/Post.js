import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    mainImage: {
      url: String,
      alt: String,
      assetId: String,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    readingTime: {
      type: Number,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },

    rejectionReason: {
      type: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredAt: {
      type: Date,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//
// 🔹 MIDDLEWARE (SAFE — NO next())
//
postSchema.pre("save", function () {
  // 📖 Auto-calculate reading time (200 words/min)
  if (!this.readingTime && this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }

  // ❤️ Sync likesCount
  if (this.isModified("likes")) {
    this.likesCount = this.likes.length;
  }

  // 📌 Auto-set publishedAt when publishing
  if (this.isModified("status") && this.status === "published") {
    if (!this.publishedAt) {
      this.publishedAt = new Date();
    }
  }
});

//
// 🔹 INDEXES
//
postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ categories: 1 });
postSchema.index({ views: -1 });
postSchema.index({ likesCount: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;

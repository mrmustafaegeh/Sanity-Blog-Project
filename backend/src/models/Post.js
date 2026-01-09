import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
    default: 5,
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
  aiSummary: {
    type: String,
    trim: true,
  },
  aiHash: {
    type: String,
  },
  aiSummaryHistory: [
    {
      summary: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
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
  sourceSubmission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Auto-calculate reading time if not provided
  if (!this.readingTime && this.content) {
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200); // 200 words per minute
  }

  // Update likesCount to match likes array length
  if (this.isModified("likes")) {
    this.likesCount = this.likes.length;
  }

  next();
});

// Indexes for better performance
postSchema.index({ slug: 1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ categories: 1 });
postSchema.index({ views: -1 });
postSchema.index({ likesCount: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;

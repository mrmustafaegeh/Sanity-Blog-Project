// backend/src/controllers/submissionController.js
import Submission from "../models/Submission.js";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

// Submit post for review
export const submitPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      categories,
      tags,
      difficulty,
      readingTime,
      featuredImage,
    } = req.body;

    console.log("📝 Submitting post:", title);

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    if (title.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 10 characters",
      });
    }

    if (content.length < 100) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 100 characters",
      });
    }

    // Generate slug for checking duplicates
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if post with same title already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "A post with this title already exists",
      });
    }

    const submission = new Submission({
      userId: req.user._id,
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      categories: categories || [],
      tags: tags || [],
      difficulty: difficulty || "beginner",
      readingTime: readingTime || Math.ceil(content.length / 1000),
      featuredImage,
      status: "pending",
      submittedAt: new Date(),
    });

    await submission.save();

    // Populate user info
    await submission.populate("userId", "name email username");

    console.log("✅ Post submitted successfully");

    res.status(201).json({
      success: true,
      message: "Post submitted for review",
      submission,
    });
  } catch (error) {
    console.error("❌ Error submitting post:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ userId })
      .sort({ submittedAt: -1 })
      .lean();

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("❌ Error getting user submissions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get pending submissions (admin only)
export const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ status: "pending" })
      .populate("userId", "name email username avatar")
      .sort({ submittedAt: -1 })
      .lean();

    console.log(`📦 Found ${submissions.length} pending submissions`);

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("❌ Error getting pending submissions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("userId", "name email username avatar")
      .populate("reviewedBy", "name email");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check permissions
    const isOwner =
      submission.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this submission",
      });
    }

    res.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("❌ Error getting submission:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update submission
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check permissions
    const isOwner = submission.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this submission",
      });
    }

    // Can only update if still pending
    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a reviewed submission",
      });
    }

    Object.assign(submission, updates);
    await submission.save();

    res.json({
      success: true,
      message: "Submission updated successfully",
      submission,
    });
  } catch (error) {
    console.error("❌ Error updating submission:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete submission
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check permissions
    const isOwner = submission.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this submission",
      });
    }

    await Submission.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting submission:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Approve submission (admin only)
export const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("\n" + "=".repeat(60));
    console.log("🔍 APPROVAL PROCESS STARTED");
    console.log("=".repeat(60));
    console.log("📋 Submission ID:", id);
    console.log("👤 Admin:", req.user.name, `(${req.user._id})`);

    // Find submission without populate first
    const submission = await Submission.findById(id);

    if (!submission) {
      console.log("❌ Submission not found");
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    console.log("✅ Submission found:", submission.title);
    console.log("📝 Status:", submission.status);
    console.log("👤 Submitted by userId:", submission.userId);

    if (submission.status !== "pending") {
      console.log("⚠️ Submission is not pending");
      return res.status(400).json({
        success: false,
        message: `Submission is ${submission.status}, not pending`,
      });
    }

    // Get author ID
    let authorId = submission.userId;
    if (!authorId) {
      console.log("⚠️ No userId in submission, using admin as author");
      authorId = req.user._id;
      submission.userId = authorId;
      await submission.save();
    }
    console.log("✍️ Author ID:", authorId);

    // Generate slug from title
    const slug = submission.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    console.log("🔗 Generated slug:", slug);

    // Check if post with same slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      console.log("⚠️ Post with same slug already exists");
      return res.status(400).json({
        success: false,
        message: "A post with this title already exists",
      });
    }

    // Handle mainImage - convert from featuredImage
    let mainImage = null;
    if (submission.featuredImage) {
      // If it's a URL string, convert to Post model format
      if (typeof submission.featuredImage === "string") {
        mainImage = {
          url: submission.featuredImage,
          alt: submission.title,
        };
      } else if (typeof submission.featuredImage === "object") {
        mainImage = submission.featuredImage;
      }
    }
    console.log("🖼️  Main image:", mainImage ? "Set" : "None");

    // Handle categories - empty array if no categories
    const categories = [];
    console.log("📂 Categories:", categories.length > 0 ? categories : "None");

    // Create new post from submission
    const postData = {
      title: submission.title,
      slug,
      content: submission.content,
      excerpt:
        submission.excerpt || submission.content.substring(0, 200) + "...",
      author: authorId,
      categories,
      tags: submission.tags || [],
      difficulty: submission.difficulty || "beginner",
      readingTime: submission.readingTime || 5,
      mainImage,
      status: "published",
      publishedAt: new Date(),
      views: 0,
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      isFeatured: false,
    };

    console.log("📦 Creating post with data:");
    console.log("   - Title:", postData.title);
    console.log("   - Slug:", postData.slug);
    console.log("   - Author:", postData.author);
    console.log("   - Tags:", postData.tags.length);
    console.log("   - Difficulty:", postData.difficulty);

    const post = new Post(postData);
    await post.save();

    console.log("✅ Post created successfully:", post._id);

    // Update category post counts (if any categories)
    if (categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: categories } },
        { $inc: { postsCount: 1 } }
      );
      console.log("📊 Updated category counts");
    }

    // Update submission status
    submission.status = "approved";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.sanityPostId = post._id.toString(); // Store MongoDB post ID
    await submission.save();

    console.log("✅ Submission marked as approved");

    // Update user's posts count
    await User.findByIdAndUpdate(authorId, {
      $inc: { postsCount: 1 },
    });

    console.log("👤 Updated user posts count");

    // Populate submission for response
    await submission.populate("userId", "name email username");

    console.log("=".repeat(60));
    console.log("✅ APPROVAL PROCESS COMPLETED SUCCESSFULLY");
    console.log("=".repeat(60) + "\n");

    res.json({
      success: true,
      message: "Submission approved and published",
      submission,
      post,
    });
  } catch (error) {
    console.log("=".repeat(60));
    console.error("❌ APPROVAL PROCESS FAILED");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.log("=".repeat(60) + "\n");

    res.status(500).json({
      success: false,
      message: "Server error during approval",
      error: error.message,
    });
  }
};

// Reject submission (admin only)
export const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log("\n" + "=".repeat(60));
    console.log("🔍 REJECTION PROCESS STARTED");
    console.log("=".repeat(60));
    console.log("📋 Submission ID:", id);
    console.log("👤 Admin:", req.user.name);
    console.log("📝 Reason:", reason);

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      console.log("❌ Submission not found");
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    console.log("✅ Submission found:", submission.title);

    if (submission.status !== "pending") {
      console.log("⚠️ Submission is not pending");
      return res.status(400).json({
        success: false,
        message: `Submission is ${submission.status}, not pending`,
      });
    }

    submission.status = "rejected";
    submission.rejectionReason = reason;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();

    await submission.save();

    console.log("✅ Submission rejected successfully");
    console.log("=".repeat(60));
    console.log("✅ REJECTION PROCESS COMPLETED");
    console.log("=".repeat(60) + "\n");

    res.json({
      success: true,
      message: "Submission rejected",
      submission,
    });
  } catch (error) {
    console.log("=".repeat(60));
    console.error("❌ REJECTION PROCESS FAILED");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.log("=".repeat(60) + "\n");

    res.status(500).json({
      success: false,
      message: "Server error during rejection",
      error: error.message,
    });
  }
};

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
      mainImage,
    } = req.body;

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
      mainImage,
      status: "pending",
      submittedAt: new Date(),
    });

    await submission.save();

    // Populate user info
    await submission.populate("userId", "name email username");

    res.status(201).json({
      success: true,
      message: "Post submitted for review",
      submission,
    });
  } catch (error) {
    console.error("Error submitting post:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    console.error("Error getting user submissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get pending submissions (admin only)
export const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ status: "pending" })
      .populate("userId", "name email username image")
      .sort({ submittedAt: -1 })
      .lean();

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error getting pending submissions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate("userId", "name email username image")
      .populate("reviewedBy", "name email");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check permissions
    if (
      submission.userId._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
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
    console.error("Error getting submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    if (
      submission.userId.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
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
    console.error("Error updating submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
    if (
      submission.userId.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
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
    console.error("Error deleting submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve submission (admin only)
export const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id).populate(
      "userId",
      "name email username"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Submission is not pending",
      });
    }

    // Generate slug from title
    const slug = submission.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if post with same slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "A post with this title already exists",
      });
    }

    // Create new post from submission
    const post = new Post({
      title: submission.title,
      slug,
      content: submission.content,
      excerpt: submission.excerpt,
      categories: submission.categories,
      tags: submission.tags,
      difficulty: submission.difficulty,
      readingTime: submission.readingTime,
      mainImage: submission.mainImage,
      author: submission.userId._id,
      status: "published",
      publishedAt: new Date(),
      submittedAt: submission.submittedAt,
      sourceSubmission: submission._id,
    });

    await post.save();

    // Update category post counts
    if (submission.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: submission.categories } },
        { $inc: { postCount: 1 } }
      );
    }

    // Update submission status
    submission.status = "approved";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.publishedPostId = post._id;
    await submission.save();

    res.json({
      success: true,
      message: "Submission approved and published",
      submission,
      post,
    });
  } catch (error) {
    console.error("Error approving submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject submission (admin only)
export const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Submission is not pending",
      });
    }

    submission.status = "rejected";
    submission.rejectionReason = reason;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();

    await submission.save();

    res.json({
      success: true,
      message: "Submission rejected",
      submission,
    });
  } catch (error) {
    console.error("Error rejecting submission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

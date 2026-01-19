import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Admin login with API key
export const adminLogin = async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin API key",
      });
    }

    // Create admin token
    const token = jwt.sign(
      {
        role: "admin",
        isApiKeyAuth: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        role: "admin",
        isApiKeyAuth: true,
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "author", "admin", "moderator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users (admin only)
export const getAdminUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow admins to delete themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all comments for moderation (admin only)
export const getAdminComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const query = {};

    if (search) {
      query.content = { $regex: search, $options: "i" };
    }

    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate("author", "name username image")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query),
    ]);

    // Attach post titles to comments
    const commentsWithPostTitle = await Promise.all(
      comments.map(async (comment) => {
        const post = await Post.findById(comment.postId).select("title slug");
        return { ...comment, post };
      })
    );

    res.json({
      success: true,
      comments: commentsWithPostTitle,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve/Unapprove comment
export const toggleCommentApproval = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.isApproved = !comment.isApproved;
    await comment.save();

    res.json({
      success: true,
      message: `Comment ${comment.isApproved ? "approved" : "unapproved"}`,
      comment,
    });
  } catch (error) {
    console.error("Error toggling comment approval:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update post commentsCount
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

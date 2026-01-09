// routes/user.routes.js
import express from "express";
import {
  getAuthorProfile,
  getUserProfile,
  getUserPosts,
  getUserLikedPosts,
  getUserSubmissions,
  getUserBookmarks,
  toggleBookmark,
  getUserStats,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowing,
  updateProfile,
} from "../controllers/user.controller.js";
import { authenticate, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/author/:username", getAuthorProfile);
router.get("/:userId/profile", optionalAuth, getUserProfile);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

// Protected routes
router.get("/me/profile", authenticate, getUserProfile);
router.get("/me/posts", authenticate, getUserPosts);
router.get("/me/likes", authenticate, getUserLikedPosts);
router.get("/me/submissions", authenticate, getUserSubmissions);
router.get("/me/bookmarks", authenticate, getUserBookmarks);
router.get("/me/stats", authenticate, getUserStats);
router.post("/me/bookmark/:postId", authenticate, toggleBookmark);
router.post("/me/follow/:userId", authenticate, followUser);
router.delete("/me/unfollow/:userId", authenticate, unfollowUser);
router.get("/me/check-follow/:userId", authenticate, checkFollowing);
router.put("/me/profile", authenticate, updateProfile);

export default router;

import { Router } from "express";
import {
  getPosts,
  getPostBySlug,
  getRecentPosts,
  getFeaturedPosts,
  getPopularPosts,
  getRelatedPosts,
  createPost,
  updatePost,
  deletePost,
  incrementViewCount,
  regenerateSummary,
  getAdminPosts,
} from "../controllers/post.controller.js";
import {
  authenticate,
  isAdmin,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const router = Router();

// PUBLIC ROUTES
router.get("/", getPosts); // GET /api/posts?page=1&limit=12&category=xxx&sort=newest
router.get("/recent", getRecentPosts); // GET /api/posts/recent?limit=6
router.get("/featured", getFeaturedPosts); // GET /api/posts/featured
router.get("/popular", getPopularPosts); // GET /api/posts/popular?limit=3
router.get("/slug/:slug", optionalAuth, getPostBySlug); // GET /api/posts/slug/:slug
router.get("/related/:postId", getRelatedPosts); // GET /api/posts/related/:postId?limit=3
router.patch("/:id/view", incrementViewCount); // Increment view count

// AUTHENTICATED ROUTES (Users can create/edit their own posts)
router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

// ADMIN ROUTES
router.get("/admin/all", authenticate, isAdmin, getAdminPosts);
router.post("/:id/summary", authenticate, isAdmin, regenerateSummary);

export default router;

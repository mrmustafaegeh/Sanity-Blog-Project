import { Router } from "express";
import { getPosts } from "../controllers/getPosts.controller.js";
import { getPostBySlug } from "../controllers/getPostBySlug.controller.js";
import { getRecentPosts } from "../controllers/getRecentPosts.controller.js";
import { regenerateSummary } from "../controllers/post.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// PUBLIC ROUTES
router.get("/", getPosts); // GET /api/posts?page=1&limit=12&category=xxx&sort=newest
router.get("/recent", getRecentPosts); // GET /api/posts/recent?limit=3
router.get("/:slug", getPostBySlug); // GET /api/posts/:slug

// ADMIN ROUTES
router.post("/:id/summary", adminAuth, regenerateSummary);

export default router;

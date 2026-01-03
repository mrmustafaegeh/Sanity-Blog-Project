// backend/src/routes/post.routes.js
import { Router } from "express";
import { getPosts } from "../controllers/getPosts.controller.js";
import { getPostBySlug } from "../controllers/getPostBySlug.controller.js";
import { regenerateSummary } from "../controllers/post.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// PUBLIC ROUTES - Add these!
router.get("/", getPosts); // GET /api/posts
router.get("/:slug", getPostBySlug); // GET /api/posts/:slug

// ADMIN ROUTES
router.post("/:id/summary", adminAuth, regenerateSummary);

export default router;

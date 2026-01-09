import express from "express";
import {
  regenerateSummary,
  processNewPost,
} from "../controllers/aiSummary.controller.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Regenerate summary for existing post (admin only)
router.post("/:id", authenticate, isAdmin, regenerateSummary);

// Webhook for new posts (can be called from submission approval)
router.post("/webhook", authenticate, isAdmin, processNewPost);

export default router;

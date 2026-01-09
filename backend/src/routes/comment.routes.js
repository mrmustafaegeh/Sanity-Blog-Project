import { Router } from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Public route - get comments for a post
router.get("/post/:postId", getComments);

// Authenticated routes
router.post("/post/:postId", authenticate, addComment);
router.put("/:id", authenticate, updateComment);
router.delete("/:id", authenticate, deleteComment);
router.post("/:id/like", authenticate, likeComment);

export default router;

import { Router } from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:postId", getComments);
router.post("/:postId", authenticate, addComment);
router.delete("/delete/:id", authenticate, deleteComment);

export default router;

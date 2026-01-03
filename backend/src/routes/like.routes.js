import { Router } from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:postId", authenticate, toggleLike);

export default router;

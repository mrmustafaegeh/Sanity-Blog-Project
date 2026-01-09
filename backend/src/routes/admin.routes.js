// routes/admin.routes.js
import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminAnalytics.controller.js";
import {
  getAdminPosts,
  deletePost,
  updatePostStatus,
} from "../controllers/post.controller.js";
import { updateUserRole } from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authenticate, isAdmin);

// Analytics
router.get("/analytics", getAdminAnalytics);

// Posts management
router.get("/posts", getAdminPosts);
router.delete("/posts/:id", deletePost);
router.patch("/posts/:id/status", updatePostStatus);

// User management
router.patch("/users/:userId/role", updateUserRole);

export default router;

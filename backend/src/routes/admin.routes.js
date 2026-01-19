// routes/admin.routes.js
import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminAnalytics.controller.js";
import {
  getAdminPosts,
  deletePost,
  updatePostStatus,
} from "../controllers/post.controller.js";
import { 
  updateUserRole, 
  getAdminUsers, 
  deleteUser,
  getAdminComments,
  toggleCommentApproval,
  deleteComment
} from "../controllers/admin.controller.js";
import { seedPlatformData } from "../controllers/adminSeed.controller.js";

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authenticate, isAdmin);

// Data Seeding (Bulk generation)
router.post("/seed", seedPlatformData);

// Analytics
router.get("/analytics", getAdminAnalytics);

// Posts management
router.get("/posts", getAdminPosts);
router.delete("/posts/:id", deletePost);
router.patch("/posts/:id/status", updatePostStatus);

// User management
router.get("/users", getAdminUsers);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// Comment management
router.get("/comments", getAdminComments);
router.patch("/comments/:commentId/toggle-approval", toggleCommentApproval);
router.delete("/comments/:commentId", deleteComment);

export default router;

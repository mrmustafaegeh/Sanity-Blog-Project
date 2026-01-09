import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/getCategories.controller.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin routes
router.post("/", authenticate, isAdmin, createCategory);
router.put("/:id", authenticate, isAdmin, updateCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

export default router;

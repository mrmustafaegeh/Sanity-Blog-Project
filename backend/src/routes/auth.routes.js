import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.patch("/update-profile", authenticate, updateProfile);
router.patch("/update-password", authenticate, updatePassword);

export default router;

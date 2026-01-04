import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
  uploadProfileImage,
  validateRegistration, // Add this
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public routes with validation
router.post("/register", validateRegistration, register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.patch("/update-profile", authenticate, updateProfile);
router.patch("/update-password", authenticate, updatePassword);

// Profile image upload (with multer middleware)
router.post(
  "/upload-profile-image",
  authenticate,
  upload.single("profileImage"),
  uploadProfileImage
);

export default router;

// backend/src/routes/submissionRoutes.js
import express from "express";
import {
  submitPost,
  getUserSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  updateSubmission,
  uploadImage,
} from "../controllers/submissionController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import postUpload from "../middleware/postUpload.middleware.js";

const router = express.Router();

// User routes
router.post("/upload-image", authenticate, postUpload.single("image"), uploadImage);
router.post("/", authenticate, submitPost);
router.get("/user", authenticate, getUserSubmissions);
router.get("/:id", authenticate, getSubmissionById);
router.put("/:id", authenticate, updateSubmission);
router.delete("/:id", authenticate, deleteSubmission);

// Admin routes
router.get("/admin/pending", authenticate, isAdmin, getPendingSubmissions);
router.post("/:id/approve", authenticate, isAdmin, approveSubmission);
router.post("/:id/reject", authenticate, isAdmin, rejectSubmission);

export default router;

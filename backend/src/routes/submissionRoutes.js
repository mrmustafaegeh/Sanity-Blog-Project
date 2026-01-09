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
} from "../controllers/submissionController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
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

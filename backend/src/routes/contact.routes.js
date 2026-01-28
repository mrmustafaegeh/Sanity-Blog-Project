import { Router } from "express";
import {
  createContact,
  getContacts,
  deleteContact,
  markAsRead,
} from "../controllers/contact.controller.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/", createContact);

// Admin routes
router.get("/", authenticate, isAdmin, getContacts);
router.delete("/:id", authenticate, isAdmin, deleteContact);
router.patch("/:id/read", authenticate, isAdmin, markAsRead);

export default router;

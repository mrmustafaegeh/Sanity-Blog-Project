import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { adminLogin } from "../controllers/adminAuth.controller.js";

const router = express.Router();

// Admin login (special route with API key)
router.post("/login", adminLogin);

// All routes below require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Add your admin-only routes here
router.get("/dashboard", (req, res) => {
  res.json({
    message: "Welcome to admin dashboard",
    user: req.user,
  });
});

// ... other admin routes

export default router;

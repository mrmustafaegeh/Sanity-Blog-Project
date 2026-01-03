import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { adminLogin } from "../controllers/adminAuth.controller.js";
import { getAdminAnalytics } from "../controllers/adminAnalytics.controller.js";

const router = express.Router();

// Login
router.post("/login", adminLogin);

// Protected admin routes
router.use(authenticate, isAdmin);

// Dashboard analytics
router.get("/analytics", getAdminAnalytics);

export default router;

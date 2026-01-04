import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminAnalytics.controller.js";

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authenticate, isAdmin);

router.get("/analytics", getAdminAnalytics);

export default router;

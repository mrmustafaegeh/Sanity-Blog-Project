import { Router } from "express";
import { issueAdminToken } from "../controllers/adminAuth.controller.js";

const router = Router();

router.post("/token", issueAdminToken);

export default router;

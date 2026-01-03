import { Router } from "express";
import { incrementView } from "../controllers/view.controller.js";

const router = Router();

router.post("/:postId/view", incrementView);

export default router;

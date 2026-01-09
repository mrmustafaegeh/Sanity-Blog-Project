import { Router } from "express";
import { searchPosts } from "../controllers/searchPosts.controller.js";

const router = Router();

router.get("/", searchPosts); // GET /api/search?q=query&page=1&limit=10

export default router;

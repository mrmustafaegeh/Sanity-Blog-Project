import { Router } from "express";
import { generateSitemap } from "../controllers/sitemap.controller.js";

const router = Router();

router.get("/", generateSitemap);

export default router;

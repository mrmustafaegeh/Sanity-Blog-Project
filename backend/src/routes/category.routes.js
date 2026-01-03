// backend/src/routes/category.routes.js
import { Router } from "express";
import { getCategories } from "../controllers/getCategories.controller.js";

const router = Router();

router.get("/", getCategories);

export default router;

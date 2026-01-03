import express from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.post("/admin/login", (req, res) => {
  const { apiKey } = req.body;

  // 1. Validate API key
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    throw new AppError("Invalid admin API key", 401);
  }

  // 2. Issue JWT
  const token = jwt.sign(
    {
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  // 3. Return token
  res.status(200).json({
    token,
  });
});

export default router;

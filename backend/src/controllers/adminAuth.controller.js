// src/controllers/adminAuth.controller.js
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const issueAdminToken = (req, res) => {
  const apiKey = req.headers["x-admin-key"];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    throw new AppError("Invalid admin API key", 401);
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.status(200).json({ token });
};

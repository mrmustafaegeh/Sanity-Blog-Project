import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains userId, email, and role
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only.", 403));
  }
  next();
};

// Optional: for future moderator features
export const isModerator = (req, res, next) => {
  if (!["admin", "moderator"].includes(req.user.role)) {
    return next(new AppError("Access denied. Moderator or Admin only.", 403));
  }
  next();
};

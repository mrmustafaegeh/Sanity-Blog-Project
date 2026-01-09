// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Main authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (excluding password)
    const user = await User.findById(decoded.id || decoded.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
      });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

/**
 * Admin role check middleware
 * Must be used after authenticate middleware
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

/**
 * Moderator role check middleware
 * Must be used after authenticate middleware
 */
export const isModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!["admin", "moderator"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Moderator or Admin only.",
    });
  }

  next();
};

/**
 * Author role check middleware
 * Must be used after authenticate middleware
 */
export const isAuthor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!["admin", "author", "moderator"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Author, Moderator or Admin only.",
    });
  }

  next();
};

/**
 * Optional authentication middleware
 * Sets req.user if token exists, but doesn't require it
 * Allows public access with optional user context
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id || decoded.userId).select(
          "-password"
        );

        if (user && user.isActive) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    // Don't throw error for optional auth
    console.log("Optional auth error (non-critical):", error.message);
    next();
  }
};

/**
 * Check if user owns the resource or is admin
 * Must be used after authenticate middleware
 */
export const isOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId =
      typeof resourceUserId === "function"
        ? resourceUserId(req)
        : resourceUserId;

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't own this resource.",
      });
    }

    next();
  };
};

/**
 * Rate limiting helper (optional)
 * You can integrate with express-rate-limit if needed
 */
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
};

/**
 * Generate JWT token utility
 * Can be used in auth controller
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

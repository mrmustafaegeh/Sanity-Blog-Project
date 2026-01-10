// backend/src/middleware/authMiddleware.js
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

    if (user.isActive === false) {
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

    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

/**
 * Admin role check middleware
 * Must be used after authenticate middleware
 */
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check both role and isAdmin flag for backward compatibility
    if (req.user.role !== "admin" && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "Admin check error",
      error: error.message,
    });
  }
};

/**
 * Moderator role check middleware
 * Must be used after authenticate middleware
 */
export const isModerator = (req, res, next) => {
  try {
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
  } catch (error) {
    console.error("❌ Moderator check error:", error);
    return res.status(500).json({
      success: false,
      message: "Moderator check error",
      error: error.message,
    });
  }
};

/**
 * Author role check middleware
 * Must be used after authenticate middleware
 */
export const isAuthor = (req, res, next) => {
  try {
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
  } catch (error) {
    console.error("❌ Author check error:", error);
    return res.status(500).json({
      success: false,
      message: "Author check error",
      error: error.message,
    });
  }
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
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Get user from database
          const user = await User.findById(decoded.id || decoded.userId).select(
            "-password"
          );

          if (user && user.isActive !== false) {
            req.user = user;
          }
        } catch (error) {
          // If token is invalid, just continue without user
          console.log(
            "Optional auth token invalid (non-critical):",
            error.message
          );
        }
      }
    }

    next();
  } catch (error) {
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
    try {
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
        !req.user.isAdmin &&
        req.user._id.toString() !== userId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You don't own this resource.",
        });
      }

      next();
    } catch (error) {
      console.error("❌ Owner check error:", error);
      return res.status(500).json({
        success: false,
        message: "Ownership check error",
        error: error.message,
      });
    }
  };
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

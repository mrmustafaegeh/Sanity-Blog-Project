import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const adminLogin = (req, res, next) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      throw new AppError("Invalid admin API key", 401);
    }

    // For admin login via API key, we create a special admin token
    const token = jwt.sign(
      {
        role: "admin",
        isApiKeyAuth: true,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        role: "admin",
        isApiKeyAuth: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

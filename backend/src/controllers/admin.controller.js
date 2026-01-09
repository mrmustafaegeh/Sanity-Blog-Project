import jwt from "jsonwebtoken";

// Admin login with API key
export const adminLogin = async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin API key",
      });
    }

    // Create admin token
    const token = jwt.sign(
      {
        role: "admin",
        isApiKeyAuth: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        role: "admin",
        isApiKeyAuth: true,
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "author", "admin", "moderator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const User = require("../models/User.js");
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

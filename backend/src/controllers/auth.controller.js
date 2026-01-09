import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// Register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user - FIXED VERSION
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user WITH password field (important!)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated", 403);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Convert to safe object (without password)
    const userResponse = user.toSafeObject
      ? user.toSafeObject()
      : user.toObject();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user info
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout (optional - mainly for cleanup on frontend)
export const logout = async (req, res, next) => {
  try {
    // With JWT, logout is handled on frontend by removing token
    // This endpoint can be used for logging or cleanup if needed
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get user with password field - IMPORTANT!
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    // Get the Cloudinary URL
    const imageUrl = req.file.path;

    // Update user with new profile image
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true, select: "-password" }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: imageUrl,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isAdmin: user.role === "admin",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add validation helper function
export const validateRegistration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

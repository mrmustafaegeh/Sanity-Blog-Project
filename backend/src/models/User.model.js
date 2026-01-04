import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Remove password when converting to JSON
        return ret;
      },
    },
  }
);

// Option 1: Async/Await (Recommended) - NO next parameter
userSchema.pre("save", async function () {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return;

  try {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  } catch (error) {
    throw error;
  }
});

// Compare password method - FIXED VERSION
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Since password is select: false, we need to check if it's available
    if (!this.password) {
      // If password is not available, fetch user with password
      const userWithPassword = await this.model("User")
        .findById(this._id)
        .select("+password");
      if (!userWithPassword) {
        return false;
      }
      return await bcrypt.compare(candidatePassword, userWithPassword.password);
    }

    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    throw error;
  }
};

// Optional: Method to get user without password
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import path from "path";
import { fileURLToPath } from "url";

// ESM fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const resetPassword = async () => {
  try {
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.error("❌ Usage: node resetPassword.js <email> <newPassword>");
      process.exit(1);
    }

    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password updated for user: ${user.email}`);
    
    // Cleanup
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetPassword();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🔍 Looking for admin with email: mr.mustafaegeh@gmail.com");

    // Find and update the admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const result = await User.findOneAndUpdate(
      { email: "mr.mustafaegeh@gmail.com" },
      {
        $set: {
          password: hashedPassword,
          role: "admin",
          name: "Admin",
        },
      },
      {
        upsert: true, // Create if doesn't exist
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (result) {
      console.log("✅ Admin account updated successfully!");
      console.log("📧 Email: mr.mustafaegeh@gmail.com");
      console.log("🔑 New Password: admin123");
      console.log("👤 Role: admin");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

resetAdminPassword();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Import models with correct path
const User = (await import(join(__dirname, "../models/User.js"))).default;

const users = [
  {
    name: "Admin User",
    email: "admin@blog.com",
    password: "admin123",
    role: "admin",
    bio: "Site administrator and lead editor",
    avatar: "https://i.pravatar.cc/150?img=1",
    isVerified: true,
  },
  {
    name: "John Doe",
    email: "john@blog.com",
    password: "john123",
    role: "author",
    bio: "Tech enthusiast and writer with 5+ years of experience",
    avatar: "https://i.pravatar.cc/150?img=5",
    isVerified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@blog.com",
    password: "jane123",
    role: "author",
    bio: "Food and travel blogger exploring culinary delights worldwide",
    avatar: "https://i.pravatar.cc/150?img=8",
    isVerified: true,
  },
  {
    name: "Alex Johnson",
    email: "alex@blog.com",
    password: "alex123",
    role: "author",
    bio: "Fitness expert and nutritionist specializing in holistic health",
    avatar: "https://i.pravatar.cc/150?img=11",
    isVerified: true,
  },
  {
    name: "Sarah Williams",
    email: "sarah@blog.com",
    password: "sarah123",
    role: "author",
    bio: "Travel writer and photographer capturing moments around the globe",
    avatar: "https://i.pravatar.cc/150?img=15",
    isVerified: true,
  },
  {
    name: "Mike Brown",
    email: "mike@blog.com",
    password: "mike123",
    role: "user",
    bio: "Tech enthusiast and avid reader",
    avatar: "https://i.pravatar.cc/150?img=20",
    isVerified: true,
  },
  {
    name: "Emma Wilson",
    email: "emma@blog.com",
    password: "emma123",
    role: "user",
    bio: "Digital marketer and content creator",
    avatar: "https://i.pravatar.cc/150?img=25",
    isVerified: true,
  },
];

async function seedUsers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/blogdb"
    );
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    console.log(`\n✅ Successfully created ${createdUsers.length} users`);
    console.log("\n📋 Sample user credentials:");
    console.log("👑 Admin: admin@blog.com / admin123");
    console.log("✍️  Author: john@blog.com / john123");
    console.log("👤 Regular user: mike@blog.com / mike123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    if (error.errors) {
      console.log("Validation errors:", Object.keys(error.errors));
    }
    process.exit(1);
  }
}

seedUsers();

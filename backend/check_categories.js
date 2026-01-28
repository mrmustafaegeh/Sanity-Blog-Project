
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./src/models/Category.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/blog_db"); // Default or env
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

const run = async () => {
    await connectDB();
    const categories = await Category.find({});
    console.log("Found categories:", categories.length);
    categories.forEach(c => {
        console.log(`Title: "${c.title}", Slug: "${c.slug}" (Type: ${typeof c.slug})`);
        if (typeof c.slug === 'object') {
            console.log('  Slug content:', c.slug);
        }
    });
    process.exit();
};

run();

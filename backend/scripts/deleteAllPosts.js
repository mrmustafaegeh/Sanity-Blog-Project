import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import Post from "../src/models/Post.js";

dotenv.config();

const deleteAllPosts = async () => {
  try {
    await connectDB();

    const result = await Post.deleteMany({});
    console.log(`🗑️ Successfully deleted ${result.deletedCount} posts`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to delete posts:", error);
    process.exit(1);
  }
};

deleteAllPosts();

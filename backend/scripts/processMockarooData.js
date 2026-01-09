import mongoose from "mongoose";
import Post from "../src/models/Post.js";
import User from "../src/models/User.js";
import Category from "../src/models/Category.js";
import dotenv from "dotenv";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import crypto from "crypto";

dotenv.config();

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

// Function to generate AI hash
function generateAIHash(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

// Function to generate AI summary
function generateAISummary(content) {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(" ");
}

// Process the CSV data
async function processAndImportData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get sample users and categories from your database
    const users = await User.find().limit(10);
    const categories = await Category.find();

    if (users.length === 0 || categories.length === 0) {
      throw new Error("Please create users and categories first");
    }

    // Read the raw Mockaroo CSV
    const rawData = fs.readFileSync("./data/raw_posts.csv", "utf-8");
    const rows = rawData.split("\n").slice(1); // Skip header

    const processedPosts = [];

    for (let i = 0; i < rows.length; i++) {
      if (i >= 100) break; // Limit to 100 posts for testing

      const columns = rows[i].split(",");
      if (columns.length < 8) continue;

      const [
        title,
        content,
        excerpt,
        tags,
        readingTime,
        views,
        likesCount,
        status,
        difficulty,
      ] = columns;

      // Clean up the data
      const cleanTitle = title.replace(/"/g, "").trim();
      const cleanContent = content.replace(/"/g, "").trim();
      const cleanTags = tags ? tags.split(".").map((tag) => tag.trim()) : [];

      // Randomly select author and categories
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCategories = [
        categories[Math.floor(Math.random() * categories.length)]._id,
      ];

      const post = {
        title: cleanTitle,
        slug: generateSlug(cleanTitle),
        excerpt: excerpt || generateAISummary(cleanContent),
        content: cleanContent,
        mainImage: {
          url: `https://picsum.photos/800/400?random=${i}`,
          alt: cleanTitle.substring(0, 50),
          assetId: `image_${Date.now()}_${i}`,
        },
        author: randomUser._id,
        categories: randomCategories,
        tags: cleanTags.slice(0, 5), // Limit to 5 tags
        difficulty: difficulty || "beginner",
        readingTime: parseInt(readingTime) || 5,
        views: parseInt(views) || 0,
        likes: [], // Will be populated based on likesCount
        likesCount: parseInt(likesCount) || 0,
        commentsCount: Math.floor(Math.random() * 50),
        aiSummary: generateAISummary(cleanContent),
        aiHash: generateAIHash(cleanContent),
        status: status || "published",
        isFeatured: Math.random() > 0.8, // 20% chance
        featuredAt: Math.random() > 0.8 ? new Date() : null,
        publishedAt: status === "published" ? new Date() : null,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date in last 30 days
        updatedAt: new Date(),
      };

      processedPosts.push(post);
    }

    // Option 1: Save to JSON for manual review
    fs.writeFileSync(
      "./data/processed_posts.json",
      JSON.stringify(processedPosts, null, 2)
    );
    console.log(`Processed ${processedPosts.length} posts and saved to JSON`);

    // Option 2: Import directly to MongoDB
    await Post.deleteMany({});
    const insertedPosts = await Post.insertMany(processedPosts);
    console.log(`Imported ${insertedPosts.length} posts to database`);

    // Update likes array based on likesCount
    for (const post of insertedPosts) {
      if (post.likesCount > 0) {
        // Randomly assign likes to users
        const randomUsers = users
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(post.likesCount, 5))
          .map((user) => user._id);

        await Post.findByIdAndUpdate(post._id, {
          $set: { likes: randomUsers },
        });
      }
    }

    console.log("Data import completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error processing data:", error);
    process.exit(1);
  }
}

processAndImportData();

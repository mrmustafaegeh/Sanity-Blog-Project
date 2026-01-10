import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

import connectDB from "../src/config/database.js";
import Post from "../src/models/Post.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "../data/posts.csv");

// 🔴 MUST be a real User _id
const DEFAULT_AUTHOR_ID = "6961454b5265e7d2d9e7433d";

console.log("📄 Reading CSV from:", csvPath);

const importPosts = async () => {
  const posts = [];
  const slugCounts = {}; // Track slug usage to handle duplicates

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      if (!row.title || !row.content) return;

      const publishedAt = row.publishedAt
        ? new Date(row.publishedAt)
        : undefined;

      const excerpt = row.content.split(" ").slice(0, 30).join(" ") + "...";

      // Generate unique slug
      let baseSlug = slugify(row.title, { lower: true, strict: true });
      let slug = baseSlug;

      // If slug exists in this batch, append a number
      if (slugCounts[baseSlug]) {
        slugCounts[baseSlug]++;
        slug = `${baseSlug}-${slugCounts[baseSlug]}`;
      } else {
        slugCounts[baseSlug] = 1;
      }

      posts.push({
        title: row.title.trim(),
        slug,
        excerpt,
        content: row.content,
        author: DEFAULT_AUTHOR_ID,
        tags:
          row.tags
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) || [],
        publishedAt: isNaN(publishedAt) ? undefined : publishedAt,
        status: "published",
      });
    })
    .on("end", async () => {
      try {
        console.log(`📊 Parsed ${posts.length} posts from CSV`);

        // Optional: clear old posts
        const deleteResult = await Post.deleteMany();
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing posts`);

        // Use bulkWrite with upsert to handle any remaining duplicates
        const operations = posts.map((post) => ({
          updateOne: {
            filter: { slug: post.slug },
            update: { $set: post },
            upsert: true,
          },
        }));

        const result = await Post.bulkWrite(operations);

        console.log(`✅ Import completed:`);
        console.log(`   - Inserted: ${result.upsertedCount}`);
        console.log(`   - Updated: ${result.modifiedCount}`);
        console.log(
          `   - Total: ${result.upsertedCount + result.modifiedCount} posts`
        );

        process.exit(0);
      } catch (error) {
        console.error("❌ Import failed:", error);
        process.exit(1);
      }
    })
    .on("error", (error) => {
      console.error("❌ CSV parsing error:", error);
      process.exit(1);
    });
};

importPosts();

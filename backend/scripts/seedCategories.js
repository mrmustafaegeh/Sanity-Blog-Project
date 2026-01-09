import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Import models with correct path
const Category = (await import(join(__dirname, "../models/Category.js")))
  .default;

const categories = [
  {
    title: "Technology",
    description: "Latest tech news, gadgets, and innovations",
  },
  {
    title: "Health & Wellness",
    description: "Tips for healthy living and wellness",
  },
  {
    title: "Travel",
    description: "Travel guides, tips, and destination reviews",
  },
  {
    title: "Food & Cooking",
    description: "Recipes, cooking techniques, and food reviews",
  },
  {
    title: "Fashion & Beauty",
    description: "Style trends, beauty tips, and fashion advice",
  },
  {
    title: "Fitness",
    description: "Workout routines, fitness tips, and exercise guides",
  },
  {
    title: "Career & Business",
    description: "Professional development and business insights",
  },
  {
    title: "Personal Finance",
    description: "Money management, investing, and financial tips",
  },
  {
    title: "Education",
    description: "Learning resources and educational content",
  },
  {
    title: "Arts & Culture",
    description: "Creative arts, cultural events, and artistic expressions",
  },
  {
    title: "Science",
    description: "Scientific discoveries, research, and innovations",
  },
  {
    title: "Environment",
    description: "Eco-friendly living and sustainability tips",
  },
  {
    title: "Parenting",
    description: "Childcare advice and family-related content",
  },
  {
    title: "Sports",
    description: "Sports news, analysis, and athlete profiles",
  },
  {
    title: "Entertainment",
    description: "Movies, TV shows, music, and celebrity news",
  },
  {
    title: "Psychology",
    description: "Mental health, behavior insights, and psychology",
  },
  {
    title: "Self-Improvement",
    description: "Personal growth and self-development strategies",
  },
  {
    title: "Real Estate",
    description: "Property buying, selling, and home investment tips",
  },
  {
    title: "Automotive",
    description: "Car reviews, maintenance, and automotive news",
  },
  { title: "Gaming", description: "Video games, esports, and gaming culture" },
  {
    title: "Books & Literature",
    description: "Book reviews, author interviews, and literary discussions",
  },
  {
    title: "Music",
    description: "Music reviews, artist features, and industry news",
  },
  {
    title: "Photography",
    description: "Photography tips, techniques, and equipment reviews",
  },
  {
    title: "DIY & Crafts",
    description: "Do-it-yourself projects and craft tutorials",
  },
  {
    title: "Gardening",
    description: "Gardening tips, plant care, and landscaping ideas",
  },
  {
    title: "Politics",
    description: "Political news, analysis, and current events",
  },
  {
    title: "History",
    description: "Historical events, figures, and educational content",
  },
  {
    title: "Pets",
    description: "Pet care, animal welfare, and pet-related advice",
  },
  {
    title: "Relationships",
    description: "Dating advice, relationship tips, and social dynamics",
  },
  {
    title: "Home Improvement",
    description: "Home renovation, decor, and DIY home projects",
  },
];

async function seedCategories() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/blogdb"
    );
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Create categories
    const createdCategories = [];
    for (const catData of categories) {
      // Auto-generate slug from title
      const slug = catData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      const category = await Category.create({
        title: catData.title,
        slug: slug,
        description: catData.description,
        isActive: true,
      });
      createdCategories.push(category);
      console.log(
        `Created category: ${category.title} (slug: ${category.slug})`
      );
    }

    console.log(
      `\n✅ Successfully created ${createdCategories.length} categories`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    process.exit(1);
  }
}

seedCategories();

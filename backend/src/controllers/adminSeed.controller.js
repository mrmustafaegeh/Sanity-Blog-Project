import { faker } from "@faker-js/faker";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Category from "../models/Category.js";
import slugify from "slugify";

export const seedPlatformData = async (req, res) => {
  try {
    const { count = 100, clean = false } = req.body;
    
    // Safety check: only allow up to 1000 items per request
    const limit = Math.min(count, 1000);

    if (clean) {
      await Post.deleteMany({ isSeedData: true }); // We'll tag seed data
      await Comment.deleteMany({ isSeedData: true });
    }

    // 1. Get or Create Categories
    let categories = await Category.find();
    if (categories.length === 0) {
      const catTitles = ["Technology", "Lifestyle", "Business", "Health", "Education", "Travel"];
      const catDocs = catTitles.map(title => ({
        title,
        slug: slugify(title, { lower: true }),
        description: faker.lorem.sentence()
      }));
      categories = await Category.insertMany(catDocs);
    }

    // 2. Create Seed Authors/Users
    const authors = await User.find({ role: { $in: ["author", "admin"] } }).limit(10);
    const regularUsers = await User.find({ role: "user" }).limit(100);

    // 3. Generate Posts
    const postsToInsert = [];
    for (let i = 0; i < limit; i++) {
        const title = faker.lorem.sentence({ min: 5, max: 10 });
        const author = authors[Math.floor(Math.random() * authors.length)];
        const postCategories = [categories[Math.floor(Math.random() * categories.length)]._id];
        
        const views = faker.number.int({ min: 100, max: 10000 });
        const likesCount = faker.number.int({ min: 10, max: Math.min(views, 1000) });
        
        postsToInsert.push({
            title,
            slug: slugify(title, { lower: true }) + "-" + faker.string.alphanumeric(5),
            excerpt: faker.lorem.paragraph(1),
            content: faker.lorem.paragraphs(5, "<br/><br/>"),
            author: author._id,
            categories: postCategories,
            status: "published",
            views,
            likesCount,
            commentsCount: 0, // Will update after comments
            difficulty: faker.helpers.arrayElement(["beginner", "intermediate", "advanced"]),
            isFeatured: Math.random() > 0.9,
            publishedAt: faker.date.past(),
            isSeedData: true, // Mark so we can cleanup
            mainImage: {
                url: `https://picsum.photos/seed/${faker.string.uuid()}/800/600`,
                alt: title
            }
        });
    }

    const insertedPosts = await Post.insertMany(postsToInsert);

    // 4. Generate Comments for some posts
    const commentsToInsert = [];
    for (const post of insertedPosts) {
        const commentCount = faker.number.int({ min: 0, max: 15 });
        for (let j = 0; j < commentCount; j++) {
            const user = regularUsers[Math.floor(Math.random() * regularUsers.length)] || authors[0];
            commentsToInsert.push({
                postId: post._id.toString(),
                author: user._id,
                content: faker.lorem.sentence(),
                isApproved: true,
                isSeedData: true
            });
        }
        // Update post comment count
        await Post.findByIdAndUpdate(post._id, { commentsCount: commentCount });
    }

    await Comment.insertMany(commentsToInsert);

    res.json({
      success: true,
      message: `Successfully seeded ${limit} posts and associated data.`,
      summary: {
          posts: limit,
          categories: categories.length
      }
    });

  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, message: "Error during data seeding", error: error.message });
  }
};

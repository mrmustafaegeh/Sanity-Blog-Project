// backend/scripts/testSubmission.js
import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import Submission from "../src/models/Submission.js";
import User from "../src/models/User.js";

dotenv.config();

const createTestSubmissions = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Find a user to create submissions
    const user = await User.findOne();

    if (!user) {
      console.log("❌ No users found. Please create a user first.");
      process.exit(1);
    }

    console.log(`👤 Using user: ${user.name} (${user._id})`);

    // Clear existing pending submissions (optional)
    const deleted = await Submission.deleteMany({ status: "pending" });
    console.log(
      `🗑️  Deleted ${deleted.deletedCount} existing pending submissions`
    );

    // Create test submissions
    const testSubmissions = [
      {
        userId: user._id,
        title: "Understanding JavaScript Closures in Depth",
        content: `Closures are one of the most powerful features in JavaScript. A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).

## What is a Closure?

A closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

## Example

\`\`\`javascript
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## Use Cases

1. Data privacy
2. Function factories
3. Callbacks and event handlers
4. Module pattern

## Conclusion

Understanding closures is essential for mastering JavaScript. They enable powerful programming patterns and are fundamental to JavaScript's functional programming capabilities.`,
        excerpt:
          "Learn how closures work in JavaScript and why they're so powerful...",
        tags: ["JavaScript", "Programming", "Web Development"],
        difficulty: "intermediate",
        readingTime: 8,
        featuredImage:
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
        status: "pending",
      },
      {
        userId: user._id,
        title: "Building Scalable REST APIs with Node.js",
        content: `REST APIs are the backbone of modern web applications. In this guide, we'll build a production-ready REST API with Node.js and Express.

## Setting Up

First, let's set up our Express server:

\`\`\`javascript
import express from 'express';
const app = express();

app.use(express.json());
app.listen(3000);
\`\`\`

## RESTful Routes

Follow REST conventions:
- GET /api/resources - List all
- POST /api/resources - Create
- GET /api/resources/:id - Get one
- PUT /api/resources/:id - Update
- DELETE /api/resources/:id - Delete

## Error Handling

Always implement centralized error handling:

\`\`\`javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  });
});
\`\`\`

## Authentication

Use JWT for stateless authentication:

\`\`\`javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
\`\`\`

## Conclusion

Following these patterns will help you build robust, scalable APIs that can grow with your application.`,
        excerpt:
          "Learn best practices for building production-ready REST APIs with Node.js...",
        tags: ["Node.js", "REST API", "Express", "Backend"],
        difficulty: "intermediate",
        readingTime: 10,
        featuredImage:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        status: "pending",
      },
      {
        userId: user._id,
        title: "CSS Grid Layout: A Complete Guide",
        content: `CSS Grid is a powerful layout system that makes it easier to create complex, responsive layouts. Let's master it together.

## What is CSS Grid?

CSS Grid Layout is a two-dimensional layout system for the web. It lets you layout content in rows and columns, and has many features that make building complex layouts straightforward.

## Basic Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## Grid Areas

You can name grid areas for easier layout management:

\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
\`\`\`

## Responsive Grid

Make your grid responsive without media queries:

\`\`\`css
.container {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
\`\`\`

## Alignment

Control alignment easily:

\`\`\`css
.container {
  justify-items: center;
  align-items: center;
}
\`\`\`

## Conclusion

CSS Grid is a game-changer for web layouts. Start using it in your projects today!`,
        excerpt:
          "Master CSS Grid with this comprehensive guide covering all essential concepts...",
        tags: ["CSS", "Web Design", "Frontend", "Layout"],
        difficulty: "beginner",
        readingTime: 7,
        featuredImage:
          "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
        status: "pending",
      },
    ];

    // Insert submissions
    const created = await Submission.insertMany(testSubmissions);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Test submissions created successfully!");
    console.log("=".repeat(60));
    console.log(`📊 Total created: ${created.length} submissions`);
    console.log("\nSubmissions:");
    created.forEach((sub, idx) => {
      console.log(`   ${idx + 1}. ${sub.title}`);
      console.log(`      ID: ${sub._id}`);
      console.log(`      Status: ${sub.status}`);
      console.log(`      Tags: ${sub.tags.join(", ")}`);
      console.log("");
    });
    console.log("=".repeat(60));
    console.log("\n🎯 Next steps:");
    console.log(
      "   1. Go to your admin panel: http://localhost:5173/admin/pending"
    );
    console.log("   2. Try approving or rejecting these submissions");
    console.log("   3. Check your backend console for detailed logs");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

createTestSubmissions();

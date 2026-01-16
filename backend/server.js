import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import postRoutes from "./src/routes/post.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js"; // Add this
import viewRoutes from "./src/routes/view.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import likeRoutes from "./src/routes/like.routes.js";
import submissionRoutes from "./src/routes/submission.routes.js";
import aiSummaryRoutes from "./src/routes/aiSummary.routes.js"; // Add this
import sitemapRoutes from "./src/routes/sitemap.routes.js"; // Add this

dotenv.config();

const app = express();

connectDB();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
  })
);

// Body parser middleware
app.use(express.json({ limit: "50mb" })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// API Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Add this line
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/views", viewRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai-summary", aiSummaryRoutes); // Add this
app.use("/api/sitemap.xml", sitemapRoutes); // Add this

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Blog API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      posts: "/api/posts",
      categories: "/api/categories",
      search: "/api/search",
      admin: "/api/admin",
      auth: "/api/auth",
      users: "/api/users", // Add this
      likes: "/api/likes",
      comments: "/api/comments",
      views: "/api/views",
      submissions: "/api/submissions",
      aiSummary: "/api/ai-summary",
      sitemap: "/api/sitemap.xml",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Server is running!                ║
  ║   📍 Port: ${PORT}                        ║
  ║   🌍 URL: http://localhost:${PORT}       ║
  ╚════════════════════════════════════════╝
  `);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

export default app;

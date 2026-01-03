// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./src/routes/post.routes.js";
import categoryRoutes from "./src/routes/category.routes.js"; // NEW
import searchRoutes from "./src/routes/search.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
  })
);

app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes); // NEW
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api`);
});

export default app;

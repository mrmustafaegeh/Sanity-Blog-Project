// frontend/src/router.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostsListPage from "./pages/PostsListPage";
import SinglePostPage from "./pages/SinglePostPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPostsPage from "./pages/CategoriesPage"; // NEW
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/form/Login";
import ProtectedRoute from "./features/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<PostsListPage />} />
      <Route path="/blog/:slug" element={<SinglePostPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:slug" element={<CategoryPostsPage />} />{" "}
      {/* NEW */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

// frontend/src/router/index.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Blog from "./pages/BlogPage";
import PostDetail from "./pages/PostDetail";
import Categories from "./pages/CategoriesPage";
import Login from "./pages/form/Login";
import Register from "./pages/form/Register";
import Profile from "./pages/ProfilePage";
import SubmitPost from "./pages/SubmitPost";
import UserSubmissions from "./pages/UserSubmissions";
import PendingPosts from "./pages/admin/PendingPosts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AdminRoute from "./pages/admin/AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/posts/:slug" element={<PostDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Authenticated Users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <SubmitPost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/submissions"
        element={
          <ProtectedRoute>
            <UserSubmissions />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/pending"
        element={
          <AdminRoute>
            <PendingPosts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <div>Analytics Page</div>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

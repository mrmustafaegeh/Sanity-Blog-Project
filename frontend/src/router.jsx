// frontend/src/router/index.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import BlogListPage from "./pages/PostsListPage";
import SinglePostPage from "./pages/SinglePostPage";
import Categories from "./pages/CategoriesPage";
import Login from "./pages/form/Login";
import Register from "./pages/form/Register";
import Profile from "./pages/ProfilePage";
import SubmitPost from "./pages/SubmitPost";
import UserSubmissions from "./pages/UserSubmissions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminComments from "./pages/admin/AdminComments";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AdminRoute from "./pages/admin/AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<BlogListPage />} />

      {/* FIXED: Changed from /posts/:slug to /blog/:slug */}
      <Route path="/blog/:slug" element={<SinglePostPage />} />

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
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/comments"
        element={
          <AdminRoute>
            <AdminComments />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

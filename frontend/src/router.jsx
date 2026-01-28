// frontend/src/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./utils/ErrorBoundary";

import ProtectedRoute from "./features/auth/ProtectedRoute";
import AdminRoute from "./pages/admin/AdminRoute";

// Lazy routes
const Home = lazy(() => import("./pages/HomePage"));
const BlogListPage = lazy(() => import("./pages/PostsListPage"));
const SinglePostPage = lazy(() => import("./pages/SinglePostPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryPostsPage = lazy(() => import("./pages/CategoryPostsPage"));
const Login = lazy(() => import("./pages/form/Login"));
const Register = lazy(() => import("./pages/form/Register"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const SubmitPost = lazy(() => import("./pages/SubmitPost"));
const UserSubmissions = lazy(() => import("./pages/UserSubmissions"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminComments = lazy(() => import("./pages/admin/AdminComments"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));

function RouteFallback() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

const S = ({ children }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <S>
              <Home />
            </S>
          }
        />
        <Route
          path="/blog"
          element={
            <S>
              <BlogListPage />
            </S>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <S>
              <SinglePostPage />
            </S>
          }
        />
        <Route
          path="/categories"
          element={
            <S>
              <CategoriesPage />
            </S>
          }
        />
        <Route
          path="/categories/:slug"
          element={
            <S>
              <CategoryPostsPage />
            </S>
          }
        />
        <Route 
          path="/contact" 
          element={
            <S>
              <ContactPage />
            </S>
          }
        />
        <Route
          path="/login"
          element={
            <S>
              <Login />
            </S>
          }
        />
        <Route
          path="/register"
          element={
            <S>
              <Register />
            </S>
          }
        />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <S>
                <Profile />
              </S>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <S>
                <SubmitPost />
              </S>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/submissions"
          element={
            <ProtectedRoute>
              <S>
                <UserSubmissions />
              </S>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <S>
                <AdminDashboard />
              </S>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <S>
                <AdminUsers />
              </S>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminRoute>
              <S>
                <AdminComments />
              </S>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminRoute>
              <S>
                <AdminMessages />
              </S>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <S>
                <AdminSettings />
              </S>
            </AdminRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

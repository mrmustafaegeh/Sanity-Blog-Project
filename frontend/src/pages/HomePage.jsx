// frontend/src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import {
  useGetRecentPostsQuery,
  useGetFeaturedPostsQuery,
  useGetCategoriesQuery,
  useGetPopularPostsQuery,
} from "../api/postsAPI";
import { Calendar, User, ArrowRight, Clock, TrendingUp } from "lucide-react";
import FeaturedPost from "../components/blog/FeaturedPost";
import PostCard from "../components/blog/PostCard";
import LoadingGrid from "../components/ui/LoadingGrid";
import ErrorState from "../components/ui/ErrorState";

export default function HomePage() {
  const {
    data: recentPosts = [],
    isLoading: recentLoading,
    isError: recentError,
    error: recentErrorObj,
  } = useGetRecentPostsQuery(6);

  const {
    data: featuredPosts = [],
    isLoading: featuredLoading,
    isError: featuredError,
  } = useGetFeaturedPostsQuery(1);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: popularPosts = [],
    isLoading: popularLoading,
    isError: popularError,
  } = useGetPopularPostsQuery(3);

  const featuredPost = featuredPosts[0] || recentPosts[0] || null;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-emerald-700">
                  Trending Topic
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                A Deep Dive into{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Modern Web Development
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Learn about the latest trends, tools, and frameworks shaping the
                future of web development. From AI integration to performance
                optimization, we cover it all.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/blog"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-2xl blur-xl opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Web Development"
                className="relative rounded-xl shadow-2xl w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>
          <Link
            to="/categories"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-xl animate-shimmer"
              />
            ))}
          </div>
        ) : categoriesError ? (
          <ErrorState message="Failed to load categories" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category.slug}`}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:scale-105 transition-transform duration-200 hover:shadow-md border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {category.title}
                  </h3>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {category.postCount || 0} articles
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Post */}
      {featuredLoading ? (
        <div className="h-96 bg-gray-200 rounded-2xl animate-shimmer" />
      ) : featuredError ? null : featuredPost ? (
        <FeaturedPost post={featuredPost} />
      ) : null}

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Recent Articles
          </h2>
          <Link
            to="/blog"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
          >
            <span>View All Posts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLoading ? (
          <LoadingGrid count={3} />
        ) : recentError ? (
          <ErrorState
            message="Failed to load posts"
            error={recentErrorObj}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.slice(0, 6).map((post, index) => (
              <PostCard key={post._id} post={post} priority={index < 3} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Posts Sidebar */}
      {popularPosts.length > 0 && (
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Recent posts grid would go here */}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Popular Now</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug?.current}`}
                    className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {post.readingTime || 5} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Never Miss an Update
          </h2>
          <p className="text-emerald-100">
            Subscribe to our newsletter and get the latest articles delivered
            directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// frontend/src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import {
  useGetRecentPostsQuery,
  useGetFeaturedPostsQuery,
  useGetCategoriesQuery,
  useGetPopularPostsQuery,
} from "../api/postsAPI";
import { Calendar, User, ArrowRight, Clock, TrendingUp, Sparkles, Eye, Heart, Zap } from "lucide-react";
import FeaturedPost from "../components/blog/FeaturedPost";
import PostCard from "../components/blog/PostCard";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useRef } from "react";

export default function HomePage() {
  const {
    data: recentPosts = [],
    isLoading: recentLoading,
    isError: recentError,
  } = useGetRecentPostsQuery(6);

  const {
    data: featuredPosts = [],
    isLoading: featuredLoading,
  } = useGetFeaturedPostsQuery(1);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const {
    data: popularPosts = [],
  } = useGetPopularPostsQuery(3);

  const featuredPost = featuredPosts[0] || recentPosts[0] || null;

  // Scroll Reveal Refs
  const heroTextRef = useScrollReveal({ delay: 100 }, 'left');
  const heroCardRef = useScrollReveal({ delay: 300 }, 'right');
  const categoriesRef = useScrollReveal({ delay: 100 }, 'bottom');
  const recentPostsRef = useScrollReveal({ delay: 100 }, 'bottom');
  const popularRef = useScrollReveal({ delay: 100 }, 'bottom');
  const newsletterRef = useScrollReveal({ delay: 100, scale: [0.95, 1] }, 'bottom');

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section ref={heroTextRef} className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">Discover Premium Content</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Elevate Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                  Tech Knowledge
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                Dive deep into cutting-edge technologies, expert insights, and industry best practices. 
                Your journey to mastery starts here.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/blog"
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  Explore Articles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/categories"
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  Browse Topics
                </Link>
              </div>
            </div>

            {/* Featured Card */}
            {!featuredLoading && featuredPost && (
              <div ref={heroCardRef}>
                <Link
                  to={`/blog/${encodeURIComponent(featuredPost.slug?.current || featuredPost.slug)}`}
                  className="group relative block"
                >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-slate-800/90 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform-gpu">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={featuredPost.mainImage?.asset?.url || featuredPost.mainImage?.url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-emerald-500/20">
                        FEATURED
                      </span>
                      {featuredPost.categories?.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20">
                          {cat.title || cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {featuredPost.title}
                    </h3>
                    {featuredPost.excerpt && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{featuredPost.author?.name || 'Anonymous'}</p>
                          <p className="text-gray-500 text-xs">{featuredPost.readingTime || 5} min read</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        {featuredPost.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredPost.views > 1000 ? `${(featuredPost.views / 1000).toFixed(1)}k` : featuredPost.views}
                          </span>
                        )}
                        {featuredPost.likesCount && (
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {featuredPost.likesCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          </div>
        </section>

        {/* Categories Section */}
        <section ref={categoriesRef} className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore Topics</h2>
              <p className="text-gray-400">Find content that matches your interests</p>
            </div>
            <Link
              to="/categories"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-800/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category.slug?.current || category.slug}`}
                  className="group relative bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.03] overflow-hidden transform-gpu"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-lg">{category.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{category.description || 'Explore articles'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{category.postCount || 0} articles</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Posts */}
        <section ref={recentPostsRef} className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Articles</h2>
              <p className="text-gray-400">Fresh insights from industry experts</p>
            </div>
            <Link
              to="/blog"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 group"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-800/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : recentError ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-red-500/20">
              <p className="text-red-400">Failed to load posts. Please try again later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
                  className="group relative bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] transform-gpu"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.mainImage?.asset?.url || post.mainImage?.url || post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-4">
                      {post.categories?.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30 whitespace-nowrap">
                          {cat.title || cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt || post.aiSummary || 'Discover more...'}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-400 text-sm">{post.author?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{post.readingTime || post.estimatedReadingTime || 5} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Posts + CTA */}
        <section ref={popularRef} className="grid lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/10 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/20 transform-gpu">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Expert Authors</h4>
              <p className="text-gray-400 text-sm">Learn from industry professionals with real-world experience</p>
            </div>
            <div className="bg-cyan-500/10 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 transform-gpu">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Trending Topics</h4>
              <p className="text-gray-400 text-sm">Stay ahead with the latest in tech and development</p>
            </div>
            <div className="bg-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 transform-gpu">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Active Community</h4>
              <p className="text-gray-400 text-sm">Engage with thousands of fellow developers</p>
            </div>
          </div>

          {/* Trending Sidebar */}
          {popularPosts.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 sticky top-24 transform-gpu">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post._id}
                      to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {post.readingTime || 5} min read
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section ref={newsletterRef} className="mt-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join 50,000+ Developers
              </h2>
              <p className="text-emerald-100 text-lg mb-8">
                Get weekly insights, tutorials, and exclusive content delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-grow px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap shadow-lg">
                  Subscribe
                </button>
              </div>
              
              <p className="text-emerald-100/80 text-sm mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
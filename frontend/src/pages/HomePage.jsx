// frontend/src/components/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  useGetRecentPostsQuery,
  useGetFeaturedPostsQuery,
  useGetCategoriesQuery,
} from "../api/postsAPI";
import { ArrowRight, Loader2 } from "lucide-react";

import FeaturedPost from "../components/blog/FeaturedPost";
import PostCard from "../components/blog/PostCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function HomePage() {
  const { data: featuredPosts = [], isLoading: featuredLoading } =
    useGetFeaturedPostsQuery(1);

  const {
    data: recentPosts = [],
    isLoading: recentLoading,
    isError: recentError,
  } = useGetRecentPostsQuery(9);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const featuredPost = useMemo(
    () => featuredPosts[0] || recentPosts[0] || null,
    [featuredPosts, recentPosts]
  );

  // Filter recent posts to exclude the featured one if it's the same
  const filteredRecentPosts = useMemo(() => {
    if (!featuredPost) return recentPosts;
    return recentPosts.filter((p) => p._id !== featuredPost._id);
  }, [recentPosts, featuredPost]);

  if (featuredLoading || recentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (recentError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Failed to load content.</p>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Header / Intro */}
      <section className="text-center md:text-left space-y-6 pt-8 md:pt-12 border-b border-border pb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
          The Journal.
        </h1>
        <p className="text-xl md:text-2xl text-secondary max-w-2xl leading-relaxed">
          Insights on technology, safety, and the future of transportation.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Link to="/blog">
            <Badge
              variant="primary"
              size="md"
              className="px-4 py-2 rounded-full cursor-pointer hover:bg-neutral-800"
            >
              All Stories
            </Badge>
          </Link>
          {categories.slice(0, 5).map((cat) => (
             <Link key={cat._id} to={`/categories/${cat.slug?.current || cat.slug}`}>
              <Badge
                variant="outline"
                size="md"
                className="px-4 py-2 rounded-full cursor-pointer hover:bg-neutral-100 transition-colors"
               >
                {cat.title}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Hero */}
      {featuredPost && <FeaturedPost post={featuredPost} />}

      {/* Recent Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Latest Stories
          </h2>
          <Link to="/blog" className="text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1">
            View Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredRecentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-neutral-100 rounded-2xl p-12 text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-primary mb-4">
          Stay in the loop
        </h3>
        <p className="text-secondary mb-8 max-w-md mx-auto">
          Get the latest updates and industry insights delivered straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2.5 rounded-md border border-border focus:ring-2 focus:ring-neutral-200 outline-none"
          />
          <Button>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}

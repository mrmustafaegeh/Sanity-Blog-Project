// frontend/src/components/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetRecentPostsQuery,
  useGetFeaturedPostsQuery,
  useGetCategoriesQuery,
} from "../api/postsAPI";
import { ArrowRight, PenTool } from "lucide-react";

import FeaturedPost from "../components/blog/FeaturedPost";
import PostCard from "../components/blog/PostCard";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import LoadingGrid from "../components/ui/LoadingGrid";
import SEO from "../components/shared/SEO";

const FeaturedSkeleton = () => (
  <div className="mb-16 md:mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse">
    <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-[4/3] rounded-xl bg-neutral-200" />
    <div className="lg:col-span-5 flex flex-col justify-center space-y-4 lg:pl-4">
      <div className="h-6 w-24 bg-neutral-200 rounded-full" />
      <div className="h-12 w-3/4 bg-neutral-200 rounded-lg" />
      <div className="flex gap-3 pt-2">
        <div className="h-4 w-20 bg-neutral-200 rounded" />
        <div className="h-4 w-20 bg-neutral-200 rounded" />
      </div>
      <div className="h-20 w-full bg-neutral-200 rounded-lg" />
      <div className="h-8 w-32 bg-neutral-200 rounded mt-4" />
    </div>
  </div>
);

export default function HomePage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
      <SEO
        title="Blogify | The Journal"
        description="Insights on technology, safety, and the future of transportation."
      />

      {/* Header / Intro - Renders Immediately for LCP */}
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
            <Link
              key={cat._id}
              to={`/categories/${(cat.slug?.current || cat.slug || "").toLowerCase()}`}
            >
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

      {/* Featured / Hero - Skeleton or Content */}
      {featuredLoading ? (
        <FeaturedSkeleton />
      ) : (
        featuredPost && <FeaturedPost post={featuredPost} />
      )}

      {/* Create Post CTA for Logged In Users */}
      {isAuthenticated && (
        <section className="bg-neutral-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-3 justify-center md:justify-start">
                  Welcome back, {user?.name?.split(" ")[0] || "Writer"}
                  <PenTool className="w-6 h-6 text-neutral-400" />
                </h2>
                <p className="text-neutral-400 text-lg max-w-xl">
                  Have an insight to share? Contribute your knowledge to the community.
                </p>
             </div>
             <Link to="/submit">
                <Button variant="secondary" size="large" className="border-none whitespace-nowrap">
                   Create New Post
                </Button>
             </Link>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 -m-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
           <div className="absolute bottom-0 left-0 -m-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </section>
      )}

      {/* Recent Posts Grid - Skeleton or Content */}
      <section>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Latest Stories
          </h2>
          <Link
            to="/blog"
            className="text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            View Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLoading ? (
          <LoadingGrid count={9} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredRecentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
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
            aria-label="Email address for newsletter"
            className="flex-1 px-4 py-2.5 rounded-md border border-border focus:ring-2 focus:ring-neutral-200 outline-none"
          />
          <Button>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}

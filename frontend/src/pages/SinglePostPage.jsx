import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PortableText } from "@portabletext/react";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
  useGenerateAISummaryMutation,
} from "../api/postsAPI";
import { useToggleLikeMutation } from "../api/likesAPI";
import { useToggleBookmarkMutation } from "../api/usersAPI";
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import CommentSection from "../components/blog/CommentSection";
import AuthorBio from "../components/blog/AuthorBio";
import SanityImage from "../components/ui/SanityImage";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import clsx from "clsx";

export default function SinglePostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostBySlugQuery(slug, {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const [incrementView] = useIncrementViewCountMutation();
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();
  const [toggleBookmark, { isLoading: bookmarking }] =
    useToggleBookmarkMutation();
  const [generateAISummary, { isLoading: isGeneratingSummary }] =
    useGenerateAISummaryMutation();
  const [generatedSummary, setGeneratedSummary] = useState(null);

  // Initialize like and bookmark status
  useEffect(() => {
    if (post && user?._id) {
      const userId = user._id.toString();
      setIsLiked(
        post.likes?.some((id) => id?.toString() === userId) || false
      );
      const isBookmarkedInUser = user.bookmarks?.some(
        (id) => id?.toString() === post._id?.toString()
      );
      setIsBookmarked(!!(isBookmarkedInUser || post.isBookmarked));
    } else {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [post, user]);

  // AI Summary Typing Effect
  useEffect(() => {
    const currentSummary = generatedSummary || post?.aiSummary;
    if (
      showSummary &&
      currentSummary &&
      displayedSummary.length < currentSummary.length
    ) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedSummary(
          currentSummary.slice(0, displayedSummary.length + 1)
        );
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [showSummary, displayedSummary, post?.aiSummary, generatedSummary]);

  // Scroll Progress Logic
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollProgress = document.getElementById("scroll-progress");
      if (scrollProgress) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Increment view count
  useEffect(() => {
    if (post?._id) {
      incrementView(post._id);
    }
  }, [post?._id, incrementView]);

  // Handle like
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like this post");
      navigate("/login");
      return;
    }
    try {
      await toggleLike(post._id).unwrap();
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from likes" : "Added to likes");
    } catch {
      toast.error("Action failed");
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to bookmark posts");
      navigate("/login");
      return;
    }
    try {
      await toggleBookmark(post._id).unwrap();
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
      );
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const result = await generateAISummary(post._id).unwrap();
      setGeneratedSummary(result.aiSummary || result.post?.aiSummary);
      toast.success("AI Summary generated successfully!");
      setShowSummary(true);
      setDisplayedSummary(""); // Reset for typing effect
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate summary");
    }
  };

  // Share functionality
  const share = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post?.title || "");
    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };
    window.open(links[platform], "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  // PortableText components
  const ptComponents = {
    block: {
      h2: ({ children }) => (
        <h2 className="text-3xl font-serif font-bold text-primary mt-12 mb-6 tracking-tight">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-serif font-bold text-primary mt-10 mb-5 tracking-tight">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-semibold text-primary mt-8 mb-4">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-secondary bg-background py-2">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="text-lg leading-relaxed text-secondary mb-6 font-sans">
          {children}
        </p>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a
            href={value.href}
            rel={rel}
            target={value.href.startsWith("/") ? "_self" : "_blank"}
            className="text-primary hover:text-secondary underline decoration-1 underline-offset-2 transition-colors"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => (
        <strong className="font-bold text-primary">
          {children}
        </strong>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-2 my-6 text-secondary marker:text-primary">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-2 my-6 text-secondary marker:text-primary font-medium">
          {children}
        </ol>
      ),
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary mb-4">
          Post Not Found
        </h1>
        <p className="text-secondary mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const readingTime = post.estimatedReadingTime || post.readingTime || 5;
  const likesCount =
    (post.likesCount || post.likes?.length || 0) +
    (isLiked && !post.likes?.includes(user?._id) ? 1 : 0) -
    (!isLiked && post.likes?.includes(user?._id) ? 1 : 0);
  const viewsCount = post.views || post.viewCount || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
        <div
          id="scroll-progress"
          className="h-full bg-primary transition-all duration-150"
          style={{ width: "0%" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-[1000px] pt-12 md:pt-20">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
           <Link
              to="/blog"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            <div className="flex gap-2">
                 <button
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    className={clsx(
                        "p-2 rounded-full transition-colors",
                        isBookmarked ? "text-primary bg-primary/5" : "text-secondary hover:bg-neutral-100"
                    )}
                 >
                    {isBookmarked ? <BookmarkCheck className="w-5 h-5"/> : <Bookmark className="w-5 h-5"/>}
                 </button>
                 <div className="relative">
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 text-secondary hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    {showShareMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-20">
                             {[
                                { id: 'twitter', icon: Twitter, label: 'Twitter' },
                                { id: 'facebook', icon: Facebook, label: 'Facebook' },
                                { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                             ].map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => share(item.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 text-left text-primary text-sm"
                                 >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                 </button>
                             ))}
                             <div className="border-t border-border my-1"></div>
                             <button
                                onClick={copyLink}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 text-left text-primary text-sm"
                             >
                                <Copy className="w-4 h-4" />
                                Copy Link
                             </button>
                        </div>
                    )}
                 </div>
            </div>
        </div>

        {/* Header Content */}
        <div className="mb-10 text-center md:text-left">
           <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              {post.categories?.map((cat, i) => (
                <Badge key={i} variant="neutral">
                   {cat.title || cat}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-secondary text-sm md:text-base">
                 <div className="flex items-center gap-2">
                     {post.author?.image?.url ?
                        <img src={post.author.image.url} alt={post.author.name} className="w-8 h-8 rounded-full border border-border" /> :
                        <div className="w-8 h-8 rounded-full bg-neutral-200" />
                     }
                     <span className="font-medium text-primary">{post.author?.name || "Author"}</span>
                 </div>
                 <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                 <time dateTime={post.publishedAt || post.createdAt}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                         month: "short", day: "numeric", year: "numeric"
                    })}
                 </time>
                  <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                 <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {readingTime} min read
                 </div>
             </div>
        </div>

        {/* Main Image */}
        <div className="mb-16 rounded-xl overflow-hidden border border-border bg-neutral-100 aspect-video relative">
            <SanityImage
                 image={post.mainImage}
                 alt={post.title}
                 className="w-full h-full object-cover"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar (Left on Desktop) */}
            <aside className="lg:col-span-3 lg:order-last space-y-8">
                 <div className="sticky top-24">
                     <div className="border border-border p-6 rounded-xl bg-surface mb-8">
                        <h3 className="font-bold text-primary mb-4">Article Stats</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">Views</span>
                                <span className="font-medium text-primary">{viewsCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">Likes</span>
                                <span className="font-medium text-primary">{likesCount}</span>
                            </div>
                        </div>
                     </div>
                     
                     {/* Like Button (Floating Action) */}
                     <div className="flex flex-col gap-4">
                        <Button 
                            variant={isLiked ? "primary" : "outline"}
                            className="w-full justify-center gap-2"
                            onClick={handleLike}
                        >
                            <Heart className={clsx("w-4 h-4", isLiked && "fill-current")} />
                            {isLiked ? "Liked" : "Like this post"}
                        </Button>
                     </div>
                 </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9">
                 {/* AI Summary */}
                 {(post.aiSummary || generatedSummary) && (
                     <div className="mb-12 p-6 bg-neutral-50 border border-border rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                             <Sparkles className="w-5 h-5 text-primary" />
                             <h3 className="font-bold text-primary">AI Summary</h3>
                        </div>
                        
                        {!showSummary ? (
                            <Button variant="secondary" onClick={() => setShowSummary(true)} className="w-full">
                                Reveal Summary
                            </Button>
                        ) : (
                             <div className="space-y-4">
                                <p className="text-secondary leading-relaxed">
                                    {displayedSummary}
                                     {isTyping && <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />}
                                </p>
                                <button className="text-xs text-primary underline" onClick={() => setShowSummary(false)}>
                                    Hide
                                </button>
                             </div>
                        )}
                     </div>
                 )}

                 {/* Admin Generate AI */}
                 {!post.aiSummary && !generatedSummary && user?.role === "admin" && (
                     <div className="mb-8">
                         <Button variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                             {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
                         </Button>
                     </div>
                 )}

                 <article className="prose prose-lg prose-stone max-w-none text-secondary">
                      {post.body && <PortableText value={post.body} components={ptComponents} />}
                      {post.content && (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                      )}
                 </article>

                 <hr className="my-12 border-border" />
                 
                 <AuthorBio author={post.author} />
                 
                 <div className="mt-12">
                    <CommentSection postId={post._id} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
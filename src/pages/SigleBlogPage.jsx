import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../client";

export default function SingleBlogPage() {
  const [singlePost, setSinglePost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          slug,
          body,
          excerpt,
          publishedAt,
          author->{
            name,
            image{
              asset->{
                _id,
                url
              }
            }
          },
          categories[]->{title, slug},
          mainImage{
            asset->{
              _id,
              url
            }, 
            alt
          },
          "authorImage": author->image.asset->url,
          "authorName": author->name
        }`,
        { slug }
      )
      .then((data) => {
        setSinglePost(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#12725c]"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!singlePost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Article not found
          </h2>
          <p className="text-gray-500 mb-4">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/" className="px-4 py-2 bg-[#12725c] text-white rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format the published date
  const publishedDate = new Date(singlePost.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-4">
            {singlePost.categories &&
              singlePost.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#7fd3e6] text-gray-900 text-sm font-medium px-3 py-1 rounded-full mr-2"
                >
                  {category.title}
                </span>
              ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {singlePost.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            {singlePost.excerpt}
          </p>

          <div className="flex items-center">
            {singlePost.authorImage && (
              <img
                src={singlePost.authorImage}
                alt={singlePost.authorName}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div>
              <p className="font-semibold">{singlePost.authorName}</p>
              <p className="text-gray-400 text-sm">{publishedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {singlePost.mainImage && (
          <img
            src={singlePost.mainImage.asset.url}
            alt={singlePost.mainImage.alt || singlePost.title}
            className="w-full h-96 object-cover rounded-xl mb-10"
          />
        )}

        <div className="prose prose-lg max-w-none">
          {singlePost.body &&
            singlePost.body.map((block, i) => {
              if (block._type !== "block" || !block.children) return null;

              return (
                <p key={i} className="mb-6 text-gray-700 leading-relaxed">
                  {block.children.map((child, j) => (
                    <span key={j}>{child.text}</span>
                  ))}
                </p>
              );
            })}
        </div>

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Share this article
          </h3>
          <div className="flex space-x-4">
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors">
              <i className="fab fa-twitter"></i>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors">
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Related Posts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* These would be fetched from Sanity in a real implementation */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Design Principles for Modern Apps
              </h4>
              <p className="text-sm text-gray-600 mb-3">by Jane Smith</p>
              <p className="text-sm text-gray-500">August 12, 2024</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                The Future of Web Development
              </h4>
              <p className="text-sm text-gray-600 mb-3">by John Doe</p>
              <p className="text-sm text-gray-500">July 28, 2024</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Getting Started with React
              </h4>
              <p className="text-sm text-gray-600 mb-3">by Alex Johnson</p>
              <p className="text-sm text-gray-500">July 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Comments (3)
          </h3>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start mb-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-500">August 20, 2024</p>
                </div>
              </div>
              <p className="text-gray-700">
                Great article! I found the section about modern frameworks
                particularly insightful.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Jane Smith</h4>
                  <p className="text-sm text-gray-500">August 19, 2024</p>
                </div>
              </div>
              <p className="text-gray-700">
                Thanks for sharing this. I've been looking for resources on this
                topic and this was exactly what I needed.
              </p>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Leave a comment
            </h4>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-[#12725c] text-white rounded-lg hover:bg-[#0f5d4b] transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

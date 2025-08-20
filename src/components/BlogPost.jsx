// BlogPost.js
import React from "react";
import { Link } from "react-router-dom";

const BlogPost = ({ post }) => {
  return (
    <article
      key={post.slug?.current}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {post.mainImage?.asset?.url && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.mainImage.asset.url}
            alt={post.mainImage.alt || post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="mr-3">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {post.categories?.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {post.categories[0]?.title}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex justify-between items-center">
          {post.author?.name && (
            <p className="text-sm text-gray-500">By {post.author.name}</p>
          )}
          <Link
            to={`/blog/${post.slug.current}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read more
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;

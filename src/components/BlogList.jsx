// BlogPostList.js
import React from "react";
import BlogPost from "./BlogPost";

const BlogPostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogPost key={post.slug?.current} post={post} />
      ))}
    </div>
  );
};

export default BlogPostList;

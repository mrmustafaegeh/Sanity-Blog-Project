// Blog.js
import React, { useEffect, useState } from "react";
import client from "../client";
import BlogHeader from "../components/Blogheader";
import BlogPostList from "../components/BlogList";
import ComingSoon from "../components/Comming";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"]{
          title,
          slug,
          excerpt,
          publishedAt,
          author->{name},
          categories[]->{title},
          mainImage{
            asset->{
              _id,
              url
            }, 
            alt
          }
        }`
      )
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {posts.length > 0 ? <BlogPostList posts={posts} /> : <ComingSoon />}
      </main>
    </div>
  );
}

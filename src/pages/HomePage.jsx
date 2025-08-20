// HomePage.js
import React, { useEffect, useState } from "react";
import client from "../client"; // Ensure this is correctly set up to connect to your Sanity project

function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent posts from Sanity
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "post"] | order(publishedAt desc)[0..3] {
            title,
            slug,
            excerpt,
            publishedAt,
            author->{name},
            mainImage{
              asset->{
                _id,
                url
              },
              alt
            }
          }`
        );
        setRecentPosts(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const comments = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "L’ovtoiosubtient, vel sag nylpec qixot inatre",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Liqliksmolcia anne bacius",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            A Deep Dive into Modern Web Development
          </h1>
          <p className="text-gray-600 mb-6">
            Learn about the latest trends and tools shaping the modern web
            development world.
          </p>
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
            Term
          </span>
        </div>
        <div>
          <img
            src="/images.jpeg" // Adjusted to use an absolute path
            alt="Hero"
            className="rounded-xl shadow-lg w-full h-auto" // Added width and height properties
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-3">
          {["Categories", "Design", "Lifestyle", "Travel", "Programming"].map(
            (cat, index) => (
              <span
                key={index}
                className="bg-gray-100 hover:bg-[#7fd3e6] text-gray-700 px-4 py-2 rounded-full text-sm cursor-pointer transition"
              >
                {cat}
              </span>
            )
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Posts</h2>
        {loading ? (
          <p>Loading recent posts...</p>
        ) : error ? (
          <p className="text-red-500">
            Error loading posts. Please try again later.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <div
                key={post.slug.current}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={
                    post.mainImage?.asset?.url ||
                    "https://source.unsplash.com/600x400?writing"
                  }
                  alt={post.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    by {post.author?.name || "Anonymous"} –{" "}
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comments */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-4 p-4">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-gray-600 text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

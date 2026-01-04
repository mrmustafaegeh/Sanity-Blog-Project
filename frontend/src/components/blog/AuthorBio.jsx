// frontend/src/components/blog/AuthorBio.jsx
import { Twitter, Linkedin, Globe, Mail } from "lucide-react";

export default function AuthorBio({ author }) {
  if (!author) return null;

  // Helper function to extract text from Sanity portable text
  const extractTextFromBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return "";

    return blocks
      .map((block) => {
        if (!block.children || !Array.isArray(block.children)) return "";
        return block.children.map((child) => child?.text || "").join("");
      })
      .join(" ")
      .trim();
  };

  // Extract bio text if it's in portable text format, otherwise use as string
  const bioText =
    typeof author.bio === "string"
      ? author.bio
      : extractTextFromBlocks(author.bio) || "Content Creator";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={
              author.image?.asset?.url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=10b981&color=fff&bold=true`
            }
            alt={author.name}
            className="w-16 h-16 rounded-full border-4 border-white shadow"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{author.name}</h3>
              <p className="text-emerald-600 font-medium text-sm mt-1">
                {bioText}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
              Author
            </span>
          </div>

          <p className="text-gray-600 mt-3 text-sm">
            {author.description ||
              "Passionate writer sharing insights on technology, design, and development. Always learning and sharing knowledge with the community."}
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(Math.random() * 50) + 20}
              </p>
              <p className="text-xs text-gray-500">Articles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(Math.random() * 10000) + 5000}
              </p>
              <p className="text-xs text-gray-500">Readers</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3 mt-4">
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {author.linkedin && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            <button
              className="ml-auto px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center space-x-2"
              onClick={() =>
                (window.location.href = `mailto:${author.email || "contact@blogify.com"}`)
              }
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

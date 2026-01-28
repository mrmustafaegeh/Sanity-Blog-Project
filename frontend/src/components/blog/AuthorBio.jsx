// frontend/src/components/blog/AuthorBio.jsx
import { Twitter, Linkedin, Globe, Mail, ArrowUpRight } from "lucide-react";
import { getOptimizedUrl } from "../../utils/imageOptimizer";

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
    <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-100 transition-colors duration-500"></div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0 mx-auto md:mx-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl rotate-6 opacity-20 blur-sm"></div>
          <img
            src={
              author.image?.url 
                ? getOptimizedUrl(author.image.url, 200)
                : author.image?.asset?.url 
                  ? getOptimizedUrl(author.image.asset.url, 200)
                  : (typeof author.image === 'string' ? getOptimizedUrl(author.image, 200) : null) ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=10b981&color=fff&bold=true`
            }
            alt={author.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl relative z-10"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white z-20 flex items-center justify-center text-white shadow-lg">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">{author.name}</h3>
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/20">
                Author
              </span>
            </div>
            <p className="text-emerald-600 font-medium mt-1">
              {bioText.split('.')[0]}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm">
            {author.description ||
              "Passionate writer sharing insights on technology, design, and development. Always learning and sharing knowledge with the community."}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 py-4">
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 50) + 20}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Articles</p>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                <p className="text-2xl font-bold text-gray-900">{(Math.floor(Math.random() * 100) / 10).toFixed(1)}k</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Readers</p>
             </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            {[
              { icon: Twitter, href: author.twitter ? `https://twitter.com/${author.twitter}` : null, label: "Twitter" },
              { icon: Linkedin, href: author.linkedin, label: "LinkedIn" },
              { icon: Globe, href: author.website, label: "Website" }
            ].map((social, idx) => social.href && (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
            
            <button
              className="ml-auto md:ml-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 hover:-translate-y-0.5 flex items-center gap-2 group/btn"
              onClick={() =>
                (window.location.href = `mailto:${author.email || "contact@blogify.com"}`)
              }
            >
              <Mail size={16} />
              <span>Contact</span>
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// frontend/src/components/blog/TableOfContents.jsx
import { useState, useEffect } from "react";
import { List, ChevronRight } from "lucide-react";

export default function TableOfContents({ body }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!body) return;

    const extractedHeadings = body
      .filter((block) => block.style === "h2" || block.style === "h3")
      .map((block, index) => ({
        id: `heading-${index}`,
        text: block.children?.map((c) => c.text).join("") || "",
        level: block.style === "h2" ? 2 : 3,
      }));

    setHeadings(extractedHeadings);
  }, [body]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <List className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-900">Table of Contents</h3>
      </div>

      <nav className="space-y-2">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`flex items-start space-x-2 w-full text-left p-2 rounded-lg transition-colors ${
              activeId === heading.id
                ? "bg-emerald-100 text-emerald-700"
                : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight
              className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-transform ${
                activeId === heading.id ? "rotate-90" : ""
              }`}
            />
            <span className={`text-sm ${heading.level === 3 ? "ml-4" : ""}`}>
              {heading.text}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{headings.length} sections</span>
          <span>•</span>
          <span>~{Math.floor(headings.length * 2)} min</span>
        </div>
      </div>
    </div>
  );
}

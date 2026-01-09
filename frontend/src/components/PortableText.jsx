// frontend/src/components/PortableText.jsx
import { PortableText as SanityPortableText } from "@portabletext/react";
import { urlFor } from "../lib/sanityClient";

const components = {
  types: {
    image: ({ value }) => {
      return (
        <div className="my-6">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Post image"}
            className="rounded-lg shadow-md"
          />
          {value.caption && (
            <p className="text-center text-gray-600 text-sm mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
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
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mt-5 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-700 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-800">{children}</li>,
    number: ({ children }) => <li className="text-gray-800">{children}</li>,
  },
};

export default function PortableText({ value }) {
  return <SanityPortableText value={value} components={components} />;
}

import PropTypes from "prop-types";

export default function SanityImage({ image, alt, className, ...props }) {
  // If no image, return fallback or null
  if (!image?.asset?.url) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <img
      src={image.asset.url}
      alt={alt || image.alt || "Post image"}
      className={className}
      {...props}
    />
  );
}

SanityImage.propTypes = {
  image: PropTypes.shape({
    asset: PropTypes.shape({
      url: PropTypes.string,
    }),
    alt: PropTypes.string,
  }),
  alt: PropTypes.string,
  className: PropTypes.string,
};

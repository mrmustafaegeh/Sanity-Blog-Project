import { useState } from "react";
import {
  generateSrcSet,
  supportsOptimization,
} from "../../utils/imageOptimizer"; // Adjust path as needed

/**
 * OptimizedImage component for better performance
 * - Implements responsive images with srcset
 * - Supports modern image formats
 * - Prevents layout shift with explicit dimensions
 * - Handles loading states
 */
export default function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  width,
  height,
  sizes = "100vw",
  aspectRatio = "16/9",
  objectFit = "cover",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback image
  const fallbackImage =
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80";
  const imageSrc = src || fallbackImage;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse" />
      )}

      {/* Actual image */}
      <img
        src={imageSrc}
        srcSet={
          supportsOptimization(imageSrc) ? generateSrcSet(imageSrc) : undefined
        }
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{ objectFit }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
          <p className="text-gray-400 text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
}

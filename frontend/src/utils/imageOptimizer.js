/**
 * Checks if the given image URL supports optimization.
 * @param {string} url - The image URL.
 * @returns {boolean} - True if the URL supports optimization, false otherwise.
 */
export function supportsOptimization(url) {
  if (!url) return false;

  const optimizableServices = [
    "images.unsplash.com",
    "cdn.sanity.io",
    "cloudinary.com",
    "imgix.net",
  ];

  return optimizableServices.some((service) => url.includes(service));
}

/**
 * Generates a srcset string for responsive images.
 * Adds optimization parameters only for services that support them.
 * @param {string} baseUrl - The base image URL.
 * @param {number[]} widths - Array of widths for responsive images.
 * @param {string} separator - The separator for query parameters ("?" or "&").
 * @returns {string} - The srcset string.
 */
export function generateSrcSet(
  baseUrl,
  widths = [400, 600, 800, 1200],
  separator = "?"
) {
  if (!baseUrl) return "";

  const supportsOpt = supportsOptimization(baseUrl);

  return widths
    .map((w) => {
      if (supportsOpt) {
        // For services that support optimization
        return `${baseUrl}${separator}w=${w}&q=75&fm=webp ${w}w`;
      } else if (baseUrl.includes("picsum.photos")) {
        // Special case for picsum.photos
        const seedMatch = baseUrl.match(/seed\/([^/]+)/);
        if (seedMatch) {
          const seed = seedMatch[1];
          return `https://picsum.photos/seed/${seed}/${w}/${Math.round(w * 0.67)} ${w}w`;
        }
        // Fallback to regular picsum.photos format
        return `https://picsum.photos/${w}/${Math.round(w * 0.67)} ${w}w`;
      } else {
        // For other services, return the base URL with width descriptor
        return `${baseUrl} ${w}w`;
      }
    })
    .join(", ");
}

/**
 * Generates an optimized image URL for a given width.
 * @param {string} baseUrl - The base image URL.
 * @param {number} width - The desired width of the image.
 * @param {number} [quality=75] - The desired quality of the image.
 * @returns {string} - The optimized image URL.
 */
export function getOptimizedUrl(baseUrl, width, quality = 75) {
  if (!baseUrl) return "";

  const separator = baseUrl.includes("?") ? "&" : "?";
  const supportsOpt = supportsOptimization(baseUrl);

  if (supportsOpt) {
    // For services that support optimization
    return `${baseUrl}${separator}w=${width}&q=${quality}&fm=webp`;
  } else if (baseUrl.includes("picsum.photos")) {
    // Special case for picsum.photos
    const seedMatch = baseUrl.match(/seed\/([^/]+)/);
    if (seedMatch) {
      const seed = seedMatch[1];
      return `https://picsum.photos/seed/${seed}/${width}/${Math.round(width * 0.67)}`;
    }
    return `https://picsum.photos/${width}/${Math.round(width * 0.67)}`;
  }

  // For other services, return the base URL as is
  return baseUrl;
}

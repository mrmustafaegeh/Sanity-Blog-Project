// frontend/src/lib/client.jsx (or sanityClient.js)
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Check if environment variables exist
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "your-project-id";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-01-01";
const token = import.meta.env.VITE_SANITY_TOKEN || "";

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
  token,
});

// Create image URL builder using the new createImageUrlBuilder function
const imageBuilder = createImageUrlBuilder(client);

// Export urlFor function
export const urlFor = (source) => {
  return imageBuilder.image(source);
};

// Helper function for generating image URLs with options
export const getImageUrl = (source, options = {}) => {
  return imageBuilder.image(source).auto("format").fit("max").url();
};

// Export client by default
export default client;

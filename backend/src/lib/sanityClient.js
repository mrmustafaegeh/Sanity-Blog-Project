// backend/src/lib/sanityClient.js
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import dotenv from "dotenv";

dotenv.config();

// Check if environment variables exist
const projectId = process.env.SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_TOKEN || "";
const useCdn = process.env.NODE_ENV === "production";

// Create Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token,
});

// Create image URL builder using the new createImageUrlBuilder function
const imageBuilder = createImageUrlBuilder(sanityClient);

// Export urlFor function
export const urlFor = (source) => {
  return imageBuilder.image(source);
};

// Helper function for generating image URLs with options
export const getImageUrl = (source, options = {}) => {
  return imageBuilder.image(source).auto("format").fit("max").url();
};

// Export client by default
export default sanityClient;

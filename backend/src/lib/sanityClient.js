// backend/src/lib/sanityClient.js
import { createClient } from "@sanity/client";
import "dotenv/config";

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error("SANITY_PROJECT_ID is missing in .env");
}

export default sanityClient;

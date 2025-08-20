import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "9x7d4aru",
  dataset: "production",
  apiVersion: "2025-08-12",
  useCdn: true,
});

export default client;

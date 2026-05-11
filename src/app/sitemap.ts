import type { MetadataRoute } from "next";

const BASE_URL = "https://clayora.com";

// Add new routes here as pages are built.
// changeFrequency and priority should reflect actual update cadence.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

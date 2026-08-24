import type { MetadataRoute } from "next";
import { getJournalPosts } from "@/lib/content";

const BASE_URL = "https://gkcelebi.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/journal",
    "/photos",
    "/projects",
    "/resume",
    "/contact",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const journalRoutes = getJournalPosts().map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...journalRoutes];
}

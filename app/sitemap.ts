import type { MetadataRoute } from "next";

import { getAllLocalPageSlugs } from "@/lib/local-seo";
import { getAllServiceSlugs } from "@/lib/services";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/doctor"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: siteUrl("/testimonials"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: siteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const servicePages: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: siteUrl(`/services/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const localPages: MetadataRoute.Sitemap = getAllLocalPageSlugs().map((slug) => ({
    url: siteUrl(`/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: slug.startsWith("dental-implants") ? 0.85 : 0.8,
  }));

  return [...staticPages, ...servicePages, ...localPages];
}

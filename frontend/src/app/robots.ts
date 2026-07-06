import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep API endpoints out of the index. The noindex order/success & order/cancel
      // pages are intentionally left crawlable so Google can read their noindex tag.
      disallow: ["/api/"],
    },
    sitemap: "https://baysbakedgoods.com/sitemap.xml",
    host: "https://baysbakedgoods.com",
  };
}

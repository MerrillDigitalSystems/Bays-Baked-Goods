import type { MetadataRoute } from "next";
import { checkoutProducts } from "@/data/menu";

const base = "https://baysbakedgoods.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const productPages: MetadataRoute.Sitemap = checkoutProducts.map((product) => ({
    url: `${base}/menu/${product.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...productPages,
    { url: `${base}/order`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    {
      url: `${base}/custom-orders`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/catering`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/gift-baskets`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/weddings`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/delivery-areas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
  ];
}

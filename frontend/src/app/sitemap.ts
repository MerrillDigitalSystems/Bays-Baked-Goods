import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAvailableProducts } from "@/lib/content";

const base = "https://baysbakedgoods.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const now = new Date();
  const products = await getAvailableProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/menu/${product.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/seasonal`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/porch-pickup`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
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

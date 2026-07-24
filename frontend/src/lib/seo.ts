import type { Metadata } from "next";

export function webPageJsonLd(path: string, title: string) {
  const base = "https://baysbakedgoods.com";
  const url = path === "/" ? `${base}/` : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Bay's Baked Goods",
      url: "https://baysbakedgoods.com",
    },
  };
}

/** BreadcrumbList for a page's position in the site hierarchy (SERP breadcrumbs). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = "https://baysbakedgoods.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: it.name,
      item: it.path === "/" ? `${base}/` : `${base}${it.path}`,
    })),
  };
}

/** Combine entities; strips nested `@context` so a single root context applies. */
export function jsonLdGraph(...items: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((item) => {
      const o = item as Record<string, unknown>;
      const { ["@context"]: _c, ...rest } = o;
      return rest;
    }),
  };
}

/**
 * Share images live in `public/og/` and are always a real 1200x630 food photo,
 * never the square logo  -  for a bakery the share preview is the product shot.
 * Regenerate with `node scripts/generate-og-images.mjs`.
 */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const DEFAULT_OG_PATH = "/og/default.jpg";
const DEFAULT_OG_ALT =
  "A freshly baked sourdough boule with a scored crust from Bay's Baked Goods in West Jordan, Utah";

/** Canonical paths only; metadataBase in root layout completes full URLs. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  canonicalPath: string;
  /** 1200x630 image under `public/og/` (e.g. `/og/menu.jpg`). Defaults to the sourdough boule. */
  ogImagePath?: string;
  /** Describes the share image for screen readers and link previews. */
  ogImageAlt?: string;
}): Metadata {
  const { title, description, canonicalPath, ogImagePath, ogImageAlt } = opts;
  const images = [
    {
      url: ogImagePath ?? DEFAULT_OG_PATH,
      width: OG_WIDTH,
      height: OG_HEIGHT,
      alt: ogImageAlt ?? DEFAULT_OG_ALT,
    },
  ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalPath,
      siteName: "Bay's Baked Goods",
      images,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

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

const ogImage = {
  url: "/logo.png",
  width: 1200,
  height: 630,
} as const;

/** Canonical paths only; metadataBase in root layout completes full URLs. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  const { title, description, canonicalPath } = opts;
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
      images: [ogImage],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

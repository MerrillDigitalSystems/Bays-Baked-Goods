import { promises as fs } from "node:fs";
import path from "node:path";
import {
  checkoutCatalog as seedCatalog,
  checkoutProducts as seedProducts,
  customMenuItems as seedCustomItems,
} from "@/data/menu";

/**
 * Runtime content store  -  the single source of truth for products once Bailey
 * starts editing. Lives at `content/products.json` (gitignored, survives
 * deploys on the Pi). Until that file exists, everything derives from the
 * committed seed data in `src/data/menu.ts`, so a fresh checkout serves
 * exactly what it served before the admin panel existed.
 *
 * Every consumer (menu, order, checkout validation, Product schema, sitemap)
 * reads through this module so prices and photos cannot drift apart.
 * SEO invariants enforced here (see GSC history): Product schema prices are
 * numeric (derived from cents) and `image` is only emitted when the product
 * actually has a photo  -  never borrowed from another item.
 */

export type StoredVariant = {
  /** Stable id used by the cart and validated at checkout. */
  sku: string;
  /** e.g. "Mini", "4 pack", "One loaf" */
  shortLabel: string;
  unitAmountCents: number;
};

export type StoredProduct = {
  /** URL slug, also the product page path `/menu/<id>`. */
  id: string;
  title: string;
  description: string;
  /** Path under `public/` (e.g. `/uploads/xyz.jpg`). Absent = placeholder card, no schema image. */
  imageSrc?: string;
  /** CSS object-position for tall subjects. */
  imageObjectPosition?: string;
  /** 1200x630 share crop under `public/`. Committed `/og/<id>.jpg` for seed photos, `/og/dynamic/<id>.jpg` once Bailey swaps a photo. */
  ogImagePath?: string;
  allergens: string[];
  /** false hides the item from menu, order page, schema, and sitemap without deleting it. */
  available: boolean;
  variants: StoredVariant[];
};

export type StoredCustomItem = {
  name: string;
  smallLabel: string;
  smallPrice: string;
  largeLabel: string;
  largePrice: string;
};

export type SiteContent = {
  version: 1;
  updatedAt: string;
  products: StoredProduct[];
  customItems: StoredCustomItem[];
};

const SITE_URL = "https://baysbakedgoods.com";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const CONTENT_FILE = path.join(CONTENT_DIR, "products.json");

/** Seed derived from the committed menu data  -  what the site serves before Bailey's first edit. */
export function seedContent(): SiteContent {
  return {
    version: 1,
    updatedAt: "seed",
    products: seedProducts.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      ...(p.imageSrc ? { imageSrc: p.imageSrc, ogImagePath: `/og/${p.id}.jpg` } : {}),
      ...(p.imageObjectPosition ? { imageObjectPosition: p.imageObjectPosition } : {}),
      allergens: [...p.allergens],
      available: true,
      variants: p.variants.map((v) => ({
        sku: v.sku,
        shortLabel: v.shortLabel,
        unitAmountCents: seedCatalog[v.sku].unitAmount,
      })),
    })),
    customItems: seedCustomItems.map((c) => ({ ...c })),
  };
}

function isValidContent(data: unknown): data is SiteContent {
  if (typeof data !== "object" || data === null) return false;
  const d = data as SiteContent;
  return (
    d.version === 1 &&
    Array.isArray(d.products) &&
    Array.isArray(d.customItems) &&
    d.products.every(
      (p) =>
        typeof p.id === "string" &&
        typeof p.title === "string" &&
        Array.isArray(p.variants) &&
        p.variants.every(
          (v) =>
            typeof v.sku === "string" &&
            typeof v.shortLabel === "string" &&
            Number.isFinite(v.unitAmountCents) &&
            v.unitAmountCents > 0
        )
    )
  );
}

/** Read the store, falling back to the seed when the file is missing or unreadable. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (isValidContent(parsed)) return parsed;
    console.error("content/products.json failed validation - serving seed data");
    return seedContent();
  } catch {
    return seedContent();
  }
}

/**
 * Atomic write with a .bak of the previous version, so a bad save can be
 * recovered by hand on the Pi (`cp products.json.bak products.json`).
 */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  const json = JSON.stringify(content, null, 2);
  try {
    await fs.copyFile(CONTENT_FILE, `${CONTENT_FILE}.bak`);
  } catch {
    // first save - nothing to back up
  }
  const tmp = `${CONTENT_FILE}.tmp`;
  await fs.writeFile(tmp, json, "utf8");
  await fs.rename(tmp, CONTENT_FILE);
}

/* ------------------------------------------------------------------ */
/* Derived views                                                       */
/* ------------------------------------------------------------------ */

export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** Products shown to customers (available only). */
export async function getAvailableProducts(): Promise<StoredProduct[]> {
  const { products } = await getSiteContent();
  return products.filter((p) => p.available && p.variants.length > 0);
}

export async function getProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  const { products } = await getSiteContent();
  return products.find((p) => p.id === slug && p.available && p.variants.length > 0);
}

export async function getCustomItems(): Promise<StoredCustomItem[]> {
  const { customItems } = await getSiteContent();
  return customItems;
}

/** SKUs allowed at checkout  -  server-validated, unavailable items excluded. */
export async function getCheckoutCatalog(): Promise<
  Record<string, { label: string; unitAmount: number }>
> {
  const products = await getAvailableProducts();
  const catalog: Record<string, { label: string; unitAmount: number }> = {};
  for (const p of products) {
    for (const v of p.variants) {
      catalog[v.sku] = {
        label: p.variants.length > 1 ? `${p.title} (${v.shortLabel})` : p.title,
        unitAmount: v.unitAmountCents,
      };
    }
  }
  return catalog;
}

/** Price display for a variant, e.g. "$5". */
export function variantPriceDisplay(v: StoredVariant): string {
  return formatCents(v.unitAmountCents);
}

/** Menu-page summary row, e.g. size "Mini / Regular", price "$5 / $10". */
export function productSummary(p: StoredProduct): {
  name: string;
  size: string | null;
  price: string;
  slug: string;
} {
  const multi = p.variants.length > 1;
  return {
    name: p.title,
    size: multi ? p.variants.map((v) => v.shortLabel).join(" / ") : null,
    price: p.variants.map((v) => formatCents(v.unitAmountCents)).join(" / "),
    slug: p.id,
  };
}

/* ------------------------------------------------------------------ */
/* Structured data (see seo-gsc-work notes: numeric prices, absolute    */
/* image URLs, and no image at all when a product has no photo)         */
/* ------------------------------------------------------------------ */

function buildOffer(prices: number[]) {
  const common = {
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/order`,
  };
  if (prices.length === 0) return null;
  if (prices.length === 1) {
    return { "@type": "Offer", ...common, price: prices[0].toFixed(2) };
  }
  return {
    "@type": "AggregateOffer",
    ...common,
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: prices.length,
  };
}

function productPrices(p: StoredProduct): number[] {
  return p.variants.map((v) => v.unitAmountCents / 100);
}

/** Product structured data for a single product detail page. */
export function getProductDetailJsonLd(product: StoredProduct) {
  const offers = buildOffer(productPrices(product));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    ...(product.imageSrc ? { image: `${SITE_URL}${product.imageSrc}` } : {}),
    brand: { "@type": "Brand", name: "Bay's Baked Goods" },
    category: "Bakery",
    ...(offers ? { offers } : {}),
  };
}

/** ItemList + Product entries for the menu page. */
export async function getMenuItemListJsonLd() {
  const products = await getAvailableProducts();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => {
      const offers = buildOffer(productPrices(p));
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: p.title,
          description: `${p.title} - handmade in small batches at Bay's Baked Goods, a home bakery in West Jordan, Utah.`,
          ...(p.imageSrc ? { image: `${SITE_URL}${p.imageSrc}` } : {}),
          brand: { "@type": "Brand", name: "Bay's Baked Goods" },
          category: "Bakery",
          ...(offers ? { offers } : {}),
        },
      };
    }),
  };
}

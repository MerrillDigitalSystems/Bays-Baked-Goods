import { promises as fs } from "node:fs";
import path from "node:path";
import {
  checkoutCatalog as seedCatalog,
  checkoutProducts as seedProducts,
  customMenuItems as seedCustomItems,
} from "@/data/menu";
import { MENU_KINDS, MENU_PATHS, type MenuKind } from "@/lib/menus";
import { isCurrentlyAvailable } from "@/lib/availability";

export { MENU_KINDS, MENU_LABELS, MENU_PATHS } from "@/lib/menus";
export type { MenuKind } from "@/lib/menus";

export type StoredVariant = {
  sku: string;
  shortLabel: string;
  unitAmountCents: number;
};

export type StoredProduct = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageObjectPosition?: string;
  ogImagePath?: string;
  allergens: string[];
  available: boolean;
  availabilityStart?: string;
  availabilityEnd?: string;
  menu: MenuKind;
  groupId: string;
  variants: StoredVariant[];
};

export type StoredMenuGroup = {
  id: string;
  menu: MenuKind;
  name: string;
};

export type StoredCustomItem = {
  name: string;
  smallLabel: string;
  smallPrice: string;
  largeLabel: string;
  largePrice: string;
};

export type SiteContent = {
  version: 2;
  updatedAt: string;
  products: StoredProduct[];
  customItems: StoredCustomItem[];
  groups: StoredMenuGroup[];
};

export type CheckoutCatalogEntry = {
  label: string;
  unitAmount: number;
  menu: MenuKind;
};

const SITE_URL = "https://baysbakedgoods.com";
export const CONTENT_DIR = path.join(process.cwd(), "content");
const CONTENT_FILE = path.join(CONTENT_DIR, "products.json");

const DEFAULT_GROUPS: StoredMenuGroup[] = [
  { id: "signature", menu: "signature", name: "Signature bakes" },
  { id: "seasonal", menu: "seasonal", name: "Seasonal favorites" },
  { id: "porch", menu: "porch", name: "Porch Pickup" },
];

export function seedContent(): SiteContent {
  return {
    version: 2,
    updatedAt: "seed",
    products: seedProducts.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      ...(p.imageSrc ? { imageSrc: p.imageSrc, ogImagePath: `/og/${p.id}.jpg` } : {}),
      ...(p.imageObjectPosition ? { imageObjectPosition: p.imageObjectPosition } : {}),
      allergens: [...p.allergens],
      available: true,
      menu: "signature",
      groupId: "signature",
      variants: p.variants.map((v) => ({
        sku: v.sku,
        shortLabel: v.shortLabel,
        unitAmountCents: seedCatalog[v.sku].unitAmount,
      })),
    })),
    customItems: seedCustomItems.map((c) => ({ ...c })),
    groups: DEFAULT_GROUPS.map((group) => ({ ...group })),
  };
}

function normalizeContent(data: unknown): SiteContent | null {
  if (typeof data !== "object" || data === null) return null;
  const raw = data as {
    version?: unknown;
    updatedAt?: unknown;
    products?: unknown;
    customItems?: unknown;
    groups?: unknown;
  };
  if ((raw.version !== 1 && raw.version !== 2) || !Array.isArray(raw.products) || !Array.isArray(raw.customItems)) {
    return null;
  }

  const products: StoredProduct[] = [];
  for (const value of raw.products) {
    if (typeof value !== "object" || value === null) return null;
    const p = value as Partial<StoredProduct>;
    if (
      typeof p.id !== "string" ||
      typeof p.title !== "string" ||
      typeof p.description !== "string" ||
      typeof p.available !== "boolean" ||
      !Array.isArray(p.allergens) ||
      !Array.isArray(p.variants) ||
      !p.variants.every(
        (v) =>
          typeof v.sku === "string" &&
          typeof v.shortLabel === "string" &&
          Number.isFinite(v.unitAmountCents) &&
          v.unitAmountCents > 0
      )
    ) {
      return null;
    }
    const menu: MenuKind = MENU_KINDS.includes(p.menu as MenuKind) ? (p.menu as MenuKind) : "signature";
    products.push({
      id: p.id,
      title: p.title,
      description: p.description,
      ...(p.imageSrc ? { imageSrc: p.imageSrc } : {}),
      ...(p.imageObjectPosition ? { imageObjectPosition: p.imageObjectPosition } : {}),
      ...(p.ogImagePath ? { ogImagePath: p.ogImagePath } : {}),
      allergens: p.allergens.filter((a): a is string => typeof a === "string"),
      available: p.available,
      ...(p.availabilityStart ? { availabilityStart: p.availabilityStart } : {}),
      ...(p.availabilityEnd ? { availabilityEnd: p.availabilityEnd } : {}),
      menu,
      groupId: typeof p.groupId === "string" ? p.groupId : menu,
      variants: p.variants.map((v) => ({
        sku: v.sku,
        shortLabel: v.shortLabel,
        unitAmountCents: v.unitAmountCents,
      })),
    });
  }

  const groups: StoredMenuGroup[] = [];
  if (Array.isArray(raw.groups)) {
    for (const value of raw.groups) {
      if (typeof value !== "object" || value === null) continue;
      const group = value as Partial<StoredMenuGroup>;
      if (
        typeof group.id === "string" &&
        typeof group.name === "string" &&
        MENU_KINDS.includes(group.menu as MenuKind)
      ) {
        groups.push({ id: group.id, name: group.name, menu: group.menu as MenuKind });
      }
    }
  }
  for (const fallback of DEFAULT_GROUPS) {
    if (!groups.some((group) => group.menu === fallback.menu)) groups.push({ ...fallback });
  }
  for (const product of products) {
    if (!groups.some((group) => group.id === product.groupId && group.menu === product.menu)) {
      product.groupId = groups.find((group) => group.menu === product.menu)?.id ?? product.menu;
    }
  }

  return {
    version: 2,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "seed",
    products,
    customItems: raw.customItems as StoredCustomItem[],
    groups,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const content = normalizeContent(parsed);
    if (content) return content;
    console.error("content/products.json failed validation - serving seed data");
    return seedContent();
  } catch {
    return seedContent();
  }
}

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

export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

function matchesMenu(product: StoredProduct, menu?: MenuKind | MenuKind[]): boolean {
  if (!menu) return true;
  return Array.isArray(menu) ? menu.includes(product.menu) : product.menu === menu;
}

export async function getAvailableProducts(menu?: MenuKind | MenuKind[]): Promise<StoredProduct[]> {
  const { products } = await getSiteContent();
  return products.filter(
    (product) => matchesMenu(product, menu) && product.variants.length > 0 && isCurrentlyAvailable(product)
  );
}

export async function getMenuContent(menu: MenuKind) {
  const content = await getSiteContent();
  return {
    groups: content.groups.filter((group) => group.menu === menu),
    products: content.products.filter(
      (product) =>
        product.menu === menu && product.variants.length > 0 && isCurrentlyAvailable(product)
    ),
  };
}

export async function getProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  const { products } = await getSiteContent();
  return products.find(
    (product) =>
      product.id === slug && product.variants.length > 0 && isCurrentlyAvailable(product)
  );
}

export async function getCustomItems(): Promise<StoredCustomItem[]> {
  const { customItems } = await getSiteContent();
  return customItems;
}

export async function getCheckoutCatalog(): Promise<Record<string, CheckoutCatalogEntry>> {
  const products = await getAvailableProducts();
  const catalog: Record<string, CheckoutCatalogEntry> = {};
  for (const product of products) {
    for (const variant of product.variants) {
      catalog[variant.sku] = {
        label: product.variants.length > 1 ? `${product.title} (${variant.shortLabel})` : product.title,
        unitAmount: variant.unitAmountCents,
        menu: product.menu,
      };
    }
  }
  return catalog;
}

export function variantPriceDisplay(variant: StoredVariant): string {
  return formatCents(variant.unitAmountCents);
}

export function productSummary(product: StoredProduct): {
  name: string;
  size: string | null;
  price: string;
  slug: string;
} {
  const multi = product.variants.length > 1;
  return {
    name: product.title,
    size: multi ? product.variants.map((variant) => variant.shortLabel).join(" / ") : null,
    price: product.variants.map((variant) => formatCents(variant.unitAmountCents)).join(" / "),
    slug: product.id,
  };
}

function buildOffer(prices: number[], path: string) {
  const common = {
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}${path}`,
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

function productPrices(product: StoredProduct): number[] {
  return product.variants.map((variant) => variant.unitAmountCents / 100);
}

export function getProductDetailJsonLd(product: StoredProduct) {
  const offers = buildOffer(productPrices(product), MENU_PATHS[product.menu]);
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

export async function getMenuItemListJsonLd(products?: StoredProduct[]) {
  const items = products ?? (await getAvailableProducts("signature"));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((product, index) => {
      const offers = buildOffer(productPrices(product), MENU_PATHS[product.menu]);
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          description: `${product.title} - handmade in small batches at Bay's Baked Goods, a home bakery in West Jordan, Utah.`,
          ...(product.imageSrc ? { image: `${SITE_URL}${product.imageSrc}` } : {}),
          brand: { "@type": "Brand", name: "Bay's Baked Goods" },
          category: "Bakery",
          ...(offers ? { offers } : {}),
        },
      };
    }),
  };
}

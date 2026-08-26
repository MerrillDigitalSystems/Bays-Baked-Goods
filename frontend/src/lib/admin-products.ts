import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getSiteContent,
  saveSiteContent,
  type SiteContent,
  type StoredCustomItem,
  type StoredProduct,
  type StoredVariant,
} from "@/lib/content";

/**
 * Server-side validation + persistence for admin edits. Everything Bailey
 * submits from her phone lands here; nothing is trusted from the client.
 * Prices are integer cents (Stripe + Product schema both need numerics).
 */

export const ALLERGEN_OPTIONS = [
  "Wheat",
  "Gluten",
  "Milk",
  "Eggs",
  "Tree nuts",
  "Peanuts",
  "Soy",
  "Sesame",
] as const;

const PUBLIC_DIR = path.join(process.cwd(), "public");
export const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
const OG_DYNAMIC_DIR = path.join(PUBLIC_DIR, "og", "dynamic");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export class ValidationError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new ValidationError(message);
}

/** Resolve an image path under public/ safely; returns absolute path. */
function resolvePublicImage(imageSrc: string): string {
  assert(imageSrc.startsWith("/"), "Image path must start with /");
  const abs = path.resolve(PUBLIC_DIR, `.${imageSrc}`);
  assert(
    abs.startsWith(PUBLIC_DIR + path.sep),
    "Image path must stay inside the public folder"
  );
  assert(IMAGE_EXTENSIONS.has(path.extname(abs).toLowerCase()), "Unsupported image type");
  return abs;
}

async function publicImageExists(imageSrc: string): Promise<boolean> {
  try {
    await fs.access(resolvePublicImage(imageSrc));
    return true;
  } catch {
    return false;
  }
}

export type ProductInput = {
  title?: unknown;
  description?: unknown;
  imageSrc?: unknown;
  imageObjectPosition?: unknown;
  allergens?: unknown;
  available?: unknown;
  variants?: unknown;
};

/** Validate raw input into a StoredProduct (without id/sku assignment). */
async function validateProductInput(input: ProductInput): Promise<{
  title: string;
  description: string;
  imageSrc?: string;
  imageObjectPosition?: string;
  allergens: string[];
  available: boolean;
  variants: { shortLabel: string; unitAmountCents: number }[];
}> {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  assert(title.length >= 2 && title.length <= 80, "Name must be 2-80 characters");

  const description = typeof input.description === "string" ? input.description.trim() : "";
  assert(description.length <= 500, "Description is too long (500 characters max)");

  let imageSrc: string | undefined;
  if (typeof input.imageSrc === "string" && input.imageSrc.trim() !== "") {
    imageSrc = input.imageSrc.trim();
    assert(await publicImageExists(imageSrc), "That photo file could not be found");
  }

  let imageObjectPosition: string | undefined;
  if (typeof input.imageObjectPosition === "string" && input.imageObjectPosition.trim() !== "") {
    imageObjectPosition = input.imageObjectPosition.trim();
    assert(
      /^[a-z0-9% .-]{1,40}$/i.test(imageObjectPosition),
      "Invalid image position value"
    );
  }

  assert(Array.isArray(input.allergens), "Allergens must be a list");
  const allergens = (input.allergens as unknown[])
    .filter((a): a is string => typeof a === "string")
    .map((a) => a.trim())
    .filter((a) => a.length > 0 && a.length <= 30)
    .slice(0, 10);

  const available = input.available !== false;

  assert(Array.isArray(input.variants), "At least one size & price is required");
  const rawVariants = input.variants as { shortLabel?: unknown; unitAmountCents?: unknown }[];
  assert(rawVariants.length >= 1 && rawVariants.length <= 8, "Between 1 and 8 sizes allowed");
  const variants = rawVariants.map((v) => {
    const shortLabel = typeof v.shortLabel === "string" ? v.shortLabel.trim() : "";
    assert(shortLabel.length >= 1 && shortLabel.length <= 30, "Each size needs a short name");
    const cents = typeof v.unitAmountCents === "number" ? Math.round(v.unitAmountCents) : NaN;
    assert(
      Number.isFinite(cents) && cents >= 50 && cents <= 50000,
      "Each price must be between $0.50 and $500"
    );
    return { shortLabel, unitAmountCents: cents };
  });

  return { title, description, imageSrc, imageObjectPosition, allergens, available, variants };
}

/** Keep skus stable across edits (same label = same sku), mint new ones for new labels. */
function assignSkus(
  productId: string,
  variants: { shortLabel: string; unitAmountCents: number }[],
  previous?: StoredProduct
): StoredVariant[] {
  const used = new Set<string>();
  return variants.map((v) => {
    const prior = previous?.variants.find(
      (pv) => pv.shortLabel.toLowerCase() === v.shortLabel.toLowerCase() && !used.has(pv.sku)
    );
    let sku = prior?.sku ?? `${productId}-${slugify(v.shortLabel) || "size"}`;
    while (used.has(sku)) sku = `${sku}-2`;
    used.add(sku);
    return { sku, ...v };
  });
}

/**
 * Regenerate the 1200x630 share crop when a product's photo changes.
 * Runtime crops live in /og/dynamic (gitignored) so the committed /og files
 * are never overwritten on the Pi and git pulls stay clean.
 */
async function refreshOgImage(
  product: Omit<StoredProduct, "ogImagePath">,
  previous?: StoredProduct
): Promise<string | undefined> {
  if (!product.imageSrc) return undefined;
  if (previous && previous.imageSrc === product.imageSrc && previous.ogImagePath) {
    return previous.ogImagePath;
  }
  try {
    const { default: sharp } = await import("sharp");
    await fs.mkdir(OG_DYNAMIC_DIR, { recursive: true });
    const out = path.join(OG_DYNAMIC_DIR, `${product.id}.jpg`);
    await sharp(resolvePublicImage(product.imageSrc))
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toFile(out);
    return `/og/dynamic/${product.id}.jpg`;
  } catch (err) {
    console.error("OG crop generation failed:", err);
    // Non-fatal: page falls back to the default share image.
    return undefined;
  }
}

export async function createProduct(input: ProductInput): Promise<StoredProduct> {
  const fields = await validateProductInput(input);
  const content = await getSiteContent();

  let id = slugify(fields.title);
  assert(id.length >= 2, "Name must contain some letters or numbers");
  while (content.products.some((p) => p.id === id)) id = `${id}-2`;

  const base = {
    id,
    title: fields.title,
    description: fields.description,
    ...(fields.imageSrc ? { imageSrc: fields.imageSrc } : {}),
    ...(fields.imageObjectPosition ? { imageObjectPosition: fields.imageObjectPosition } : {}),
    allergens: fields.allergens,
    available: fields.available,
    variants: assignSkus(id, fields.variants),
  };
  const ogImagePath = await refreshOgImage(base);
  const product: StoredProduct = { ...base, ...(ogImagePath ? { ogImagePath } : {}) };

  content.products.push(product);
  await persist(content);
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<StoredProduct> {
  const fields = await validateProductInput(input);
  const content = await getSiteContent();
  const index = content.products.findIndex((p) => p.id === id);
  assert(index !== -1, "Product not found");
  const previous = content.products[index];

  const base = {
    id,
    title: fields.title,
    description: fields.description,
    ...(fields.imageSrc ? { imageSrc: fields.imageSrc } : {}),
    ...(fields.imageObjectPosition ? { imageObjectPosition: fields.imageObjectPosition } : {}),
    allergens: fields.allergens,
    available: fields.available,
    variants: assignSkus(id, fields.variants, previous),
  };
  const ogImagePath = await refreshOgImage(base, previous);
  const product: StoredProduct = { ...base, ...(ogImagePath ? { ogImagePath } : {}) };

  content.products[index] = product;
  await persist(content);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const content = await getSiteContent();
  const index = content.products.findIndex((p) => p.id === id);
  assert(index !== -1, "Product not found");
  content.products.splice(index, 1);
  await persist(content);
}

export async function updateCustomItems(input: unknown): Promise<StoredCustomItem[]> {
  assert(Array.isArray(input), "Expected a list of custom items");
  assert((input as unknown[]).length <= 20, "Too many custom items (20 max)");
  const items = (input as Record<string, unknown>[]).map((row) => {
    const str = (v: unknown, field: string, max: number, required = true): string => {
      const s = typeof v === "string" ? v.trim() : "";
      if (required) assert(s.length >= 1, `Each custom item needs a ${field}`);
      assert(s.length <= max, `Custom item ${field} is too long`);
      return s;
    };
    return {
      name: str(row.name, "name", 60),
      smallLabel: str(row.smallLabel, "first label", 40),
      smallPrice: str(row.smallPrice, "first price", 20),
      largeLabel: str(row.largeLabel, "second label", 40, false),
      largePrice: str(row.largePrice, "second price", 20, false),
    };
  });
  const content = await getSiteContent();
  content.customItems = items;
  await persist(content);
  return items;
}

async function persist(content: SiteContent): Promise<void> {
  content.updatedAt = new Date().toISOString();
  await saveSiteContent(content);
}

/** Every image the picker can offer: uploads plus photos already in use. */
export async function listPhotoLibrary(): Promise<{ path: string; inUseBy: string[] }[]> {
  const content = await getSiteContent();
  const inUse = new Map<string, string[]>();
  for (const p of content.products) {
    if (p.imageSrc) inUse.set(p.imageSrc, [...(inUse.get(p.imageSrc) ?? []), p.title]);
  }

  const seen = new Set<string>();
  const results: { path: string; inUseBy: string[] }[] = [];

  const add = (publicPath: string) => {
    if (seen.has(publicPath)) return;
    seen.add(publicPath);
    results.push({ path: publicPath, inUseBy: inUse.get(publicPath) ?? [] });
  };

  // Uploads first (newest first), then photos referenced by products.
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    files
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .reverse()
      .forEach((f) => add(`/uploads/${f}`));
  } catch {
    // uploads dir does not exist yet
  }
  for (const p of content.products) {
    if (p.imageSrc) add(p.imageSrc);
  }
  return results;
}

/** Delete an uploaded photo that no product references. Only /uploads files can be deleted. */
export async function deleteUploadedPhoto(publicPath: unknown): Promise<void> {
  assert(typeof publicPath === "string", "Missing photo path");
  assert(publicPath.startsWith("/uploads/"), "Only uploaded photos can be deleted");
  const abs = resolvePublicImage(publicPath);
  assert(abs.startsWith(UPLOADS_DIR + path.sep), "Only uploaded photos can be deleted");
  const content = await getSiteContent();
  assert(
    !content.products.some((p) => p.imageSrc === publicPath),
    "That photo is used by a menu item - change the item's photo first"
  );
  await fs.unlink(abs);
}

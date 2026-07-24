/**
 * Generates 1200x630 Open Graph images into `public/og/` from the source photos.
 *
 * Why this exists: og:image must be a real landscape food photo, not the square
 * logo. Share previews (iMessage, Facebook, Instagram DM) are a primary channel
 * for a bakery, so the preview needs to show bread.
 *
 * Run after adding or swapping a product photo:
 *   node scripts/generate-og-images.mjs
 *
 * Outputs are committed so the Pi never spends build time on image work.
 * `sharp` comes in transitively with Next.js  -  no separate install needed.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "public");
const OUT = join(root, "public", "og");

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * `position` mirrors the object-position the site uses for the same photo so the
 * share preview frames the same part of the subject the page does.
 *
 * Site-wide default is the sourdough boule, not the hero photo: IMG_6761 is
 * Bailey in her kitchen, and a share preview should lead with bread.
 */
const TARGETS = [
  { out: "default", src: "IMG_6002_VSCO.JPG", position: "centre" },
  { out: "menu", src: "IMG_6335_VSCO.JPG", position: "centre" },
  { out: "about", src: "IMG_6712_VSCO.JPG", position: "centre" },
  { out: "order", src: "3E6348C5-1BEA-4652-9DCF-CAF1B46CEE46.jpeg", position: "centre" },

  // Product detail pages, keyed by `checkoutProducts[].id`.
  // No entry for `cinnamon-rolls`  -  no photo of it exists yet, so it falls back
  // to `default.jpg`. Add one here once Bailey shoots it.
  { out: "plain-sourdough", src: "IMG_6002_VSCO.JPG", position: "centre" },
  { out: "jalapeno-cheddar", src: "IMG_5967_VSCO.JPG", position: "centre" },
  { out: "cinnamon-sugar", src: "IMG_6249_VSCO.JPG", position: "top" },
  { out: "plain-bagels", src: "2BD15450-2976-4311-A7ED-7117767DF9FC_VSCO.JPG", position: "centre" },
  { out: "thyme-focaccia", src: "IMG_6335_VSCO.JPG", position: "centre" },
  { out: "choc-chunk-cookies", src: "3E6348C5-1BEA-4652-9DCF-CAF1B46CEE46.jpeg", position: "centre" },
];

async function build({ out, src, position }) {
  const outPath = join(OUT, `${out}.jpg`);
  const info = await sharp(join(SRC, src))
    .rotate() // honor EXIF orientation before cropping
    .resize(WIDTH, HEIGHT, { fit: "cover", position })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(outPath);
  console.log(
    `${out}.jpg`.padEnd(28),
    `${info.width}x${info.height}`,
    `${(info.size / 1024).toFixed(0)} KB`,
    `<- ${src}`
  );
}

await mkdir(OUT, { recursive: true });
for (const t of TARGETS) await build(t);
console.log(`\n${TARGETS.length} images written to public/og/`);

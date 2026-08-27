import { promises as fs } from "node:fs";
import path from "node:path";
import { OG_DYNAMIC_DIR } from "@/lib/admin-products";

/**
 * Serves runtime-generated 1200x630 share crops from media/og (see
 * /uploads/[name]/route.ts for why these can't live in public/). Unlike
 * uploads, `<id>.jpg` is overwritten when a product's photo changes, so the
 * cache window stays short for social scrapers.
 */

type Params = { params: Promise<{ name: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { name } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.jpg$/.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const abs = path.resolve(OG_DYNAMIC_DIR, name);
  if (!abs.startsWith(OG_DYNAMIC_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const file = await fs.readFile(abs);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

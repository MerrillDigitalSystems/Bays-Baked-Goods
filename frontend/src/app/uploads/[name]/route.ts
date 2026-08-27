import { promises as fs } from "node:fs";
import path from "node:path";
import { LEGACY_UPLOADS_DIR, UPLOADS_DIR } from "@/lib/admin-products";

/**
 * Serves Bailey's uploaded photos from media/uploads. A route handler rather
 * than public/ because production `next start` only serves public/ files that
 * existed at build time - runtime uploads there 404 (the bug this fixes).
 * Falls back to public/uploads for files uploaded before this change that a
 * rebuild happened to pick up.
 */

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type Params = { params: Promise<{ name: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { name } = await params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const type = CONTENT_TYPES[path.extname(name).toLowerCase()];
  if (!type) {
    return new Response("Not found", { status: 404 });
  }

  for (const dir of [UPLOADS_DIR, LEGACY_UPLOADS_DIR]) {
    const abs = path.resolve(dir, name);
    if (!abs.startsWith(dir + path.sep)) continue;
    try {
      const file = await fs.readFile(abs);
      return new Response(new Uint8Array(file), {
        headers: {
          "Content-Type": type,
          // Upload filenames are date+random and never reused, so far-future
          // caching is safe.
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // try next dir
    }
  }
  return new Response("Not found", { status: 404 });
}

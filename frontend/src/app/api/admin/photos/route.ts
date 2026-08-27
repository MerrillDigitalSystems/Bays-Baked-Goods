import { promises as fs } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  deleteUploadedPhoto,
  listPhotoLibrary,
  UPLOADS_DIR,
  ValidationError,
} from "@/lib/admin-products";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/** Photo library for the picker. */
export async function GET() {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  return Response.json({ photos: await listPhotoLibrary() });
}

/**
 * Upload a photo from Bailey's phone. The form re-encodes to JPEG client-side
 * when it can, but don't rely on that: phone pickers send unpredictable MIME
 * types (HEIC, empty strings on some Androids), so the only trustworthy
 * validator is sharp actually decoding the bytes. Re-encoded here regardless
 * (EXIF rotation honored, resized, recompressed) so a 12 MB camera photo
 * becomes a fast web asset.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "No photo attached" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return Response.json({ error: "Photo is too large (25 MB max)" }, { status: 400 });
    }

    const input = Buffer.from(await file.arrayBuffer());
    const { default: sharp } = await import("sharp");
    let output: Buffer;
    try {
      output = await sharp(input)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } catch {
      // sharp could not decode - most likely an HEIC that the browser also
      // could not convert, or a non-image file.
      return Response.json(
        {
          error:
            "That photo format didn't work. In your camera settings choose \"Most Compatible\", or screenshot the photo and upload the screenshot.",
        },
        { status: 415 }
      );
    }

    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const name = `${stamp}-${randomBytes(4).toString("hex")}.jpg`;
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, name), output);

    return Response.json({ path: `/uploads/${name}` });
  } catch (err) {
    console.error("photo upload failed:", err);
    return Response.json(
      { error: "Upload failed - check your connection and try again." },
      { status: 500 }
    );
  }
}

/** Delete an unused uploaded photo. */
export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { path?: unknown };
    await deleteUploadedPhoto(body.path);
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("photo delete failed:", err);
    return Response.json({ error: "Something went wrong - try again." }, { status: 500 });
  }
}

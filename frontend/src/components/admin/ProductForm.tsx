"use client";

/* eslint-disable @next/next/no-img-element -- tiny admin thumbnails; next/image
   adds nothing here and the library grid mixes arbitrary runtime uploads. */

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type FormVariant = { shortLabel: string; priceDollars: string };
export type FormProduct = {
  id?: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageObjectPosition?: string;
  allergens: string[];
  available: boolean;
  variants: FormVariant[];
};
export type LibraryPhoto = { path: string; inUseBy: string[] };

const ALLERGEN_OPTIONS = [
  "Wheat",
  "Gluten",
  "Milk",
  "Eggs",
  "Tree nuts",
  "Peanuts",
  "Soy",
  "Sesame",
];

/** "12" | "12.5" | "$12.50" -> cents, or null when unparseable. */
function dollarsToCents(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}

/**
 * Re-encode a picked photo to JPEG in the browser when possible. Phone pickers
 * hand over HEIC (iPhone) or files with blank MIME types (some Androids);
 * Safari can DECODE HEIC natively even though the server can't, so converting
 * here fixes iPhone uploads and also shrinks multi-MB camera shots before
 * they cross a cell connection. Falls back to the original file when decoding
 * fails - the server then tries sharp and returns a clear error if it can't
 * decode either.
 */
async function toUploadableJpeg(file: File): Promise<Blob> {
  try {
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      bitmap = await createImageBitmap(file);
    }
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    return blob && blob.size > 0 ? blob : file;
  } catch {
    return file;
  }
}

const POSITION_PRESETS: { label: string; value: string }[] = [
  { label: "Centered (default)", value: "" },
  { label: "Show more of the top", value: "center 25%" },
  { label: "Show more of the bottom", value: "center 75%" },
];

export function ProductForm({
  mode,
  product,
  photoLibrary,
}: {
  mode: "create" | "edit";
  product?: FormProduct;
  photoLibrary: LibraryPhoto[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageSrc, setImageSrc] = useState(product?.imageSrc ?? "");
  const [imagePosition, setImagePosition] = useState(product?.imageObjectPosition ?? "");
  const [allergens, setAllergens] = useState<string[]>(product?.allergens ?? []);
  const [available, setAvailable] = useState(product?.available ?? true);
  const [variants, setVariants] = useState<FormVariant[]>(
    product?.variants?.length ? product.variants : [{ shortLabel: "", priceDollars: "" }]
  );
  const [library, setLibrary] = useState<LibraryPhoto[]>(photoLibrary);
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const positionIsPreset = POSITION_PRESETS.some((p) => p.value === imagePosition);

  function toggleAllergen(name: string) {
    setAllergens((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  }

  function setVariant(index: number, patch: Partial<FormVariant>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const jpeg = await toUploadableJpeg(file);
      const form = new FormData();
      form.append("file", new File([jpeg], "photo.jpg", { type: "image/jpeg" }));
      const res = await fetch("/api/admin/photos", { method: "POST", body: form });
      const data = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !data.path) {
        setUploadError(data.error ?? "Upload failed - try again.");
        return;
      }
      setImageSrc(data.path);
      setLibrary((prev) => [{ path: data.path!, inUseBy: [] }, ...prev]);
    } catch {
      setUploadError("Upload failed - check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function deleteLibraryPhoto(path: string) {
    if (!window.confirm("Delete this photo file? This can't be undone.")) return;
    const res = await fetch("/api/admin/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setUploadError(data.error ?? "Couldn't delete that photo.");
      return;
    }
    setLibrary((prev) => prev.filter((p) => p.path !== path));
    if (imageSrc === path) setImageSrc("");
  }

  async function save() {
    setError(null);

    if (title.trim().length < 2) {
      setError("Give the item a name first.");
      return;
    }
    const parsedVariants: { shortLabel: string; unitAmountCents: number }[] = [];
    for (const v of variants) {
      if (!v.shortLabel.trim() && !v.priceDollars.trim()) continue; // skip empty row
      const cents = dollarsToCents(v.priceDollars);
      if (!v.shortLabel.trim() || cents === null) {
        setError("Each size needs a name and a price like 12 or 12.50.");
        return;
      }
      parsedVariants.push({ shortLabel: v.shortLabel.trim(), unitAmountCents: cents });
    }
    if (parsedVariants.length === 0) {
      setError("Add at least one size & price.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        imageSrc: imageSrc || undefined,
        imageObjectPosition: imagePosition || undefined,
        allergens,
        available,
        variants: parsedVariants,
      };
      const res = await fetch(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${product?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Saving failed - try again.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error - your change was NOT saved. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (mode !== "edit" || !product?.id) return;
    if (
      !window.confirm(
        `Delete "${product.title}" from the menu? Customers won't see it anymore. (If you just want to pause it, use "Show on the website" instead.)`
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Delete failed - try again.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error - try again.");
    } finally {
      setDeleting(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none focus:border-black/30";

  return (
    <div className="space-y-8 pb-28">
      {/* Photo */}
      <section className="rounded-2xl border border-black/8 bg-white/80 p-5">
        <h2 className="font-medium text-black">Photo</h2>
        <div className="mt-3 flex items-start gap-4">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#ebe8e0]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Current product photo"
                className="h-full w-full object-cover"
                style={imagePosition ? { objectPosition: imagePosition } : undefined}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-2 text-center text-[0.6rem] uppercase tracking-wide text-black/40">
                No photo yet
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Take or upload photo"}
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary((s) => !s)}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:border-black/25"
            >
              {showLibrary ? "Hide photo library" : "Choose existing photo"}
            </button>
            {imageSrc ? (
              <button
                type="button"
                onClick={() => setImageSrc("")}
                className="text-left text-sm text-black/55 underline underline-offset-2 hover:text-black"
              >
                Remove photo from this item
              </button>
            ) : null}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            aria-label="Upload a photo"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadPhoto(f);
            }}
          />
        </div>

        {uploadError ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {uploadError}
          </p>
        ) : null}

        {showLibrary ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {library.map((photo) => (
              <div key={photo.path} className="group relative">
                <button
                  type="button"
                  onClick={() => setImageSrc(photo.path)}
                  className={`block aspect-square w-full overflow-hidden rounded-lg border-2 ${
                    imageSrc === photo.path ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={photo.path}
                    alt={photo.inUseBy.length ? `Used by ${photo.inUseBy.join(", ")}` : "Photo"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
                {photo.inUseBy.length === 0 && photo.path.startsWith("/uploads/") ? (
                  <button
                    type="button"
                    onClick={() => deleteLibraryPhoto(photo.path)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] font-medium text-white"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ))}
            {library.length === 0 ? (
              <p className="col-span-3 text-sm text-black/55 sm:col-span-4">
                No photos yet - upload one above.
              </p>
            ) : null}
          </div>
        ) : null}

        {imageSrc ? (
          <label className="mt-4 block text-sm font-medium text-black/70">
            Photo framing
            <select
              value={positionIsPreset ? imagePosition : "__custom"}
              onChange={(e) => {
                if (e.target.value !== "__custom") setImagePosition(e.target.value);
              }}
              className={inputClass}
            >
              {POSITION_PRESETS.map((p) => (
                <option key={p.label} value={p.value}>
                  {p.label}
                </option>
              ))}
              {!positionIsPreset ? <option value="__custom">Custom (kept as is)</option> : null}
            </select>
          </label>
        ) : null}
      </section>

      {/* Name & description */}
      <section className="rounded-2xl border border-black/8 bg-white/80 p-5">
        <label className="block text-sm font-medium text-black/70">
          Name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rosemary Sourdough"
            className={inputClass}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-black/70">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A sentence or two - what it is and why people love it."
            className={inputClass}
          />
        </label>
      </section>

      {/* Sizes & prices */}
      <section className="rounded-2xl border border-black/8 bg-white/80 p-5">
        <h2 className="font-medium text-black">Sizes &amp; prices</h2>
        <p className="mt-1 text-sm text-black/55">
          One row per size (Mini, Regular, 4 pack…). Just the number for price - e.g. 12 or
          12.50.
        </p>
        <div className="mt-3 space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={v.shortLabel}
                onChange={(e) => setVariant(i, { shortLabel: e.target.value })}
                placeholder="Size (e.g. Regular)"
                className="w-full min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none focus:border-black/30"
              />
              <div className="relative w-28 shrink-0">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/50">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={v.priceDollars}
                  onChange={(e) => setVariant(i, { priceDollars: e.target.value })}
                  placeholder="0"
                  className="w-full rounded-xl border border-black/10 bg-white py-3 pl-7 pr-3 text-base text-black outline-none focus:border-black/30"
                />
              </div>
              {variants.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setVariants((prev) => prev.filter((_, j) => j !== i))}
                  aria-label="Remove this size"
                  className="shrink-0 rounded-full border border-black/10 px-3 py-2 text-sm text-black/55 hover:border-black/25 hover:text-black"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVariants((prev) => [...prev, { shortLabel: "", priceDollars: "" }])}
          className="mt-3 text-sm font-medium text-black underline underline-offset-2"
        >
          + Add another size
        </button>
      </section>

      {/* Allergens */}
      <section className="rounded-2xl border border-black/8 bg-white/80 p-5">
        <h2 className="font-medium text-black">Allergens</h2>
        <p className="mt-1 text-sm text-black/55">Tap everything this item contains.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((a) => {
            const active = allergens.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAllergen(a)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-black/10 bg-white text-black/70 hover:border-black/25"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </section>

      {/* Availability */}
      <section className="rounded-2xl border border-black/8 bg-white/80 p-5">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="font-medium text-black">Show on the website</span>
            <span className="block text-sm text-black/55">
              Turn off to hide it from the menu without deleting it (sold out, seasonal…).
            </span>
          </span>
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-6 w-6 accent-black"
          />
        </label>
      </section>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-[#f5f3ec]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving || deleting}
            className="flex-1 rounded-full bg-[#1a1a1a] px-6 py-3.5 text-base font-medium text-white shadow-xl transition hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Add to menu" : "Save changes"}
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              onClick={remove}
              disabled={saving || deleting}
              className="shrink-0 rounded-full border border-red-200 bg-white px-5 py-3.5 text-sm font-medium text-red-700 transition hover:border-red-400 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

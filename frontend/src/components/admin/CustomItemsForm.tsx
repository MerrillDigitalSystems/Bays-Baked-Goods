"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CustomItem = {
  name: string;
  smallLabel: string;
  smallPrice: string;
  largeLabel: string;
  largePrice: string;
};

const EMPTY: CustomItem = {
  name: "",
  smallLabel: "1-2 Inclusions",
  smallPrice: "",
  largeLabel: "3+ Inclusions",
  largePrice: "",
};

export function CustomItemsForm({ initialItems }: { initialItems: CustomItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<CustomItem[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setItem(index: number, patch: Partial<CustomItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  async function save() {
    setError(null);
    const cleaned = items.filter((it) => it.name.trim() !== "");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/custom", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cleaned }),
      });
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

  const inputClass =
    "mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-base text-black outline-none focus:border-black/30";

  return (
    <div className="space-y-6 pb-28">
      {items.map((item, i) => (
        <section key={i} className="rounded-2xl border border-black/8 bg-white/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <label className="block flex-1 text-sm font-medium text-black/70">
              Item name
              <input
                type="text"
                value={item.name}
                onChange={(e) => setItem(i, { name: e.target.value })}
                placeholder="e.g. Sourdough"
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              aria-label="Remove this row"
              className="mt-5 shrink-0 rounded-full border border-black/10 px-3 py-2 text-sm text-black/55 hover:border-black/25 hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-black/70">
              First option
              <input
                type="text"
                value={item.smallLabel}
                onChange={(e) => setItem(i, { smallLabel: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-black/70">
              Its price range
              <input
                type="text"
                value={item.smallPrice}
                onChange={(e) => setItem(i, { smallPrice: e.target.value })}
                placeholder="$13-$15"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-black/70">
              Second option
              <input
                type="text"
                value={item.largeLabel}
                onChange={(e) => setItem(i, { largeLabel: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-black/70">
              Its price range
              <input
                type="text"
                value={item.largePrice}
                onChange={(e) => setItem(i, { largePrice: e.target.value })}
                placeholder="$16-$18"
                className={inputClass}
              />
            </label>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { ...EMPTY }])}
        className="text-sm font-medium text-black underline underline-offset-2"
      >
        + Add a row
      </button>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-[#f5f3ec]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full rounded-full bg-[#1a1a1a] px-6 py-3.5 text-base font-medium text-white shadow-xl transition hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

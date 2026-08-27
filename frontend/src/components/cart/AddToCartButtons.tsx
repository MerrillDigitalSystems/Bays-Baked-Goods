"use client";

import { useCart } from "@/components/cart/CartProvider";

type VariantView = { sku: string; shortLabel: string; priceDisplay: string };

/**
 * The sizes & pricing rows on a product detail page, with Add buttons wired
 * to the shared cart. Adding opens the cart flyout so the shopper sees it
 * land and can head to checkout from right here.
 */
export function AddToCartButtons({ variants }: { variants: VariantView[] }) {
  const { addSku } = useCart();

  return (
    <ul className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/8 bg-white/50">
      {variants.map((variant) => (
        <li key={variant.sku} className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <span className="text-black/80">{variant.shortLabel}</span>
            <span className="ml-3 text-lg font-medium text-black">{variant.priceDisplay}</span>
          </div>
          <button
            type="button"
            onClick={() => addSku(variant.sku, 1, { open: true })}
            className="shrink-0 rounded-full bg-[#1a1a1a] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black"
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}

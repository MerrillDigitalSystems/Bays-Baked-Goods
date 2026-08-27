"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CartPanel } from "@/components/cart/CartPanel";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Site-wide cart access: a floating button (with item count) that opens a
 * slide-over drawer with the full cart + checkout. Appears once the cart has
 * items. On /order at desktop widths the sticky aside already shows the same
 * panel, so the button hides there to avoid doubling up.
 */
export function CartFlyout() {
  const { count, isOpen, openCart, closeCart } = useCart();
  const pathname = usePathname();

  // The admin area has its own save bar in the same corner.
  const onAdmin = pathname.startsWith("/admin");
  const onOrder = pathname === "/order";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  if (onAdmin) return null;

  return (
    <>
      {count > 0 ? (
        <button
          type="button"
          onClick={openCart}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          className={`fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#1a1a1a] py-3 pl-4 pr-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:bg-black ${
            onOrder ? "lg:hidden" : ""
          }`}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M6 7h12l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.6H9a1.8 1.8 0 0 1-1.8-1.6L6 7Z" />
            <path d="M9 7V6a3 3 0 0 1 6 0v1" />
          </svg>
          <span className="text-sm font-semibold">
            Cart · {count}
          </span>
        </button>
      ) : null}

      {isOpen ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="absolute inset-0 h-full w-full cursor-default bg-black/40"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#f5f3ec] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
              <h2 className="font-serif text-2xl italic text-black">Your cart</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm text-black/70 transition hover:border-black/25 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <CartPanel />
              <p className="mt-4 text-center text-xs text-black/45">
                Your cart is saved on this device  -  it&apos;ll be here when you come back.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

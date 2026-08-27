"use client";

import Image from "next/image";
import { useState } from "react";
import { CartPanel } from "@/components/cart/CartPanel";
import { useCart } from "@/components/cart/CartProvider";

// Product data arrives as props from the server page so runtime admin edits
// show up without a client rebuild; cart state lives in CartProvider and is
// shared with the site-wide flyout.

export type CartVariant = { sku: string; shortLabel: string; priceDisplay: string };
export type CartProduct = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageObjectPosition?: string;
  variants: CartVariant[];
};

function productImageAlt(productTitle: string): string {
  return `${productTitle} from Bay's Baked Goods, West Jordan Utah`;
}

function ProductPlaceholder({ title }: { title: string }) {
  return (
    <div className="relative flex h-full min-h-[12rem] w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ebe4d8] via-[#e5ddd0] to-[#ddd2c4]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.2] bg-[repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(90,70,50,0.08)_6px,rgba(90,70,50,0.08)_7px)]"
        aria-hidden
      />
      <p className="relative z-[1] max-w-[95%] font-serif text-xl font-semibold leading-snug text-[#3d3429] md:text-2xl">
        {title}
      </p>
      <p className="relative z-[1] mt-3 text-[0.65rem] uppercase tracking-[0.25em] text-black/35">
        Bay&apos;s Baked Goods
      </p>
    </div>
  );
}

function ProductImage({
  src,
  title,
  alt,
  cardIndex,
  objectPosition,
}: {
  src?: string;
  title: string;
  alt: string;
  cardIndex: number;
  /** CSS `object-position` when using `object-cover`. */
  objectPosition?: string;
}) {
  const [failed, setFailed] = useState(false);
  const eager = cardIndex < 3;

  if (!src || failed) {
    return <ProductPlaceholder title={title} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      style={objectPosition ? { objectPosition } : undefined}
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      loading={eager ? "eager" : "lazy"}
      priority={eager}
      onError={() => setFailed(true)}
    />
  );
}

export function OrderCart({ products }: { products: CartProduct[] }) {
  const { addSku } = useCart();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
      <div className="min-w-0 flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-black">Menu</h2>
          <p className="mt-2 max-w-2xl text-black/70">
            Tap <span className="font-medium text-black">ADD </span> on the item(s) you&apos;d like,
            review your cart, then pay securely with Stripe. <br />
            Bailey will confirm pickup details once
            payment is received.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, cardIndex) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ebe8e0]">
                <ProductImage
                  src={product.imageSrc}
                  title={product.title}
                  alt={productImageAlt(product.title)}
                  cardIndex={cardIndex}
                  objectPosition={product.imageObjectPosition}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl italic leading-snug text-black">{product.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/65">{product.description}</p>
                <div className="mt-5 flex flex-col gap-2">
                  {product.variants.map((v) => (
                    <div
                      key={v.sku}
                      className="flex items-center justify-between gap-3 rounded-xl border border-black/8 bg-[#f5f3ec]/80 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-black">{v.shortLabel}</span>
                        <span className="ml-2 text-black/75">{v.priceDisplay}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSku(v.sku, 1)}
                        className="shrink-0 rounded-full bg-[#1a1a1a] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Desktop keeps the always-visible cart beside the menu; on mobile the
          site-wide floating cart button takes over so the panel isn't
          duplicated at the bottom of the page. */}
      <aside className="hidden w-full shrink-0 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:sticky lg:top-28 lg:block lg:w-[min(100%,380px)]">
        <CartPanel />
      </aside>
    </div>
  );
}

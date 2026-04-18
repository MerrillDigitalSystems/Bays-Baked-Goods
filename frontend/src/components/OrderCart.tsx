"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { DELIVERY_FEE_CENTS, formatDeliveryFeeDisplay } from "@/config/site";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  checkoutCatalog,
  checkoutProducts,
  type CheckoutSku,
} from "@/data/menu";
import {
  PASS_THROUGH_CARD_FEES_ENABLED,
  customerChargeTotalCents,
  passThroughSurchargeCents,
} from "@/lib/stripe-fees";

type CartLine = { sku: CheckoutSku; quantity: number };
type Fulfillment = "pickup" | "delivery";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

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

export function OrderCart() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotalCents = useMemo(
    () =>
      cart.reduce((sum, line) => sum + checkoutCatalog[line.sku].unitAmount * line.quantity, 0),
    [cart]
  );

  const deliveryFeeLine = fulfillment === "delivery" ? DELIVERY_FEE_CENTS : 0;
  const netCents = subtotalCents + deliveryFeeLine;
  const passThroughCents = useMemo(() => passThroughSurchargeCents(netCents), [netCents]);
  const chargeTotalCents = useMemo(() => customerChargeTotalCents(netCents), [netCents]);

  function addSku(sku: CheckoutSku, qty: number) {
    setError(null);
    const q = Math.min(24, Math.max(1, Math.floor(qty)));
    setCart((prev) => {
      const i = prev.findIndex((l) => l.sku === sku);
      if (i === -1) return [...prev, { sku, quantity: q }];
      const next = [...prev];
      next[i] = { sku, quantity: Math.min(24, next[i].quantity + q) };
      return next;
    });
  }

  function removeLine(sku: CheckoutSku) {
    setCart((prev) => prev.filter((l) => l.sku !== sku));
  }

  function setQty(sku: CheckoutSku, quantity: number) {
    const q = Math.min(24, Math.max(1, Math.floor(quantity)));
    setCart((prev) => prev.map((l) => (l.sku === sku ? { ...l, quantity: q } : l)));
  }

  async function checkout() {
    if (cart.length === 0) return;
    if (fulfillment === "delivery") {
      if (!street.trim() || !city.trim() || !zip.trim()) {
        setError("Enter your full delivery address to continue.");
        return;
      }
    }
    setLoading(true);
    setError(null);
    trackBeginCheckout(chargeTotalCents / 100);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          fulfillment,
          deliveryAddress:
            fulfillment === "delivery"
              ? { street: street.trim(), city: city.trim(), zip: zip.trim() }
              : undefined,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No redirect URL returned");
    } catch {
      setError("Network error  -  try again.");
    } finally {
      setLoading(false);
    }
  }

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
          {checkoutProducts.map((product, cardIndex) => (
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

      <aside className="w-full shrink-0 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:sticky lg:top-28 lg:w-[min(100%,380px)]">
        <fieldset className="space-y-3 border-0 p-0">
          <legend className="text-sm font-semibold text-black">Fulfillment</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/6 bg-white/90 px-3 py-2">
            <input
              type="radio"
              name="fulfillment"
              className="mt-1"
              checked={fulfillment === "pickup"}
              onChange={() => setFulfillment("pickup")}
            />
            <span>
              <span className="font-medium text-black">Pickup (free)</span>
              <span className="block text-sm text-black/60">West Jordan, UT</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/6 bg-white/90 px-3 py-2">
            <input
              type="radio"
              name="fulfillment"
              className="mt-1"
              checked={fulfillment === "delivery"}
              onChange={() => setFulfillment("delivery")}
            />
            <span>
              <span className="font-medium text-black">Local delivery</span>
              <span className="block text-sm text-black/60">
                {formatDeliveryFeeDisplay()} fee  -  text Bailey to confirm your address is in zone
              </span>
            </span>
          </label>
        </fieldset>

        {fulfillment === "delivery" ? (
          <div className="mt-4 space-y-3 rounded-xl border border-black/8 bg-[#f5f3ec]/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-black/55">Delivery address</p>
            <label className="block text-sm font-medium text-black/70">
              Street
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
                autoComplete="street-address"
              />
            </label>
            <label className="block text-sm font-medium text-black/70">
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
                autoComplete="address-level2"
              />
            </label>
            <label className="block text-sm font-medium text-black/70">
              ZIP
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
                autoComplete="postal-code"
              />
            </label>
          </div>
        ) : null}

        <h3 className="mt-6 text-lg font-semibold text-black">Your cart</h3>
        {cart.length === 0 ? (
          <p className="mt-4 text-black/60">No items yet  -  add from the menu.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {cart.map((line) => (
              <li
                key={line.sku}
                className="flex flex-col gap-2 border-b border-black/5 pb-4 last:border-b-0"
              >
                <div className="flex justify-between gap-2 text-sm">
                  <span className="font-medium text-black">{checkoutCatalog[line.sku].label}</span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.sku)}
                    className="shrink-0 text-black/45 underline-offset-2 hover:text-black hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="sr-only" htmlFor={`qty-${line.sku}`}>
                    Quantity
                  </label>
                  <input
                    id={`qty-${line.sku}`}
                    type="number"
                    min={1}
                    max={24}
                    className="w-20 rounded-lg border border-black/10 px-2 py-1"
                    value={line.quantity}
                    onChange={(e) => setQty(line.sku, Number(e.target.value))}
                  />
                  <span className="text-black/80">
                    {formatMoney(checkoutCatalog[line.sku].unitAmount * line.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {fulfillment === "delivery" && cart.length > 0 ? (
          <div className="mt-4 flex justify-between border-t border-black/5 pt-4 text-sm text-black/80">
            <span>Local delivery</span>
            <span>{formatMoney(DELIVERY_FEE_CENTS)}</span>
          </div>
        ) : null}

        {PASS_THROUGH_CARD_FEES_ENABLED && cart.length > 0 && passThroughCents > 0 ? (
          <div className="mt-3 flex justify-between border-t border-black/5 pt-3 text-sm text-black/75">
            <span>Card processing (est.)</span>
            <span>{formatMoney(passThroughCents)}</span>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-lg font-semibold">
          <span>Estimated total</span>
          <span>{formatMoney(chargeTotalCents)}</span>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={checkout}
          disabled={cart.length === 0 || loading}
          className="mt-4 w-full rounded-full bg-[#1a1a1a] py-3.5 text-lg font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Redirecting…" : "Pay securely with Stripe"}
        </button>
        <p className="mt-3 text-xs text-black/50">
          {PASS_THROUGH_CARD_FEES_ENABLED
            ? "You’ll complete payment on Stripe’s secure checkout page. The total above includes an estimated card-processing line so menu prices match what the bakery receives after Stripe fees (actual Stripe fees may vary slightly by card)."
            : "You’ll complete payment on Stripe’s secure checkout page. A card processing fee may apply per Stripe’s terms."}
        </p>
      </aside>
    </div>
  );
}

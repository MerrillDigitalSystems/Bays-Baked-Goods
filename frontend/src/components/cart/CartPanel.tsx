"use client";

import { useMemo, useState } from "react";
import { DELIVERY_FEE_CENTS, formatDeliveryFeeDisplay } from "@/config/site";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  PASS_THROUGH_CARD_FEES_ENABLED,
  customerChargeTotalCents,
  passThroughSurchargeCents,
} from "@/lib/stripe-fees";
import { MAX_LINE_QTY, useCart } from "@/components/cart/CartProvider";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

/**
 * The cart + checkout form. Lives in two places - the sticky aside on /order
 * (desktop) and the site-wide flyout drawer - sharing all state through
 * CartProvider so the two views can never disagree.
 */
export function CartPanel() {
  const {
    catalog,
    lines,
    subtotalCents,
    fulfillment,
    address,
    setFulfillment,
    setAddress,
    removeLine,
    setQty,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFeeLine = fulfillment === "delivery" ? DELIVERY_FEE_CENTS : 0;
  const netCents = subtotalCents + deliveryFeeLine;
  const passThroughCents = useMemo(() => passThroughSurchargeCents(netCents), [netCents]);
  const chargeTotalCents = useMemo(() => customerChargeTotalCents(netCents), [netCents]);

  async function checkout() {
    if (lines.length === 0) return;
    if (fulfillment === "delivery") {
      if (!address.street.trim() || !address.city.trim() || !address.zip.trim()) {
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
          items: lines,
          fulfillment,
          deliveryAddress:
            fulfillment === "delivery"
              ? {
                  street: address.street.trim(),
                  city: address.city.trim(),
                  zip: address.zip.trim(),
                }
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
    <div>
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
          <p className="text-xs font-medium uppercase tracking-wide text-black/55">
            Delivery address
          </p>
          <label className="block text-sm font-medium text-black/70">
            Street
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ street: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
              autoComplete="street-address"
            />
          </label>
          <label className="block text-sm font-medium text-black/70">
            City
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ city: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
              autoComplete="address-level2"
            />
          </label>
          <label className="block text-sm font-medium text-black/70">
            ZIP
            <input
              type="text"
              value={address.zip}
              onChange={(e) => setAddress({ zip: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black"
              autoComplete="postal-code"
            />
          </label>
        </div>
      ) : null}

      <h3 className="mt-6 text-lg font-semibold text-black">Your cart</h3>
      {lines.length === 0 ? (
        <p className="mt-4 text-black/60">No items yet  -  add from the menu.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {lines.map((line) => (
            <li
              key={line.sku}
              className="flex flex-col gap-2 border-b border-black/5 pb-4 last:border-b-0"
            >
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-medium text-black">
                  {catalog[line.sku]?.label ?? line.sku}
                </span>
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
                  max={MAX_LINE_QTY}
                  className="w-20 rounded-lg border border-black/10 px-2 py-1"
                  value={line.quantity}
                  onChange={(e) => setQty(line.sku, Number(e.target.value))}
                />
                <span className="text-black/80">
                  {formatMoney((catalog[line.sku]?.unitAmount ?? 0) * line.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {fulfillment === "delivery" && lines.length > 0 ? (
        <div className="mt-4 flex justify-between border-t border-black/5 pt-4 text-sm text-black/80">
          <span>Local delivery</span>
          <span>{formatMoney(DELIVERY_FEE_CENTS)}</span>
        </div>
      ) : null}

      {PASS_THROUGH_CARD_FEES_ENABLED && lines.length > 0 && passThroughCents > 0 ? (
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
        disabled={lines.length === 0 || loading}
        className="mt-4 w-full rounded-full bg-[#1a1a1a] py-3.5 text-lg font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Redirecting…" : "Pay securely with Stripe"}
      </button>
      <p className="mt-3 text-xs text-black/50">
        {PASS_THROUGH_CARD_FEES_ENABLED
          ? "You’ll complete payment on Stripe’s secure checkout page. The total above includes an estimated card-processing line so menu prices match what the bakery receives after Stripe fees (actual Stripe fees may vary slightly by card)."
          : "You’ll complete payment on Stripe’s secure checkout page. A card processing fee may apply per Stripe’s terms."}
      </p>
    </div>
  );
}

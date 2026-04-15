/** Site-wide copy and business rules  -  update here before launch as needed. */

/** How far in advance customers should order (shown in menu/order copy). */
export const ORDER_LEAD_TIME_DAYS = 2;

/**
 * Local delivery fee in USD cents (Stripe line item). Server uses this  -  never trust client-sent fee.
 * Set NEXT_PUBLIC_DELIVERY_FEE_CENTS (e.g. 500 = $5) to change without code edits.
 */
const rawFee = process.env.NEXT_PUBLIC_DELIVERY_FEE_CENTS;
export const DELIVERY_FEE_CENTS =
  rawFee && /^\d+$/.test(rawFee) ? parseInt(rawFee, 10) : 500;

export function formatDeliveryFeeDisplay(): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    DELIVERY_FEE_CENTS / 100
  );
}

export const PICKUP_COPY =
  "After ordering, Bailey will text you to confirm a pickup time at our West Jordan location. Exact address provided upon order confirmation.";

export const SITE_URL = "https://baysbakedgoods.com";

export function formatLeadTimeNotice(): string {
  return `Orders are baked fresh and require at least ${ORDER_LEAD_TIME_DAYS} days advance notice.`;
}

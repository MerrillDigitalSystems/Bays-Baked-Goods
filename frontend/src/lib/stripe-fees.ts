/**
 * Approximates Stripe’s US card processing fee (percentage + fixed per charge)
 * so you can pass that cost through as a separate line item. Rates vary; set env
 * to match what you see in Stripe Dashboard → Settings → Billing → Pricing.
 *
 * Card surcharges are regulated in some states — confirm compliance before enabling.
 */

const feePercent = Number(process.env.NEXT_PUBLIC_STRIPE_FEE_PERCENT ?? "0.029");
const feeFixedCents = (() => {
  const r = process.env.NEXT_PUBLIC_STRIPE_FEE_FIXED_CENTS;
  return r && /^\d+$/.test(r) ? parseInt(r, 10) : 30;
})();

export const PASS_THROUGH_CARD_FEES_ENABLED =
  process.env.NEXT_PUBLIC_PASS_THROUGH_CARD_FEES === "true";

/**
 * Gross charge (cents) so that, after Stripe’s fee, you keep about `netCents`.
 * Uses iterative rounding to match typical 2.9% + 30¢ style fees.
 */
export function grossChargeCentsFromNet(netCents: number): number {
  if (netCents <= 0) return 0;
  let gross = Math.ceil((netCents + feeFixedCents) / (1 - feePercent));
  for (let i = 0; i < 500; i++) {
    const stripeFee = Math.round(feePercent * gross) + feeFixedCents;
    if (gross - stripeFee >= netCents) return gross;
    gross += 1;
  }
  return gross;
}

/** Extra cents added on top of menu subtotal when pass-through is enabled. */
export function passThroughSurchargeCents(netCents: number): number {
  if (!PASS_THROUGH_CARD_FEES_ENABLED || netCents <= 0) return 0;
  return grossChargeCentsFromNet(netCents) - netCents;
}

/** Total the customer pays (menu + delivery [+ pass-through if enabled]). */
export function customerChargeTotalCents(netCents: number): number {
  if (!PASS_THROUGH_CARD_FEES_ENABLED) return netCents;
  return grossChargeCentsFromNet(netCents);
}

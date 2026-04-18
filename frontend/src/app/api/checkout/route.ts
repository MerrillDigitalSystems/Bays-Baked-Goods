import Stripe from "stripe";
import { DELIVERY_FEE_CENTS } from "@/config/site";
import { checkoutCatalog, type CheckoutSku } from "@/data/menu";
import {
  PASS_THROUGH_CARD_FEES_ENABLED,
  grossChargeCentsFromNet,
  passThroughSurchargeCents,
} from "@/lib/stripe-fees";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

const MAX_QTY = 24;

function baseUrl(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

type Fulfillment = "pickup" | "delivery";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Payments are not configured. Set STRIPE_SECRET_KEY on the server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("items" in body)) {
    return Response.json({ error: "Expected body with items" }, { status: 400 });
  }

  const raw = body as {
    items: { sku?: unknown; quantity?: unknown }[];
    fulfillment?: unknown;
    deliveryAddress?: { street?: unknown; city?: unknown; zip?: unknown };
  };

  if (!Array.isArray(raw.items) || raw.items.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  const fulfillment: Fulfillment =
    raw.fulfillment === "delivery" ? "delivery" : "pickup";

  let deliveryStreet = "";
  let deliveryCity = "";
  let deliveryZip = "";
  if (fulfillment === "delivery") {
    const a = raw.deliveryAddress;
    if (typeof a !== "object" || a === null) {
      return Response.json({ error: "Delivery address required for delivery orders" }, { status: 400 });
    }
    deliveryStreet = typeof a.street === "string" ? a.street.trim() : "";
    deliveryCity = typeof a.city === "string" ? a.city.trim() : "";
    deliveryZip = typeof a.zip === "string" ? a.zip.trim() : "";
    if (!deliveryStreet || !deliveryCity || !deliveryZip) {
      return Response.json(
        { error: "Please enter street, city, and ZIP for delivery" },
        { status: 400 }
      );
    }
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summaryLines: string[] = [];
  let netCents = 0;

  for (const row of raw.items) {
    if (typeof row?.sku !== "string" || typeof row?.quantity !== "number") {
      return Response.json({ error: "Each item needs sku (string) and quantity (number)" }, { status: 400 });
    }
    const sku = row.sku as CheckoutSku;
    if (!(sku in checkoutCatalog)) {
      return Response.json({ error: `Unknown product: ${row.sku}` }, { status: 400 });
    }
    const q = Math.floor(row.quantity);
    if (q < 1 || q > MAX_QTY) {
      return Response.json({ error: `Quantity must be 1–${MAX_QTY} per line` }, { status: 400 });
    }
    const { label, unitAmount } = checkoutCatalog[sku];
    netCents += unitAmount * q;
    lineItems.push({
      quantity: q,
      price_data: {
        currency: "usd",
        unit_amount: unitAmount,
        product_data: {
          name: label,
          description: "Bay's Baked Goods — West Jordan, UT (menu item)",
        },
      },
    });
    summaryLines.push(`${q}× ${label}`);
  }

  if (fulfillment === "delivery") {
    netCents += DELIVERY_FEE_CENTS;
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: DELIVERY_FEE_CENTS,
        product_data: {
          name: "Local delivery",
          description: "West Jordan area  -  confirm zone by text if needed",
        },
      },
    });
    summaryLines.push(`${formatMoney(DELIVERY_FEE_CENTS)} local delivery`);
  }

  const passThroughCents = PASS_THROUGH_CARD_FEES_ENABLED
    ? passThroughSurchargeCents(netCents)
    : 0;
  if (passThroughCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: passThroughCents,
        product_data: {
          name: "Card processing (estimated)",
          description:
            "Adjusts for Stripe card fees so menu prices match what the bakery keeps after processing.",
        },
      },
    });
    summaryLines.push(`${formatMoney(passThroughCents)} card processing (est.)`);
  }

  const origin = baseUrl(request);

  const deliveryLine =
    fulfillment === "delivery"
      ? `${deliveryStreet}, ${deliveryCity} ${deliveryZip}`.slice(0, 450)
      : "";

  const orderDescription = summaryLines.join(" · ").slice(0, 1000);
  const grossForAudit = PASS_THROUGH_CARD_FEES_ENABLED
    ? grossChargeCentsFromNet(netCents)
    : netCents;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/order/cancel`,
    phone_number_collection: { enabled: true },
    billing_address_collection: "required",
    payment_intent_data: {
      description: orderDescription,
      metadata: {
        order_summary: summaryLines.join("; ").slice(0, 450),
        net_menu_total_cents: String(netCents),
        charge_total_cents: String(grossForAudit),
        fulfillment,
        ...(fulfillment === "delivery"
          ? {
              delivery_street: deliveryStreet.slice(0, 500),
              delivery_city: deliveryCity.slice(0, 500),
              delivery_zip: deliveryZip.slice(0, 50),
              delivery_line: deliveryLine,
            }
          : {}),
      },
    },
    metadata: {
      order_summary: summaryLines.join("; ").slice(0, 450),
      net_menu_total_cents: String(netCents),
      charge_total_cents: String(grossForAudit),
      fulfillment,
      ...(fulfillment === "delivery"
        ? {
            delivery_street: deliveryStreet.slice(0, 500),
            delivery_city: deliveryCity.slice(0, 500),
            delivery_zip: deliveryZip.slice(0, 50),
            delivery_line: deliveryLine,
          }
        : {}),
    },
    ...(process.env.STRIPE_CHECKOUT_CREATE_INVOICE === "true"
      ? {
          invoice_creation: {
            enabled: true,
            invoice_data: {
              description: orderDescription.slice(0, 500),
            },
          },
        }
      : {}),
  });

  if (!session.url) {
    return Response.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return Response.json({ url: session.url });
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

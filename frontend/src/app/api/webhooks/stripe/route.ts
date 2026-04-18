import Stripe from "stripe";
import { sendOrderNotificationEmail } from "@/lib/order-notification-email";

export const runtime = "nodejs";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

/**
 * Stripe webhooks: verify signature, then on successful Checkout email a summary to Bailey (Resend).
 * Dashboard → Developers → Webhooks → Add endpoint → URL: https://yourdomain.com/api/webhooks/stripe
 * Events: checkout.session.completed
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json(
      { error: "Webhook not configured (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET)" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return Response.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sessionId = session.id;

  try {
    const full = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const md = full.metadata ?? {};
    const fulfillment = typeof md.fulfillment === "string" ? md.fulfillment : null;
    const deliveryLine = typeof md.delivery_line === "string" ? md.delivery_line : null;
    const orderSummaryMeta = typeof md.order_summary === "string" ? md.order_summary : null;

    const items = full.line_items?.data ?? [];
    const lineItemRows = items.map((li) => ({
      description: li.description ?? "Item",
      quantity: li.quantity ?? 1,
      lineTotalCents: li.amount_total ?? 0,
    }));

    const cd = full.customer_details;
    const customerEmail = full.customer_email ?? cd?.email ?? null;
    const customerPhone = cd?.phone ?? null;

    const pi =
      typeof full.payment_intent === "string"
        ? full.payment_intent
        : full.payment_intent?.id ?? null;

    const result = await sendOrderNotificationEmail({
      sessionId: full.id,
      amountTotalCents: full.amount_total,
      currency: (full.currency ?? "usd").toUpperCase(),
      customerEmail,
      customerPhone,
      fulfillment,
      deliveryLine,
      orderSummaryMeta,
      lineItemRows,
      paymentIntentId: pi,
      livemode: full.livemode,
    });

    if (!result.sent && result.reason) {
      console.warn("[webhooks/stripe] Order email skipped:", result.reason);
    }

    return Response.json({ received: true, email: result.sent ? "sent" : "skipped" });
  } catch (e) {
    console.error("[webhooks/stripe] checkout.session.completed handler error", e);
    return Response.json({ error: "Handler failed" }, { status: 500 });
  }
}

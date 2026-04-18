/** Optional Resend notification when a Checkout completes (see /api/webhooks/stripe). */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

export async function sendOrderNotificationEmail(opts: {
  sessionId: string;
  amountTotalCents: number | null;
  currency: string;
  customerEmail: string | null;
  customerPhone: string | null;
  fulfillment: string | null;
  deliveryLine: string | null;
  orderSummaryMeta: string | null;
  lineItemRows: { description: string; quantity: number; lineTotalCents: number }[];
  paymentIntentId: string | null;
  livemode: boolean;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    return {
      sent: false,
      reason: "RESEND_API_KEY, ORDER_NOTIFICATION_EMAIL, or RESEND_FROM_EMAIL not set",
    };
  }

  const subject = `New order — ${formatMoney(opts.amountTotalCents ?? 0, opts.currency)} — Bay's Baked Goods`;

  const rowsHtml =
    opts.lineItemRows.length > 0
      ? opts.lineItemRows
          .map(
            (r) =>
              `<tr><td style="padding:8px;border:1px solid #eee">${escapeHtml(r.description)}</td>` +
              `<td style="padding:8px;border:1px solid #eee;text-align:center">${r.quantity}</td>` +
              `<td style="padding:8px;border:1px solid #eee;text-align:right">${formatMoney(r.lineTotalCents, opts.currency)}</td></tr>`
          )
          .join("")
      : `<tr><td colspan="3" style="padding:8px;border:1px solid #eee">${escapeHtml(
          opts.orderSummaryMeta ?? "(no line items)"
        )}</td></tr>`;

  const pi = opts.paymentIntentId;
  const dashBase = opts.livemode
    ? "https://dashboard.stripe.com"
    : "https://dashboard.stripe.com/test";
  const stripeLink = pi ? `${dashBase}/payments/${pi}` : `${dashBase}/checkout/sessions/${opts.sessionId}`;

  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5">
    <h2 style="margin:0 0 12px">New paid order</h2>
    <p><strong>Total:</strong> ${formatMoney(opts.amountTotalCents ?? 0, opts.currency)}</p>
    <p><strong>Fulfillment:</strong> ${escapeHtml(opts.fulfillment ?? "—")}</p>
    ${
      opts.deliveryLine
        ? `<p><strong>Delivery address</strong><br/>${escapeHtml(opts.deliveryLine)}</p>`
        : ""
    }
    <p><strong>Customer email:</strong> ${escapeHtml(opts.customerEmail ?? "—")}<br/>
    <strong>Phone:</strong> ${escapeHtml(opts.customerPhone ?? "—")}</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0">
      <thead><tr><th align="left" style="padding:8px;border:1px solid #eee">Item</th>
      <th style="padding:8px;border:1px solid #eee">Qty</th>
      <th align="right" style="padding:8px;border:1px solid #eee">Line</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    ${
      opts.orderSummaryMeta
        ? `<p style="font-size:13px;color:#555"><strong>Summary:</strong> ${escapeHtml(opts.orderSummaryMeta)}</p>`
        : ""
    }
    <p style="font-size:13px"><a href="${stripeLink}">Open in Stripe</a> · Session <code>${escapeHtml(
      opts.sessionId
    )}</code></p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { sent: false, reason: `Resend ${res.status}: ${errText.slice(0, 200)}` };
  }

  return { sent: true };
}

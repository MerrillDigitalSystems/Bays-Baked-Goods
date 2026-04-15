import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import { customMenuItems, getMenuItemListJsonLd, signatureMenuItems } from "@/data/menu";
import { jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Menu & Pricing | Bay's Baked Goods – Sourdough, Bagels, Cinnamon Rolls & More",
  description:
    "Browse Bay's Baked Goods full menu  -  plain and specialty sourdough, bagels, focaccia, cinnamon rolls, cookies, and custom Make Your Own options. Prices listed for all items.",
  canonicalPath: "/menu",
});

const menuLd = jsonLdGraph(
  getMenuItemListJsonLd(),
  webPageJsonLd(
    "/menu",
    "Menu & Pricing | Bay's Baked Goods – Sourdough, Bagels, Cinnamon Rolls & More"
  )
);

export default function MenuPage() {
  const deliveryFee = formatDeliveryFeeDisplay();
  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={menuLd} />

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            Freshly baked menu
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tighter md:text-6xl">Menu</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-black" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-black/70">
            Order signature items online, or text Bailey for custom &quot;Make Your Own&quot; bakes and
            special quantities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-3 text-lg font-medium text-white shadow-xl transition hover:bg-black"
            >
              Order &amp; pay online
            </Link>
            <a
              href="sms:8014503852"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-8 py-3 text-lg font-medium text-black transition hover:border-black/20"
            >
              Text to order
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border border-black/8 bg-white/50 px-6 py-4 text-base leading-relaxed text-black/75">
            Bay&apos;s Baked Goods offers free pickup in West Jordan, Utah, or local delivery for a{" "}
            {deliveryFee} fee. Text Bailey to confirm delivery availability in your area.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-black/75">
            Orders are baked fresh and require at least {ORDER_LEAD_TIME_DAYS} days advance notice.
          </p>
        </div>

        <div className="space-y-20">
          <div className="space-y-10">
            {signatureMenuItems.map((item) => (
              <div key={item.name} className="group">
                <div className="flex items-end justify-between gap-6 border-b border-black/5 pb-4 transition-colors group-hover:border-black/20">
                  <h2 className="max-w-xl text-xl font-medium sm:text-2xl">{item.name}</h2>
                  <div className="shrink-0 text-right">
                    {item.size ? (
                      <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
                        {item.size}
                      </span>
                    ) : null}
                    <span className="text-xl font-medium sm:text-2xl">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
                Custom pricing
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Make Your Own</h2>
              <p className="mx-auto mt-4 max-w-xl text-black/70">
                Text Bailey to order these items  -  pricing depends on inclusions.
              </p>
            </div>

            <div className="space-y-8">
              {customMenuItems.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-4 border-b border-black/5 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-end"
                >
                  <h3 className="text-2xl font-medium">{item.name}</h3>
                  <div className="text-left md:text-right">
                    <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
                      {item.smallLabel}
                    </span>
                    <span className="text-2xl font-medium">{item.smallPrice}</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
                      {item.largeLabel}
                    </span>
                    <span className="text-2xl font-medium">{item.largePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-black/5 bg-white/40 p-8 text-center">
          <p className="text-lg italic text-gray-600">
            Need a different quantity? Text Bailey and she can work with you on smaller or larger
            orders.
          </p>
        </div>
      </div>
    </main>
  );
}

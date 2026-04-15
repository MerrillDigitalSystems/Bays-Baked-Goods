import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { OrderCart } from "@/components/OrderCart";
import { formatLeadTimeNotice } from "@/config/site";
import { bakerySchema } from "@/data/menu";
import { jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order Online | Bay's Baked Goods – Fresh Artisan Bread & Treats, West Jordan UT",
  description:
    "Order fresh baked goods online from Bay's Baked Goods in West Jordan, Utah. Pay signature menu items with Stripe; custom Make Your Own orders by text with Bailey via Venmo.",
  canonicalPath: "/order",
});

const orderLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd(
    "/order",
    "Order Online | Bay's Baked Goods – Fresh Artisan Bread & Treats, West Jordan UT"
  )
);

export default function OrderPage() {
  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={orderLd} />

      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Order online</p>
        <h1 className="mt-3 font-serif text-4xl italic text-black md:text-5xl">Order Fresh</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/70">
          Shop the menu below, add your favorite items to the cart, then check out. For custom
          &quot;Make Your Own&quot; bakes, text Bailey for a quote. Venmo will be used for custom
          orders.
        </p>
        <p className="mt-4 max-w-2xl rounded-xl border border-black/8 bg-white/50 px-4 py-3 text-sm text-black/75">
          {formatLeadTimeNotice()}
        </p>
        <p className="mt-4 text-sm text-black/55">
          <Link href="/menu" className="underline underline-offset-2 hover:text-black">
            View full menu &amp; pricing
          </Link>{" "}
          ·{" "}
          <a href="sms:8014503852" className="underline underline-offset-2 hover:text-black">
            Text Bailey at 801-450-3852
          </a>
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-7xl">
        <OrderCart />
      </div>
    </main>
  );
}

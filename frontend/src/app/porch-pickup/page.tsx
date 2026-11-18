import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { OrderCart } from "@/components/OrderCart";
import { PICKUP_COPY } from "@/config/site";
import { getMenuContent, getMenuItemListJsonLd } from "@/lib/content";
import { toCartProducts } from "@/lib/cart-products";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Porch Pickup | Bay's Baked Goods – Order Baked Goods in West Jordan UT",
  description:
    "Order from Bay's Baked Goods Porch Pickup menu in West Jordan, Utah. See which fresh baked goods are available now and pay securely online.",
  canonicalPath: "/porch-pickup",
});

export default async function PorchPickupPage() {
  const { groups, products } = await getMenuContent("porch");
  const structuredData = jsonLdGraph(
    await getMenuItemListJsonLd(products),
    webPageJsonLd("/porch-pickup", "Porch Pickup | Bay's Baked Goods"),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Porch Pickup", path: "/porch-pickup" },
    ])
  );

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={structuredData} />
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Fresh from the porch</p>
        <h1 className="mt-3 font-serif text-4xl italic text-black md:text-5xl">Porch Pickup</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/70">
          These items are available for pickup in West Jordan during the ordering window shown on each item.
          Porch Pickup orders are pickup-only and have no delivery fee.
        </p>
        <p className="mt-4 max-w-2xl rounded-xl border border-black/8 bg-white/50 px-4 py-3 text-sm text-black/75">{PICKUP_COPY}</p>
        <p className="mt-4 text-sm text-black/55">
          <Link href="/menu" className="underline underline-offset-2 hover:text-black">View the signature menu</Link>
          {" · "}
          <Link href="/seasonal" className="underline underline-offset-2 hover:text-black">See seasonal bakes</Link>
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-7xl">
        {products.length > 0 ? (
          <OrderCart products={toCartProducts(products)} groups={groups} heading="Available for Porch Pickup" />
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white/60 p-10 text-center">
            <h2 className="font-serif text-2xl italic text-black">No Porch Pickup orders are open right now.</h2>
            <p className="mt-3 text-black/65">Check back for the next pickup window, or order ahead from the signature menu.</p>
            <Link href="/order" className="mt-6 inline-flex rounded-full bg-[#1a1a1a] px-7 py-3 font-medium text-white">Order from signature menu</Link>
          </div>
        )}
      </div>
    </main>
  );
}

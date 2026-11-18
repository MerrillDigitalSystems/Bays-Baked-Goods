import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { OrderCart } from "@/components/OrderCart";
import { getMenuContent, getMenuItemListJsonLd } from "@/lib/content";
import { toCartProducts } from "@/lib/cart-products";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Seasonal Menu | Bay's Baked Goods – Limited-Time Bakes in West Jordan UT",
  description:
    "Browse and order Bailey's current seasonal baked goods in West Jordan, Utah. Limited-time breads and treats are available only while listed.",
  canonicalPath: "/seasonal",
});

export default async function SeasonalPage() {
  const { groups, products } = await getMenuContent("seasonal");
  const structuredData = jsonLdGraph(
    await getMenuItemListJsonLd(products),
    webPageJsonLd("/seasonal", "Seasonal Menu | Bay's Baked Goods"),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Seasonal Menu", path: "/seasonal" },
    ])
  );

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={structuredData} />
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Here for a limited time</p>
        <h1 className="mt-3 font-serif text-4xl italic text-black md:text-5xl">Seasonal Menu</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/70">
          Seasonal favorites and special bakes, available while they&apos;re listed. Add your favorites to the
          cart and choose pickup or local delivery at checkout.
        </p>
        <p className="mt-4 text-sm text-black/55">
          <Link href="/menu" className="underline underline-offset-2 hover:text-black">View the signature menu</Link>
          {" · "}
          <Link href="/porch-pickup" className="underline underline-offset-2 hover:text-black">See Porch Pickup</Link>
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-7xl">
        {products.length > 0 ? (
          <OrderCart products={toCartProducts(products)} groups={groups} heading="Current seasonal bakes" />
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white/60 p-10 text-center">
            <h2 className="font-serif text-2xl italic text-black">The next seasonal batch is in the works.</h2>
            <p className="mt-3 text-black/65">Check back soon, or browse the signature menu for Bailey&apos;s regular favorites.</p>
            <Link href="/menu" className="mt-6 inline-flex rounded-full bg-[#1a1a1a] px-7 py-3 font-medium text-white">Browse signature menu</Link>
          </div>
        )}
      </div>
    </main>
  );
}

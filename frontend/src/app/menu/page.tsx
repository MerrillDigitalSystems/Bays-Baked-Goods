import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import {
  customMenuItems,
  getMenuItemListJsonLd,
  getProductBySlug,
  signatureMenuItems,
} from "@/data/menu";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Menu & Pricing | Bay's Baked Goods – Sourdough, Bagels, Cinnamon Rolls & More",
  description:
    "Browse Bay's Baked Goods full menu - plain and specialty sourdough, bagels, focaccia, cinnamon rolls, cookies, and custom Make Your Own options. Prices listed for all items.",
  canonicalPath: "/menu",
  ogImagePath: "/og/menu.jpg",
  ogImageAlt:
    "Sliced thyme and honey focaccia on a wooden board from Bay's Baked Goods in West Jordan, Utah",
});

const menuLd = jsonLdGraph(
  getMenuItemListJsonLd(),
  webPageJsonLd(
    "/menu",
    "Menu & Pricing | Bay's Baked Goods – Sourdough, Bagels, Cinnamon Rolls & More"
  ),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
  ])
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
          {/* People buy food with their eyes, so the menu leads with the photo
              rather than reading as a price list. */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {signatureMenuItems.map((item) => {
              const product = getProductBySlug(item.slug);
              return (
                <Link
                  key={item.name}
                  href={`/menu/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-black/8 bg-white/55 shadow-[0_16px_48px_rgba(0,0,0,0.05)] transition hover:border-black/15 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f3ec]">
                    {product?.imageSrc ? (
                      <Image
                        src={product.imageSrc}
                        alt={`${item.name} from Bay's Baked Goods, West Jordan, Utah`}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                        style={
                          product.imageObjectPosition
                            ? { objectPosition: product.imageObjectPosition }
                            : undefined
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-6 text-center">
                        <span className="font-serif text-base italic text-black/40">
                          Photo coming soon
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-xl font-medium text-black underline-offset-4 group-hover:underline">
                      {item.name}
                    </h2>
                    {item.size ? (
                      <span className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                        {item.size}
                      </span>
                    ) : null}
                    <span className="mt-auto pt-4 text-xl font-medium text-black">
                      {item.price}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
                Custom pricing
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Make Your Own</h2>
              <p className="mx-auto mt-4 max-w-xl text-black/70">
                Text Bailey to order these items  -  pricing depends on inclusions. See{" "}
                <Link
                  href="/custom-orders"
                  className="underline underline-offset-4 hover:text-black"
                >
                  how custom orders work
                </Link>
                .
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

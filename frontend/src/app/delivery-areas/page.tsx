import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import { bakerySchema, SERVICE_AREA_CITIES } from "@/data/menu";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

const TITLE =
  "Delivery Areas | Bay's Baked Goods – Sourdough Delivery Around West Jordan, Utah";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Where Bay's Baked Goods delivers: West Jordan, South Jordan, Riverton, Herriman, and the surrounding Salt Lake Valley. Free West Jordan pickup or local delivery for a small fee.",
  canonicalPath: "/delivery-areas",
});

const areasLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd("/delivery-areas", TITLE),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Delivery areas", path: "/delivery-areas" },
  ])
);

export default function DeliveryAreasPage() {
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={areasLd} />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">Delivery areas</li>
          </ol>
        </nav>

        <div className="mt-8 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            Pickup and delivery
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Where Bay&apos;s delivers
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75">
            Bay&apos;s Baked Goods is a home bakery in West Jordan, Utah. Pickup is free here in
            West Jordan, and Bailey delivers to a number of nearby Salt Lake Valley communities for
            a {deliveryFee} fee.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-3xl italic text-black">Areas served</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SERVICE_AREA_CITIES.map((city) => (
              <li
                key={city}
                className="rounded-2xl border border-black/8 bg-white/50 px-5 py-4 text-lg text-black/80"
              >
                {city}, Utah
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-black/70">
            Nearby and don&apos;t see your city? Text Bailey at{" "}
            <a href="sms:8014503852" className="underline underline-offset-4 hover:text-black">
              801-450-3852
            </a>{" "}
            with your address. The delivery zone is confirmed per order, so it is always worth
            asking before you assume you are out of range.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-3xl italic text-black">Pickup in West Jordan</h2>
          <p className="mt-4 leading-relaxed text-black/75">
            Pickup is free. After you order, Bailey texts you to arrange a time, and the exact
            address is shared once your order is confirmed  -  this is a home kitchen rather than a
            storefront, so there is no walk-in counter.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-serif text-3xl italic text-black">Before you order</h2>
          <ul className="mt-4 space-y-3 leading-relaxed text-black/75">
            <li>
              Orders need at least {ORDER_LEAD_TIME_DAYS} days&apos; notice  -  everything is baked
              fresh rather than held in stock.
            </li>
            <li>Delivery is {deliveryFee}; pickup in West Jordan is free.</li>
            <li>Confirm your address is in the delivery zone by text before ordering.</li>
          </ul>
        </section>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Order online
          </Link>
          <div className="flex items-center gap-6 text-base">
            <Link
              href="/menu"
              className="underline underline-offset-4 text-black/75 transition-colors hover:text-black"
            >
              View the menu
            </Link>
            <a
              href="sms:8014503852"
              className="underline underline-offset-4 text-black/75 transition-colors hover:text-black"
            >
              Text Bailey
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

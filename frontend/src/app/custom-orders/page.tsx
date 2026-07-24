import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import { bakerySchema, customMenuItems } from "@/data/menu";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

const TITLE =
  "Custom Orders | Bay's Baked Goods – Custom Sourdough, Focaccia & Cookies in West Jordan, Utah";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Custom baked goods in West Jordan, Utah. Build your own sourdough, focaccia, bagels, or brown butter cookies with the inclusions you want. Text Bailey for a quote.",
  canonicalPath: "/custom-orders",
  ogImagePath: "/og/custom-orders.jpg",
  ogImageAlt:
    "A jalapeño cheddar sourdough loaf, an example of a custom inclusion bake from Bay's Baked Goods in West Jordan, Utah",
});

const customLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd("/custom-orders", TITLE),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Custom orders", path: "/custom-orders" },
  ])
);

export default function CustomOrdersPage() {
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={customLd} />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">Custom orders</li>
          </ol>
        </nav>

        <div className="mt-8 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            Make Your Own
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Custom baked goods in West Jordan, Utah
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75">
            Every loaf at Bay&apos;s is already baked to order, so building something specific is
            just a conversation. Pick a base  -  sourdough, focaccia, bagels, or brown butter
            cookies  -  then tell Bailey what you want folded into it. Pricing depends on how many
            inclusions you add, and you get a quote before anything is baked.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="sms:8014503852"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Text Bailey for a quote
          </a>
          <Link
            href="/menu"
            className="text-base underline underline-offset-4 text-black/75 transition-colors hover:text-black"
          >
            See the full menu
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/70">
          <li>Quoted before you pay</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>{ORDER_LEAD_TIME_DAYS} days notice minimum</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Free West Jordan pickup, {deliveryFee} local delivery</li>
        </ul>

        <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-black/8 bg-white/55 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/IMG_5967_VSCO.JPG"
              alt="A jalapeño cheddar sourdough loaf from Bay's Baked Goods, an example of a custom inclusion bake"
              fill
              sizes="(max-width: 768px) 90vw, 56rem"
              className="object-cover"
            />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            What you can customize
          </h2>
          <div className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              <strong className="font-semibold text-black">Sourdough.</strong> The most popular
              starting point. Jalape&ntilde;o cheddar and cinnamon sugar are on the regular menu
              because people kept asking for them, but the same dough takes just about anything
              savory or sweet you want to put in it.
            </p>
            <p>
              <strong className="font-semibold text-black">Focaccia.</strong> Dimpled, olive-oil
              rich, and the easiest one to make seasonal. Herbs, cheese, roasted vegetables, or
              something closer to the thyme and honey version on the menu.
            </p>
            <p>
              <strong className="font-semibold text-black">Bagels.</strong> Boiled and chewy, sold
              in fours or eights, plain or with inclusions worked through the dough.
            </p>
            <p>
              <strong className="font-semibold text-black">Brown butter cookies.</strong> Jumbo, in
              fours or eights. The brown butter base stays; what goes in it is up to you.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">Custom pricing</h2>
          <p className="mt-4 max-w-2xl text-black/70">
            Ranges below are a starting point  -  the exact price depends on what goes in. Bailey
            confirms the total by text before baking.
          </p>

          <div className="mt-8 space-y-6">
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
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">How a custom order works</h2>
          <ol className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <li>
              <span className="font-semibold text-black">1. Text Bailey.</span> Say what you want,
              roughly how much, and the date you need it. Photos of something you have seen
              elsewhere help.
            </li>
            <li>
              <span className="font-semibold text-black">2. Get a quote.</span> Bailey confirms
              what is doable and what it costs before anything is baked. Custom orders are
              typically paid through Venmo rather than the online checkout.
            </li>
            <li>
              <span className="font-semibold text-black">3. Pick it up or have it delivered.</span>{" "}
              Free pickup in West Jordan, or local delivery to surrounding areas for a{" "}
              {deliveryFee} fee. Text to confirm your address is in the delivery zone.
            </li>
          </ol>
          <p className="mt-8 text-base text-black/60">
            Everything is made in a home kitchen that also handles wheat, dairy, eggs, tree nuts,
            and soy, and there are no gluten-free options. Text Bailey with any allergy questions
            before ordering.
          </p>
        </section>

        <div className="mt-16 rounded-3xl border border-black/8 bg-[#1a1a1a] px-8 py-14 text-center text-[#f5f3ec]">
          <h2 className="font-serif text-3xl italic md:text-4xl">Have something in mind?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Text Bailey at{" "}
            <a href="sms:8014503852" className="font-semibold text-white hover:underline">
              801-450-3852
            </a>{" "}
            with your idea and your date.
          </p>
          <p className="mt-8 text-sm text-gray-500">
            Prefer to start from the menu?{" "}
            <Link href="/menu" className="text-white underline underline-offset-4">
              Browse signature items
            </Link>{" "}
            or{" "}
            <Link href="/order" className="text-white underline underline-offset-4">
              order online
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

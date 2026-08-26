import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import { bakerySchema } from "@/data/menu";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const TITLE = "Gift Baskets | Bay's Baked Goods – Baked-Goods Gift Boxes in West Jordan, Utah";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Baked-goods gift baskets in West Jordan, Utah, built to order around your budget. Fresh sourdough, bagels, cinnamon rolls, and brown butter cookies - with local delivery to the recipient's door.",
  canonicalPath: "/gift-baskets",
  ogImagePath: "/og/gift-baskets.jpg",
  ogImageAlt: "Bailey of Bay's Baked Goods holding a branded bakery bag in West Jordan, Utah",
});

const giftLd = jsonLdGraph(
  bakerySchema,
  serviceJsonLd({
    name: "Baked-goods gift baskets",
    serviceType: "Gift baskets",
    description:
      "Gift boxes of fresh-baked sourdough, bagels, cinnamon rolls, and brown butter cookies, assembled to order around the giver's budget and occasion, with pickup in West Jordan or local delivery to the recipient.",
    path: "/gift-baskets",
  }),
  webPageJsonLd("/gift-baskets", TITLE),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Gift baskets", path: "/gift-baskets" },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What goes in a gift basket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Whatever fits the person and the budget - fresh sourdough, bagels, jumbo cinnamon rolls, brown butter chocolate chunk cookies, or a mix. There is no fixed catalog; each box is assembled to order after a quick text conversation.",
        },
      },
      {
        "@type": "Question",
        name: "Can you deliver a gift basket to the recipient?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, locally. Pickup in West Jordan is free, and local delivery to surrounding areas is available for a small fee - text Bailey the recipient's address to confirm it is in the delivery zone. Bay's does not ship.",
        },
      },
      {
        "@type": "Question",
        name: "How far ahead should I order a gift basket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At least a couple of days, since everything is baked fresh to order. Around holidays, text Bailey as early as you can to get on the bake schedule.",
        },
      },
    ],
  }
);

export default function GiftBasketsPage() {
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={giftLd} />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">Gift baskets</li>
          </ol>
        </nav>

        <div className="mt-8 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            Give something warm
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Baked-goods gift baskets in West Jordan, Utah
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75">
            A box of fresh bread beats another candle. Bailey puts together gift boxes of
            sourdough, bagels, cinnamon rolls, and brown butter cookies - baked the same day,
            built around your budget, and delivered locally or ready for pickup.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="sms:8014503852"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Text Bailey to build a box
          </a>
          <Link
            href="/menu"
            className="text-base underline underline-offset-4 text-black/75 transition-colors hover:text-black"
          >
            See what can go in it
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/70">
          <li>Built around your budget</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>{ORDER_LEAD_TIME_DAYS}+ days notice</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Free West Jordan pickup, {deliveryFee} local delivery</li>
        </ul>

        <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-black/8 bg-white/55 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/IMG_6712_VSCO.JPG"
              alt="Bailey of Bay's Baked Goods holding a branded bakery bag, ready to be gifted"
              fill
              sizes="(max-width: 768px) 90vw, 56rem"
              className="object-cover"
            />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            Occasions people order for
          </h2>
          <div className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              <strong className="font-semibold text-black">Thank-yous &amp; thinking-of-yous.</strong>{" "}
              A warm loaf says it better than a card. Popular for teachers, neighbors, and anyone
              who just helped you move a couch.
            </p>
            <p>
              <strong className="font-semibold text-black">Welcome &amp; housewarming.</strong> New
              neighbors, new babies, new homes - bread is the original housewarming gift.
              Realtors: a closing-day box of fresh sourdough is a client gift people actually
              remember.
            </p>
            <p>
              <strong className="font-semibold text-black">Holidays &amp; birthdays.</strong>{" "}
              Cinnamon roll boxes for Christmas morning, cookie boxes for the person who has
              everything. Holiday slots fill up, so text early.
            </p>
            <p>
              <strong className="font-semibold text-black">Something specific.</strong> Want a
              jalape&ntilde;o cheddar loaf for the spice lover or a{" "}
              <Link href="/custom-orders" className="underline underline-offset-2 hover:text-black">
                custom bake
              </Link>{" "}
              with their favorite inclusions? That is exactly the kind of thing Bailey likes
              making.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            How a gift order works
          </h2>
          <ol className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <li>
              <span className="font-semibold text-black">1. Text Bailey.</span> Tell her the
              occasion, roughly what you want to spend, and anything you know the recipient loves
              (or cannot eat).
            </li>
            <li>
              <span className="font-semibold text-black">2. She builds the box.</span> Bailey
              suggests a mix that fits, confirms the total before baking, and bakes it fresh for
              your date. Gift orders are typically paid through Venmo.
            </li>
            <li>
              <span className="font-semibold text-black">3. Hand it over - or have it delivered.</span>{" "}
              Pick it up free in West Jordan, or have it dropped at the recipient&apos;s door for
              a {deliveryFee} fee if they are in the{" "}
              <Link href="/delivery-areas" className="underline underline-offset-2 hover:text-black">
                local delivery zone
              </Link>
              .
            </li>
          </ol>
          <p className="mt-8 text-base text-black/60">
            Gifting food? Worth knowing: everything is baked in a home kitchen that also handles
            wheat, dairy, eggs, tree nuts, and soy, and there are no gluten-free options - so
            check allergies before you gift.
          </p>
        </section>

        <div className="mt-16 rounded-3xl border border-black/8 bg-[#1a1a1a] px-8 py-14 text-center text-[#f5f3ec]">
          <h2 className="font-serif text-3xl italic md:text-4xl">Make someone&apos;s day</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Text Bailey at{" "}
            <a href="sms:8014503852" className="font-semibold text-white hover:underline">
              801-450-3852
            </a>{" "}
            with the occasion and your budget - she will take it from there.
          </p>
          <p className="mt-8 text-sm text-gray-500">
            Feeding a whole party instead? See{" "}
            <Link href="/catering" className="text-white underline underline-offset-4">
              catering
            </Link>{" "}
            or{" "}
            <Link href="/weddings" className="text-white underline underline-offset-4">
              weddings &amp; events
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

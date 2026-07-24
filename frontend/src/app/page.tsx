import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay, ORDER_LEAD_TIME_DAYS } from "@/config/site";
import { bakerySchema } from "@/data/menu";
import { jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bay's Baked Goods | Artisan Sourdough & Baked Goods in West Jordan, Utah",
  description:
    "Bay's Baked Goods is a West Jordan, Utah home bakery specializing in fresh sourdough, focaccia, bagels, cinnamon rolls, and custom bakes. Order online or text Bailey for custom orders.",
  canonicalPath: "/",
});

const homeJsonLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd(
    "/",
    "Bay's Baked Goods | Artisan Sourdough & Baked Goods in West Jordan, Utah"
  )
);

export default function Home() {
  const deliveryFee = formatDeliveryFeeDisplay();
  return (
    <main className="flex-grow">
      <JsonLd data={homeJsonLd} />

      <section className="relative overflow-hidden px-8 py-20 md:py-28">
        <div className="absolute left-1/2 top-1/3 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/50 blur-3xl animate-fade-in" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_40%)]" />

        <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium tracking-wide text-black/75 animate-fade-in-up">
              West Jordan, Utah home bakery
            </p>
            <div className="space-y-5 animate-fade-in-up animation-delay-200">
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-black sm:text-6xl md:text-7xl">
                Fresh Artisan Bread &amp; Baked Goods in West Jordan, Utah
              </h1>
              <p className="max-w-3xl font-serif text-2xl italic leading-snug text-black/85 sm:text-3xl md:text-4xl">
                Fresh sourdough, bagels, cinnamon rolls, and more  -  baked to order out of our West
                Jordan kitchen.
              </p>
              
            </div>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center animate-fade-in-up animation-delay-400">
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-2xl"
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

            {/* The lead time and delivery fee decide whether someone can order at
                all, so they belong beside the CTA rather than deep in the menu copy. */}
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-sm text-black/70 animate-fade-in-up animation-delay-400">
              <li>Baked fresh to order</li>
              <li aria-hidden="true" className="text-black/25">
                &middot;
              </li>
              <li>{ORDER_LEAD_TIME_DAYS} days notice</li>
              <li aria-hidden="true" className="text-black/25">
                &middot;
              </li>
              <li>
                Free West Jordan pickup, {deliveryFee} local delivery
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl animate-fade-in-up animation-delay-200">
            <div className="absolute inset-0 rounded-[2rem] bg-white/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
              <div className="relative aspect-square w-full max-h-[min(80vw,28rem)] mx-auto">
                <Image
                  src="/IMG_6761_VSCO.JPG"
                  alt="Bailey, the baker behind Bay's Baked Goods, in her West Jordan, Utah home kitchen with a Bay's Baked Goods bag"
                  fill
                  sizes="(max-width: 1024px) 90vw, min(28rem, 35vw)"
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/60 px-8 py-20 backdrop-blur-sm">
        {/* Bailey's story has its own section further down, so it is not repeated
            as a card here. */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Link
            href="/menu"
            className="group rounded-2xl border border-black/8 bg-white/50 p-8 transition hover:border-black/15 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Pricing</p>
            <h2 className="mt-3 font-serif text-2xl italic text-black group-hover:underline">
              Full menu
            </h2>
            <p className="mt-3 text-black/70">
              Signature items, packs, and custom &quot;Make Your Own&quot; price ranges.
            </p>
          </Link>
          <Link
            href="/order"
            className="group rounded-2xl border border-black/8 bg-white/50 p-8 transition hover:border-black/15 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Checkout</p>
            <h2 className="mt-3 font-serif text-2xl italic text-black group-hover:underline">
              Pay online
            </h2>
            <p className="mt-3 text-black/70">
              Add signature menu items to your cart and pay securely with Stripe.
            </p>
          </Link>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] border border-black/8 bg-white/55 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:grid-cols-[1fr_1fr_1fr] md:p-10">
          <div className="md:col-span-3">
            <h2 className="text-3xl font-serif italic text-black md:text-4xl">
              Here&apos;s how it works.
            </h2>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">1. Pick your treats</p>
            <p className="mt-2 leading-7 text-black/70">
              Browse the{" "}
              <Link href="/menu" className="underline underline-offset-4 hover:text-black">
                menu
              </Link>{" "}
              for sourdough, focaccia, bagels, rolls, and sweets.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">2. Order your way</p>
            <p className="mt-2 leading-7 text-black/70">
              Pay online for signature items on the{" "}
              <Link href="/order" className="underline underline-offset-4 hover:text-black">
                order page
              </Link>
              , or text Bailey for custom orders and quotes.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">3. Confirm pickup</p>
            <p className="mt-2 leading-7 text-black/70">
              Bailey will confirm timing and pickup details after you order  -  reach out anytime on the{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-black">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Replaces an empty "reviews coming soon" block. For a home bakery, naming
          the person doing the baking does more trust work than a testimonial  -
          and it is the one thing a larger competitor cannot copy. */}
      <section className="border-y border-black/5 bg-white/50 px-8 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">
            Who bakes your order
          </p>
          <h2 className="mt-3 font-serif text-3xl italic text-black md:text-4xl">
            Hi, I&apos;m Bailey.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/75">
            <p>
              Bay&apos;s Baked Goods is my home kitchen in West Jordan, not a storefront. Every loaf
              is mixed, shaped, and baked by me in small batches  -  that&apos;s why orders need a
              couple of days&apos; notice. Sourdough keeps its own schedule.
            </p>
            <p className="text-base text-black/60">
              Everything is made in a home kitchen that also handles wheat, dairy, eggs, tree nuts,
              and soy. Text me with any allergy questions before you order.
            </p>
          </div>
          <p className="mt-8">
            <Link
              href="/about"
              className="font-medium underline underline-offset-4 transition-colors hover:text-black"
            >
              More about Bailey and Goose
            </Link>
          </p>
        </div>
      </section>

      <section className="px-8 py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-black/8 bg-[#1a1a1a] px-8 py-14 text-center text-[#f5f3ec]">
          <h2 className="font-serif text-3xl italic md:text-4xl">Questions or a custom order?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Text Bailey at{" "}
            <a href="sms:8014503852" className="font-semibold text-white hover:underline">
              801-450-3852
            </a>{" "}
            or visit the contact page for social links.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full border border-white/20 bg-white/10 px-8 py-3 font-medium transition hover:bg-white/15"
          >
            Contact &amp; social
          </Link>
        </div>
      </section>
    </main>
  );
}

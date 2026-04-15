import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { formatDeliveryFeeDisplay } from "@/config/site";
import { bakerySchema } from "@/data/menu";
import { getFaqEntries, getFaqPageJsonLd } from "@/data/faq";
import { jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Order | Bay's Baked Goods – Text or Order Online",
  description:
    "Get in touch with Bay's Baked Goods. Text Bailey at 801-450-3852 to place a custom order, ask questions, or follow along on Facebook and Instagram for menu updates.",
  canonicalPath: "/contact",
});

const contactLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd("/contact", "Contact & Order | Bay's Baked Goods – Text or Order Online"),
  getFaqPageJsonLd()
);

export default function ContactPage() {
  const faq = getFaqEntries();
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow">
      <JsonLd data={contactLd} />

      <section className="relative overflow-hidden bg-[#1a1a1a] px-8 py-24 text-center text-[#f5f3ec] md:py-32">
        <div className="absolute inset-0 opacity-5 bg-[url('/menu.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/55">
              Order and updates
            </p>
            <h1 className="text-5xl font-serif italic md:text-6xl">Ready to order?</h1>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm md:p-12">
            <p className="mb-6 text-xl leading-relaxed text-gray-300 md:text-2xl">
              If you&apos;d like to place an order, text Bailey at
            </p>
            <a
              href="sms:8014503852"
              className="inline-block text-4xl font-bold tracking-tighter text-white transition-colors hover:text-[#f5f3ec]/80 md:text-6xl"
            >
              801-450-3852
            </a>
          </div>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Prefer to pay online for signature menu items?{" "}
            <Link href="/order" className="text-white underline underline-offset-4 hover:text-[#f5f3ec]">
              Start an order checkout
            </Link>
            .
          </p>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            After ordering, Bailey will text you to confirm a pickup time at our West Jordan location.
            Exact address is provided when your order is confirmed.
          </p>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Prefer delivery? Bay&apos;s offers local delivery to surrounding areas for a {deliveryFee}{" "}
            fee. Text Bailey to confirm your address is in the delivery zone before ordering.
          </p>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Keep an eye out for menu changes, prices, and special deals on Facebook and Instagram.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61587904335534"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-5 py-3 transition-colors hover:bg-white/10"
              data-analytics="social_facebook"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/bays.bakedgoods"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-5 py-3 transition-colors hover:bg-white/10"
              data-analytics="social_instagram"
            >
              Instagram
            </a>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-2xl font-serif italic text-gray-300">
              Thank you in advance for all the love and support!
              <br />
              <span className="mt-4 inline-block text-white">- Bailey</span>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white/60 px-8 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl italic text-black md:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-12 space-y-10">
            {faq.map((item) => (
              <div key={item.question}>
                <dt className="text-lg font-semibold text-black">{item.question}</dt>
                <dd className="mt-2 leading-relaxed text-black/75">{item.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-center text-sm text-black/55">
            Still curious?{" "}
            <Link href="/menu" className="underline underline-offset-2 hover:text-black">
              Browse the full menu
            </Link>{" "}
            or{" "}
            <Link href="/order" className="underline underline-offset-2 hover:text-black">
              order online
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

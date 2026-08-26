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

const TITLE = "Catering | Bay's Baked Goods – Fresh-Baked Catering in West Jordan, Utah";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Drop-off bakery catering in West Jordan, Utah. Bagel boards, fresh sourdough, focaccia, cinnamon rolls, and cookie trays for parties, showers, and office mornings. Text Bailey for a quote.",
  canonicalPath: "/catering",
  ogImagePath: "/og/catering.jpg",
  ogImageAlt:
    "Fresh boiled bagels from Bay's Baked Goods in West Jordan, Utah, ready for a catering spread",
});

const cateringLd = jsonLdGraph(
  bakerySchema,
  serviceJsonLd({
    name: "Bakery catering",
    serviceType: "Catering",
    description:
      "Drop-off style baked-goods catering for parties, showers, brunches, and office events: bagel boards, sourdough and focaccia for a crowd, cinnamon roll boxes, and cookie trays, baked to order and quoted by text.",
    path: "/catering",
  }),
  webPageJsonLd("/catering", TITLE),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Catering", path: "/catering" },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this full-service catering with staff?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No - Bay's is a home bakery, so catering is drop-off style. Everything arrives baked, boxed, and ready to set out. There is no on-site staff, serving equipment, or warming service.",
        },
      },
      {
        "@type": "Question",
        name: "How much notice does a catering order need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "More than the usual couple of days. Everything is baked to order in a home kitchen, so larger orders take longer - text Bailey your date and headcount as early as you can and she will confirm what is doable.",
        },
      },
      {
        "@type": "Question",
        name: "How is catering priced?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By quote. Text Bailey what you are hosting, roughly how many people, and what you would like served, and she confirms the total before anything is baked. Larger orders are typically paid through Venmo.",
        },
      },
    ],
  }
);

export default function CateringPage() {
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={cateringLd} />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">Catering</li>
          </ol>
        </nav>

        <div className="mt-8 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            For your event
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Baked-goods catering in West Jordan, Utah
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75">
            Feeding a crowd? Bailey bakes the same small-batch sourdough, bagels, focaccia,
            cinnamon rolls, and cookies from the regular menu - just scaled up for your party,
            shower, brunch, or office morning. Everything arrives baked, boxed, and ready to set
            out.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="sms:8014503852"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Text Bailey your date &amp; headcount
          </a>
          <Link
            href="/menu"
            className="text-base underline underline-offset-4 text-black/75 transition-colors hover:text-black"
          >
            See what she bakes
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/70">
          <li>Quoted before anything is baked</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Big orders need extra notice</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Free West Jordan pickup, {deliveryFee} local delivery</li>
        </ul>

        <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-black/8 bg-white/55 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/2BD15450-2976-4311-A7ED-7117767DF9FC_VSCO.JPG"
              alt="Fresh boiled bagels from Bay's Baked Goods, the starting point for a catering bagel board"
              fill
              sizes="(max-width: 768px) 90vw, 56rem"
              className="object-cover"
            />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            What works for a crowd
          </h2>
          <div className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              <strong className="font-semibold text-black">Bagel boards.</strong> Chewy, boiled
              bagels by the dozen for morning meetings, baby showers, and brunches - add your own
              spreads or ask Bailey what she suggests.
            </p>
            <p>
              <strong className="font-semibold text-black">Sourdough &amp; focaccia.</strong>{" "}
              Loaves for soup nights and charcuterie tables, or dimpled focaccia that cuts cleanly
              into squares for a crowd. Custom inclusions welcome - see{" "}
              <Link href="/custom-orders" className="underline underline-offset-2 hover:text-black">
                Make Your Own
              </Link>
              .
            </p>
            <p>
              <strong className="font-semibold text-black">Cinnamon roll boxes.</strong> Jumbo
              rolls, Bailey&apos;s most-requested bake, for staff mornings and holiday breakfasts.
            </p>
            <p>
              <strong className="font-semibold text-black">Cookie trays.</strong> Jumbo brown
              butter chocolate chunk cookies, stacked and ready for the dessert table.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">How catering works</h2>
          <ol className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <li>
              <span className="font-semibold text-black">1. Text Bailey early.</span> Share your
              date, rough headcount, and what you are hosting. Standard orders need{" "}
              {ORDER_LEAD_TIME_DAYS} days - bigger bakes need more, so the earlier the better.
            </li>
            <li>
              <span className="font-semibold text-black">2. Get a quote.</span> Bailey confirms
              what is doable for your date and the total cost before anything is baked. Larger
              orders are typically paid through Venmo.
            </li>
            <li>
              <span className="font-semibold text-black">3. Pickup or drop-off.</span> Free pickup
              in West Jordan, or local delivery to surrounding areas for a {deliveryFee} fee -
              text to confirm your address is in the{" "}
              <Link href="/delivery-areas" className="underline underline-offset-2 hover:text-black">
                delivery zone
              </Link>
              .
            </li>
          </ol>
          <p className="mt-8 text-base text-black/60">
            Honest fine print: Bay&apos;s is a home bakery, not a staffed catering company - no
            servers, chafing dishes, or on-site setup. Everything is made in a home kitchen that
            also handles wheat, dairy, eggs, tree nuts, and soy, with no gluten-free options.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">Catering questions</h2>
          <div className="mt-6 space-y-8 text-lg leading-relaxed text-black/75">
            <div>
              <h3 className="font-semibold text-black">Is this full-service catering with staff?</h3>
              <p className="mt-2">
                No - Bay&apos;s is a home bakery, so catering is drop-off style. Everything
                arrives baked, boxed, and ready to set out. There is no on-site staff, serving
                equipment, or warming service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">
                How much notice does a catering order need?
              </h3>
              <p className="mt-2">
                More than the usual couple of days. Everything is baked to order in a home
                kitchen, so larger orders take longer - text Bailey your date and headcount as
                early as you can and she will confirm what is doable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">How is catering priced?</h3>
              <p className="mt-2">
                By quote. Text Bailey what you are hosting, roughly how many people, and what you
                would like served, and she confirms the total before anything is baked. Larger
                orders are typically paid through Venmo.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 rounded-3xl border border-black/8 bg-[#1a1a1a] px-8 py-14 text-center text-[#f5f3ec]">
          <h2 className="font-serif text-3xl italic md:text-4xl">Planning something?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Text Bailey at{" "}
            <a href="sms:8014503852" className="font-semibold text-white hover:underline">
              801-450-3852
            </a>{" "}
            with your date, headcount, and what you have in mind.
          </p>
          <p className="mt-8 text-sm text-gray-500">
            Also see{" "}
            <Link href="/gift-baskets" className="text-white underline underline-offset-4">
              gift baskets
            </Link>{" "}
            and{" "}
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

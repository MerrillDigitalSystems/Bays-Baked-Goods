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

const TITLE =
  "Weddings & Events | Bay's Baked Goods – Wedding Favors & Dessert Tables, West Jordan UT";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    "Wedding favors, dessert-table bakes, and welcome-bag treats in West Jordan, Utah. Fresh cookies, mini sourdough, cinnamon rolls, and focaccia for weddings, showers, and rehearsal dinners. No cakes - everything else, fresh.",
  canonicalPath: "/weddings",
  ogImagePath: "/og/weddings.jpg",
  ogImageAlt:
    "A stack of brown butter chocolate chunk cookies from Bay's Baked Goods, a wedding favor and dessert table favorite",
});

const weddingsLd = jsonLdGraph(
  bakerySchema,
  serviceJsonLd({
    name: "Wedding favors and event bakes",
    serviceType: "Wedding and event baked goods",
    description:
      "Baked-to-order wedding and event treats: cookie favors, mini sourdough loaves, dessert-table cookies and cinnamon rolls, welcome-bag bakes, and rehearsal-dinner bread. No wedding cakes - Bay's works alongside your cake baker.",
    path: "/weddings",
  }),
  webPageJsonLd("/weddings", TITLE),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Weddings & events", path: "/weddings" },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you make wedding cakes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No - Bay's doesn't bake cakes. What Bailey does bake for weddings: cookie favors, mini sourdough loaves, dessert-table cookies and cinnamon rolls, welcome-bag treats, and bread for rehearsal dinners. She is happy to work alongside whoever is making your cake.",
        },
      },
      {
        "@type": "Question",
        name: "How far in advance should I book wedding bakes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As early as you can. Everything is baked to order in a home kitchen, and wedding quantities take real oven time - text Bailey your date and rough guest count well before the week of the wedding, and she will confirm what is doable.",
        },
      },
      {
        "@type": "Question",
        name: "How are wedding orders priced?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By quote, based on what you want and how many guests. Text Bailey the details and she confirms the total before anything is baked. Larger orders are typically paid through Venmo.",
        },
      },
    ],
  }
);

export default function WeddingsPage() {
  const deliveryFee = formatDeliveryFeeDisplay();

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={weddingsLd} />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">Weddings &amp; events</li>
          </ol>
        </nav>

        <div className="mt-8 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            For the big day
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Wedding favors &amp; dessert-table bakes in West Jordan, Utah
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75">
            First, the honest part: Bailey doesn&apos;t bake wedding cakes. What she does bake is
            everything around the cake - cookie favors your guests will actually eat, mini
            sourdough loaves for welcome bags, dessert tables of jumbo cookies and cinnamon
            rolls, and fresh bread for the rehearsal dinner.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="sms:8014503852"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Text Bailey your date
          </a>
          <Link
            href="/menu"
            className="text-base underline underline-offset-4 text-black/75 transition-colors hover:text-black"
          >
            See the menu
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/70">
          <li>Quoted before anything is baked</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Book well ahead of the big day</li>
          <li aria-hidden="true" className="text-black/25">
            &middot;
          </li>
          <li>Free West Jordan pickup, {deliveryFee} local delivery</li>
        </ul>

        <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-black/8 bg-white/55 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/3E6348C5-1BEA-4652-9DCF-CAF1B46CEE46.jpeg"
              alt="A stack of brown butter chocolate chunk cookies from Bay's Baked Goods, a favorite for wedding favors and dessert tables"
              fill
              sizes="(max-width: 768px) 90vw, 56rem"
              className="object-cover"
            />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            What Bailey bakes for weddings
          </h2>
          <div className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <p>
              <strong className="font-semibold text-black">Cookie favors.</strong> Jumbo brown
              butter chocolate chunk cookies - the favor guests eat on the drive home instead of
              finding in a drawer six months later. Ask about custom inclusions to match your
              menu.
            </p>
            <p>
              <strong className="font-semibold text-black">Dessert tables.</strong> Stacks of
              cookies and trays of jumbo cinnamon rolls alongside (or instead of) cake. They
              disappear fast.
            </p>
            <p>
              <strong className="font-semibold text-black">Welcome bags &amp; mini loaves.</strong>{" "}
              Mini sourdough loaves for out-of-town guest bags - a genuinely local, genuinely
              homemade touch.
            </p>
            <p>
              <strong className="font-semibold text-black">Rehearsal dinners &amp; brunches.</strong>{" "}
              Sourdough and{" "}
              <Link href="/custom-orders" className="underline underline-offset-2 hover:text-black">
                custom focaccia
              </Link>{" "}
              for the dinner table, or bagel spreads for the morning-after brunch - see{" "}
              <Link href="/catering" className="underline underline-offset-2 hover:text-black">
                catering
              </Link>{" "}
              for how those work.
            </p>
            <p>
              This page says weddings, but the same goes for bridal showers, graduations, and
              anniversary parties - if it is a day worth celebrating, it is worth fresh bread.
            </p>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">
            How wedding orders work
          </h2>
          <ol className="mt-6 space-y-6 text-lg leading-relaxed text-black/75">
            <li>
              <span className="font-semibold text-black">1. Text early.</span> Wedding quantities
              take real oven time, and everything is baked to order - so reach out well before
              the week of the wedding with your date, guest count, and what you are picturing.
              (Everyday orders need {ORDER_LEAD_TIME_DAYS} days; weddings need more.)
            </li>
            <li>
              <span className="font-semibold text-black">2. Get a quote.</span> Bailey confirms
              what is doable for your date and quantities, and the total cost, before anything is
              baked. Larger orders are typically paid through Venmo.
            </li>
            <li>
              <span className="font-semibold text-black">3. Fresh for the day.</span> Everything
              is baked as close to your event as possible. Free pickup in West Jordan, or local
              delivery for a {deliveryFee} fee within the{" "}
              <Link href="/delivery-areas" className="underline underline-offset-2 hover:text-black">
                delivery zone
              </Link>
              .
            </li>
          </ol>
          <p className="mt-8 text-base text-black/60">
            The fine print, kept honest: no wedding cakes, and everything is made in a home
            kitchen that also handles wheat, dairy, eggs, tree nuts, and soy - no gluten-free
            options. Bailey is glad to coordinate around whoever is making your cake.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-3xl italic text-black md:text-4xl">Wedding questions</h2>
          <div className="mt-6 space-y-8 text-lg leading-relaxed text-black/75">
            <div>
              <h3 className="font-semibold text-black">Do you make wedding cakes?</h3>
              <p className="mt-2">
                No - Bay&apos;s doesn&apos;t bake cakes. What Bailey does bake for weddings:
                cookie favors, mini sourdough loaves, dessert-table cookies and cinnamon rolls,
                welcome-bag treats, and bread for rehearsal dinners. She is happy to work
                alongside whoever is making your cake.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">
                How far in advance should I book wedding bakes?
              </h3>
              <p className="mt-2">
                As early as you can. Everything is baked to order in a home kitchen, and wedding
                quantities take real oven time - text Bailey your date and rough guest count well
                before the week of the wedding, and she will confirm what is doable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-black">How are wedding orders priced?</h3>
              <p className="mt-2">
                By quote, based on what you want and how many guests. Text Bailey the details and
                she confirms the total before anything is baked. Larger orders are typically paid
                through Venmo.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 rounded-3xl border border-black/8 bg-[#1a1a1a] px-8 py-14 text-center text-[#f5f3ec]">
          <h2 className="font-serif text-3xl italic md:text-4xl">Got a date?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Text Bailey at{" "}
            <a href="sms:8014503852" className="font-semibold text-white hover:underline">
              801-450-3852
            </a>{" "}
            with your date, guest count, and what you are dreaming up.
          </p>
          <p className="mt-8 text-sm text-gray-500">
            Also see{" "}
            <Link href="/catering" className="text-white underline underline-offset-4">
              catering
            </Link>{" "}
            and{" "}
            <Link href="/gift-baskets" className="text-white underline underline-offset-4">
              gift baskets
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

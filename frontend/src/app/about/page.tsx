import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { bakerySchema } from "@/data/menu";
import { jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Bailey | Bay's Baked Goods – West Jordan, Utah Home Bakery",
  description:
    "Meet Bailey  -  the baker behind Bay's Baked Goods. A small, order-based home bakery in West Jordan, Utah built around fresh bread, cozy treats, and homemade goodness.",
  canonicalPath: "/about",
});

const aboutLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd("/about", "About Bailey | Bay's Baked Goods – West Jordan, Utah Home Bakery")
);

export default function AboutPage() {
  return (
    <main className="flex-grow">
      <JsonLd data={aboutLd} />

      <section className="relative border-b border-black/5 bg-white/60 px-8 py-20 backdrop-blur-sm md:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
          <div className="order-2 space-y-8 text-lg leading-relaxed text-gray-800 md:order-1">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">About Bay&apos;s</p>
              <h1 className="text-5xl font-serif italic text-black">Hi friend!</h1>
            </div>
            <p>
              My name is Bailey. I married the love of my life, Kruz, in 2024, and we live in West
              Jordan with our dog, Goose. Baking has been part of my life for as long as I can
              remember, and sourdough made me fall even more in love with it.
            </p>
            <p>
              After months of going back and forth, I decided the only way to know was to go for it.
              Bay&apos;s Baked Goods is my small, order-based home bakery built around fresh bread,
              cozy treats, and getting fresh, homemade baked goods to people who actually appreciate
              them.
            </p>
          </div>
          <div className="order-1 relative flex justify-center md:order-2">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 motion-safe:rotate-2 motion-safe:hover:rotate-0">
              <div className="relative aspect-[4/5] w-full max-h-[80vh]">
                <Image
                  src="/about.png"
                  alt="Handwritten note from Bailey, founder of Bay's Baked Goods in West Jordan, Utah"
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-[#f5f3ec] opacity-60 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="px-8 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-10 text-lg leading-relaxed text-black/80">
          <div>
            <h2 className="font-serif text-3xl italic text-black">What Bailey bakes</h2>
            <p className="mt-4">
              Sourdough is the heart of Bay&apos;s kitchen  -  boiled bagels, dimpled focaccia, swirled
              cinnamon rolls, and brown butter chocolate chunk cookies round out the menu. Everything
              is baked in small batches so it arrives fresh and full of flavor.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl italic text-black">How ordering works</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6">
              <li>
                Browse the{" "}
                <Link href="/menu" className="underline underline-offset-2 hover:text-black">
                  menu
                </Link>{" "}
                and decide what you&apos;d like.
              </li>
              <li>
                Text Bailey or{" "}
                <Link href="/order" className="underline underline-offset-2 hover:text-black">
                  order online
                </Link>{" "}
                for signature items.
              </li>
              <li>
                Bailey will confirm pickup in West Jordan  -  exact details after you order.
              </li>
            </ol>
          </div>
          <div>
            <h2 className="font-serif text-3xl italic text-black">Follow along</h2>
            <p className="mt-4">
              Menu updates, specials, and behind-the-scenes baking on{" "}
              <a
                href="https://www.facebook.com/profile.php?id=61587904335534"
                className="underline underline-offset-2 hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_facebook"
              >
                Facebook
              </a>{" "}
              and{" "}
              <a
                href="https://www.instagram.com/bays.bakedgoods"
                className="underline underline-offset-2 hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_instagram"
              >
                Instagram
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

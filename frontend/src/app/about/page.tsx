import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { bakerySchema } from "@/data/menu";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Bailey | Bay's Baked Goods – West Jordan, Utah Home Bakery",
  description:
    "Meet Bailey  -  the baker behind Bay's Baked Goods. A small, order-based home bakery in West Jordan, Utah built around fresh bread, cozy treats, and homemade goodness.",
  canonicalPath: "/about",
});

const aboutLd = jsonLdGraph(
  bakerySchema,
  webPageJsonLd("/about", "About Bailey | Bay's Baked Goods – West Jordan, Utah Home Bakery"),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ])
);

export default function AboutPage() {
  return (
    <main className="flex-grow">
      <JsonLd data={aboutLd} />

      <section className="relative border-b border-black/5 bg-white/60 px-8 py-20 backdrop-blur-sm md:py-28">
        <h1 className="sr-only">About Bailey | Bay&apos;s Baked Goods</h1>
        <div className="mx-auto grid max-w-5xl items-stretch gap-16 md:grid-cols-2">
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 motion-safe:-rotate-2 motion-safe:hover:rotate-0">
              <div className="relative aspect-[4/5] w-full max-h-[80vh]">
                <Image
                  src="/IMG_6712_VSCO.JPG"
                  alt="Bailey, baker and founder of Bay's Baked Goods in West Jordan, Utah"
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-[#f5f3ec] opacity-60 blur-2xl" />
          </div>
          <div className="relative flex justify-center">
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
              Sourdough is the heart of Bay&apos;s kitchen  -  bagels, focaccia, cinnamon rolls, and
              brown butter chocolate chunk cookies round out the menu. Everything is baked in small
              batches so it arrives fresh and full of flavor.
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

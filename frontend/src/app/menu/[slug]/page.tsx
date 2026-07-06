import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { formatLeadTimeNotice } from "@/config/site";
import {
  bakerySchema,
  checkoutProducts,
  getProductBySlug,
  getProductDetailJsonLd,
} from "@/data/menu";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata, webPageJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return checkoutProducts.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Menu | Bay's Baked Goods" };
  }
  return pageMetadata({
    title: `${product.title} | Bay's Baked Goods – West Jordan, Utah`,
    description: `${product.description} Order ${product.title.toLowerCase()} online from Bay's Baked Goods, a home bakery in West Jordan, Utah.`,
    canonicalPath: `/menu/${product.id}`,
    imagePath: product.imageSrc,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productLd = jsonLdGraph(
    bakerySchema,
    getProductDetailJsonLd(product),
    webPageJsonLd(`/menu/${product.id}`, `${product.title} | Bay's Baked Goods`),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Menu", path: "/menu" },
      { name: product.title, path: `/menu/${product.id}` },
    ])
  );

  return (
    <main className="flex-grow px-8 py-16 md:py-24">
      <JsonLd data={productLd} />

      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-sm text-black/55">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/menu" className="hover:text-black">
                Menu
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black/80">{product.title}</li>
          </ol>
        </nav>

        <div className="mt-8 grid items-start gap-12 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-black/8 bg-white/55 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
              {product.imageSrc ? (
                <Image
                  src={product.imageSrc}
                  alt={`${product.title} from Bay's Baked Goods, West Jordan, Utah`}
                  fill
                  sizes="(max-width: 768px) 90vw, 28rem"
                  priority
                  className="object-cover"
                  style={
                    product.imageObjectPosition
                      ? { objectPosition: product.imageObjectPosition }
                      : undefined
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f5f3ec] p-8 text-center">
                  <span className="font-serif text-xl italic text-black/45">
                    Photo coming soon
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">
                Bay&apos;s Baked Goods
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
                {product.title}
              </h1>
              <p className="text-lg leading-relaxed text-black/75">{product.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black">Sizes &amp; pricing</h2>
              <ul className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/8 bg-white/50">
                {product.variants.map((variant) => (
                  <li
                    key={variant.sku}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <span className="text-black/80">{variant.shortLabel}</span>
                    <span className="text-lg font-medium text-black">{variant.priceDisplay}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.allergens.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-black">Allergens</h2>
                <p className="mt-2 text-sm leading-relaxed text-black/60">
                  Contains: {product.allergens.join(", ")}. Made in a home kitchen that also
                  handles wheat, dairy, eggs, tree nuts, and soy  -  text Bailey with any allergy
                  questions before ordering.
                </p>
              </div>
            )}

            <p className="rounded-xl border border-black/8 bg-white/50 px-4 py-3 text-sm text-black/75">
              {formatLeadTimeNotice()}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
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

            <p className="text-sm text-black/55">
              <Link href="/menu" className="underline underline-offset-2 hover:text-black">
                Back to full menu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

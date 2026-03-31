import Image from "next/image";
import Link from "next/link";

const signatureMenuItems = [
  { name: "Plain Sourdough", size: "Mini / Regular", price: "$5 / $10" },
  { name: "Jalapeno Cheddar Sourdough", size: "Mini / Regular", price: "$6 / $12" },
  { name: "Cinnamon Sugar Sourdough", size: "Mini / Regular", price: "$6 / $12" },
  { name: "Plain Bagels", size: "4 Pack / 8 Pack", price: "$8 / $16" },
  { name: "Thyme & Honey Focaccia", size: null, price: "$15" },
  { name: "Cinnamon Rolls", size: "4 Jumbo / 8 Jumbo", price: "$12 / $24" },
  {
    name: "Brown Butter Choc Chunk Cookies",
    size: "4 Jumbo / 8 Jumbo",
    price: "$8 / $16",
  },
] as const;

const customMenuItems = [
  { name: "Sourdough", smallLabel: "1-2 Inclusions", smallPrice: "$13-$15", largeLabel: "3+ Inclusions", largePrice: "$16-$18" },
  { name: "Focaccia", smallLabel: "1-2 Inclusions", smallPrice: "$14-$17", largeLabel: "3+ Inclusions", largePrice: "$18-$20" },
  { name: "Bagels (4)", smallLabel: "1-2 Inclusions", smallPrice: "$10-$11", largeLabel: "3+ Inclusions", largePrice: "$12-$14" },
  { name: "Bagels (8)", smallLabel: "1-2 Inclusions", smallPrice: "$18-$19", largeLabel: "3+ Inclusions", largePrice: "$20-$22" },
  { name: "Brown Butter Cookies (4)", smallLabel: "1-2 Inclusions", smallPrice: "$9-$10", largeLabel: "3+ Inclusions", largePrice: "$11-$13" },
  { name: "Brown Butter Cookies (8)", smallLabel: "1-2 Inclusions", smallPrice: "$17-$18", largeLabel: "3+ Inclusions", largePrice: "$19-$21" },
] as const;

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Bay's Baked Goods",
  image: "https://baysbakedgoods.com/logo.png",
  description:
    "Bay's Baked Goods is a home bakery in West Jordan, Utah offering artisan sourdough bread, focaccia, bagels, cinnamon rolls, cookies, and sweet treats.",
  telephone: "+1-801-450-3852",
  url: "https://baysbakedgoods.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "West Jordan",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: "Utah",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61587904335534",
    "https://www.instagram.com/bays.bakedgoods",
  ],
};

export default function Home() {
  return (
    <main className="flex-grow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
      />

      <section className="relative overflow-hidden px-8 py-20 md:py-28">
        <div className="absolute left-1/2 top-1/3 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/50 blur-3xl animate-fade-in" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_40%)]" />

        <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-medium tracking-wide text-black/75 animate-fade-in-up">
              West Jordan, Utah home bakery
            </p>
            <div className="space-y-5 animate-fade-in-up animation-delay-200">
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-black sm:text-6xl md:text-7xl">
                Artisan bread and sweet treats made for slow mornings and special gatherings.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-black/70 sm:text-xl">
                Fresh sourdough, focaccia, bagels, cinnamon rolls, cookies, and more. Order from Bay&apos;s Baked Goods and enjoy homemade goodness baked in West Jordan.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
              <Link
                href="#menu"
                className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-10 py-4 text-lg font-medium text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-2xl"
              >
                View Menu
              </Link>
              <a
                href="sms:8014503852"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-10 py-4 text-lg font-medium text-black transition-all duration-300 hover:border-black/20 hover:bg-white"
              >
                Text to Order
              </a>
            </div>

            <div className="grid gap-4 pt-4 text-left text-sm text-black/65 sm:grid-cols-3 animate-fade-in-up animation-delay-400">
              <div className="rounded-2xl border border-black/8 bg-white/45 p-4">
                <p className="font-semibold text-black">Order-based baking</p>
                <p>Freshly made in small batches.</p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/45 p-4">
                <p className="font-semibold text-black">Local pickup</p>
                <p>Based in West Jordan, Utah.</p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/45 p-4">
                <p className="font-semibold text-black">Custom quantities</p>
                <p>Less or more than the menu on request.</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl animate-fade-in-up animation-delay-200">
            <div className="absolute inset-0 rounded-[2rem] bg-white/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
              <div className="relative aspect-square w-full">
                <Image
                  src="/logo.png"
                  alt="Bay's Baked Goods logo"
                  fill
                  priority
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative border-y border-black/5 bg-white/60 px-8 py-24 backdrop-blur-sm">
        <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
          <div className="order-2 space-y-8 text-lg leading-relaxed text-gray-800 md:order-1">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">About Bay&apos;s</p>
              <h2 className="text-5xl font-serif italic text-black">Hi friend!</h2>
            </div>
            <p>
              My name is Bailey. I married the love of my life, Kruz, in 2024, and we live in West Jordan with our dog, Goose. Baking has been part of my life for as long as I can remember, and sourdough made me fall even more in love with it.
            </p>
            <p>
              After months of going back and forth, I decided the only way to know was to go for it. Bay&apos;s Baked Goods is my small, order-based home bakery built around fresh bread, cozy treats, and sharing homemade goodness with families across Utah.
            </p>
          </div>
          <div className="order-1 relative flex justify-center md:order-2">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 motion-safe:rotate-2 motion-safe:hover:rotate-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/about.png"
                  alt="A handwritten note introducing Bailey and Bay's Baked Goods"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-[#f5f3ec] opacity-60 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] border border-black/8 bg-white/55 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:grid-cols-3 md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">How It Works</p>
            <h2 className="mt-3 text-4xl font-serif italic text-black">Simple ordering, homemade results.</h2>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">1. Pick your treats</p>
            <p className="mt-2 leading-7 text-black/70">Browse the menu and choose what sounds good, whether that is sourdough, focaccia, bagels, cinnamon rolls, or sweets.</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">2. Send a text</p>
            <p className="mt-2 leading-7 text-black/70">Text your order to Bailey at <a href="tel:8014503852" className="underline underline-offset-4">801-450-3852</a> and ask about custom quantities if needed.</p>
          </div>
        </div>
      </section>

      <section id="menu" className="relative px-8 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">Freshly baked menu</p>
            <h2 className="mt-4 text-6xl font-bold tracking-tighter">Menu</h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-black" />
          </div>

          <div className="space-y-20">
            <div className="space-y-10">
              {signatureMenuItems.map((item) => (
                <div key={item.name} className="group">
                  <div className="flex items-end justify-between gap-6 border-b border-black/5 pb-4 transition-colors group-hover:border-black/20">
                    <h3 className="max-w-xl text-xl font-medium sm:text-2xl">{item.name}</h3>
                    <div className="shrink-0 text-right">
                      {item.size ? (
                        <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">{item.size}</span>
                      ) : null}
                      <span className="text-xl font-medium sm:text-2xl">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-black/8 bg-white/45 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:p-10">
              <div className="mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">Custom pricing</p>
                <h3 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Make Your Own</h3>
              </div>

              <div className="space-y-8">
                {customMenuItems.map((item) => (
                  <div key={item.name} className="grid gap-4 border-b border-black/5 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-end">
                    <h4 className="text-2xl font-medium">{item.name}</h4>
                    <div className="text-left md:text-right">
                      <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">{item.smallLabel}</span>
                      <span className="text-2xl font-medium">{item.smallPrice}</span>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="mb-1 block text-xs uppercase tracking-wider text-gray-500">{item.largeLabel}</span>
                      <span className="text-2xl font-medium">{item.largePrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-2xl border border-black/5 bg-white/40 p-8 text-center">
            <p className="text-lg italic text-gray-600">
              Need a smaller or larger quantity? Bay&apos;s Baked Goods can bake less or more than what is listed on the menu upon request.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-[#1a1a1a] px-8 py-32 text-center text-[#f5f3ec]">
        <div className="absolute inset-0 opacity-5 bg-[url('/menu.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/55">Order and updates</p>
            <h2 className="text-6xl font-serif italic">Ready to order?</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
            <p className="mb-6 text-2xl leading-relaxed text-gray-300">If you&apos;d like to place an order, text Bailey at</p>
            <a
              href="sms:8014503852"
              className="inline-block text-5xl font-bold tracking-tighter text-white transition-colors hover:text-[#f5f3ec]/80 md:text-7xl"
            >
              801-450-3852
            </a>
          </div>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            Keep an eye out for menu changes, prices, and special deals on Facebook and Instagram. Bay&apos;s Baked Goods is built to bring a little more homemade goodness to homes all across Utah.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61587904335534"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-5 py-3 transition-colors hover:bg-white/10"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/bays.bakedgoods"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-5 py-3 transition-colors hover:bg-white/10"
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
    </main>
  );
}

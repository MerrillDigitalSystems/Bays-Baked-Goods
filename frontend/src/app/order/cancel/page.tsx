import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Canceled | Bay's Baked Goods",
  robots: { index: false, follow: false },
};

export default function OrderCancelPage() {
  return (
    <main className="flex-grow px-8 py-24 text-center">
      <div className="mx-auto max-w-lg space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Checkout</p>
        <h1 className="font-serif text-4xl italic text-black md:text-5xl">Canceled</h1>
        <p className="text-lg leading-relaxed text-black/70">
          No charge was made. Your cart is still here if you want to try again  -  or text Bailey to
          place an order the usual way.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-3 font-medium text-white transition hover:bg-black"
          >
            Return to order
          </Link>
          <a
            href="sms:8014503852"
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/80 px-8 py-3 font-medium text-black transition hover:border-black/25"
          >
            Text to order
          </a>
        </div>
      </div>
    </main>
  );
}

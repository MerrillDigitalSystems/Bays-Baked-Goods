import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Bay's Baked Goods",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;

  return (
    <main className="flex-grow px-8 py-24 text-center">
      <div className="mx-auto max-w-lg space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/55">Payment received</p>
        <h1 className="font-serif text-4xl italic text-black md:text-5xl">Thank you!</h1>
        <p className="text-lg leading-relaxed text-black/70">
          Your order is in. Bailey will reach out to confirm pickup time and any final details.
        </p>
        {sessionId ? (
          <p className="text-xs text-black/45">
            Reference: <span className="font-mono">{sessionId}</span>
          </p>
        ) : null}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-3 font-medium text-white transition hover:bg-black"
          >
            Back to menu
          </Link>
          <a
            href="sms:8014503852?body=Hi%20Bailey%2C%20I%20just%20placed%20an%20online%20order."
            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/80 px-8 py-3 font-medium text-black transition hover:border-black/25"
          >
            Text Bailey
          </a>
        </div>
      </div>
    </main>
  );
}

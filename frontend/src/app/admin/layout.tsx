import type { Metadata } from "next";

/**
 * Bailey's phone-first editing area. Never indexed (robots.ts also disallows
 * /admin), no OG metadata  -  this is a tool, not a page.
 */
export const metadata: Metadata = {
  title: "Bay's Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-grow px-5 py-10 sm:px-8">{children}</main>;
}

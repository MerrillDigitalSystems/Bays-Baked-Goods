import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL("https://baysbakedgoods.com"),
  applicationName: "Bay's Baked Goods",
  category: "food",
  keywords:
    "bakery, sourdough, focaccia, West Jordan, Utah, artisan bread, sweet treats, cookies, cinnamon rolls, bagels",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#f5f3ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-[#f5f3ec] text-[#1a1a1a]`}
      >
        <Analytics />
        <header className="sticky top-0 z-50 bg-[#f5f3ec]/80 backdrop-blur-md border-b border-black/5">
          <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl tracking-tighter transition-colors hover:text-black/70">
              Bay&apos;s Baked Goods
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-4 text-sm font-medium md:gap-6">
              <Link href="/about" className="hover:text-gray-600 transition-colors">
                About
              </Link>
              <Link href="/menu" className="hover:text-gray-600 transition-colors">
                Menu
              </Link>
              <Link href="/order" className="hover:text-gray-600 transition-colors">
                Order
              </Link>
              <Link href="/contact" className="hover:text-gray-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="bg-black py-12 text-center text-sm text-gray-400">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Bay&apos;s Baked Goods. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
              <Link href="/order" className="hover:text-white transition-colors">
                Order online
              </Link>
              <a
                href="https://www.facebook.com/profile.php?id=61587904335534"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/bays.bakedgoods"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="social_instagram"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="mx-auto mt-4 max-w-6xl px-8">
            <a
              href="https://www.merrilldigitalsystems.com"
              className="text-gray-500 transition-colors hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Created by Merrill Digital Systems
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

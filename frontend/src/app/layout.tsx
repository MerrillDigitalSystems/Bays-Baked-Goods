import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://baysbakedgoods.com"),
  title: "Bay's Baked Goods | Artisan Bread & Sweet Treats",
  description: "Home bakery in West Jordan, Utah offering artisan sourdough bread, bagels, cinnamon rolls, and sweet treats. Order today!",
  keywords: "bakery, sourdough, West Jordan, Utah, artisan bread, sweet treats, cookies, cinnamon rolls, bagels",
  applicationName: "Bay's Baked Goods",
  category: "food",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Bay's Baked Goods",
    description: "Artisan Bread & Sweet Treats in West Jordan, Utah",
    url: "https://baysbakedgoods.com",
    siteName: "Bay's Baked Goods",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bay's Baked Goods",
    description: "Artisan bread and sweet treats baked in West Jordan, Utah.",
    images: ["/logo.png"],
  },
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
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-[#f5f3ec] text-[#1a1a1a]`}>
        <header className="sticky top-0 z-50 bg-[#f5f3ec]/80 backdrop-blur-md border-b border-black/5">
          <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl tracking-tighter transition-colors hover:text-black/70">
              bay&apos;s baked goods
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <a href="#about" className="hover:text-gray-600 transition-colors">About</a>
              <a href="#menu" className="hover:text-gray-600 transition-colors">Menu</a>
              <a href="#contact" className="hover:text-gray-600 transition-colors">Contact</a>
            </nav>
          </div>
        </header>
        
        {children}

        <footer className="bg-black text-white py-12 text-center text-sm text-gray-400">
          <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Bay&apos;s Baked Goods. All rights reserved.</p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61587904335534"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/bays.bakedgoods"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

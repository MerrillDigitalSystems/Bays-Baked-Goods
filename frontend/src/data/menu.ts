/** Display-only menu (includes custom pricing ranges). */
export const signatureMenuItems = [
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

export const customMenuItems = [
  {
    name: "Sourdough",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$13-$15",
    largeLabel: "3+ Inclusions",
    largePrice: "$16-$18",
  },
  {
    name: "Focaccia",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$14-$17",
    largeLabel: "3+ Inclusions",
    largePrice: "$18-$20",
  },
  {
    name: "Bagels (4)",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$10-$11",
    largeLabel: "3+ Inclusions",
    largePrice: "$12-$14",
  },
  {
    name: "Bagels (8)",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$18-$19",
    largeLabel: "3+ Inclusions",
    largePrice: "$20-$22",
  },
  {
    name: "Brown Butter Cookies (4)",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$9-$10",
    largeLabel: "3+ Inclusions",
    largePrice: "$11-$13",
  },
  {
    name: "Brown Butter Cookies (8)",
    smallLabel: "1-2 Inclusions",
    smallPrice: "$17-$18",
    largeLabel: "3+ Inclusions",
    largePrice: "$19-$21",
  },
] as const;

/** SKUs allowed at checkout  -  amounts must match menu (server-validated). */
export const checkoutCatalog = {
  "plain-sourdough-mini": { label: "Plain Sourdough (Mini)", unitAmount: 500 },
  "plain-sourdough-regular": { label: "Plain Sourdough (Regular)", unitAmount: 1000 },
  "jalapeno-mini": { label: "Jalapeño Cheddar Sourdough (Mini)", unitAmount: 600 },
  "jalapeno-regular": { label: "Jalapeño Cheddar Sourdough (Regular)", unitAmount: 1200 },
  "cinnamon-sugar-mini": { label: "Cinnamon Sugar Sourdough (Mini)", unitAmount: 600 },
  "cinnamon-sugar-regular": { label: "Cinnamon Sugar Sourdough (Regular)", unitAmount: 1200 },
  "plain-bagels-4": { label: "Plain Bagels (4 pack)", unitAmount: 800 },
  "plain-bagels-8": { label: "Plain Bagels (8 pack)", unitAmount: 1600 },
  "thyme-focaccia": { label: "Thyme & Honey Focaccia", unitAmount: 1500 },
  "cinnamon-rolls-4": { label: "Cinnamon Rolls (4 jumbo)", unitAmount: 1200 },
  "cinnamon-rolls-8": { label: "Cinnamon Rolls (8 jumbo)", unitAmount: 2400 },
  "cookies-4": { label: "Brown Butter Choc Chunk Cookies (4 jumbo)", unitAmount: 800 },
  "cookies-8": { label: "Brown Butter Choc Chunk Cookies (8 jumbo)", unitAmount: 1600 },
} as const;

export type CheckoutSku = keyof typeof checkoutCatalog;

/** Visual order page  -  one card per product family; optional `imageSrc` under `public/`. */
export const checkoutProducts: {
  id: string;
  title: string;
  description: string;
  /** e.g. `/products/sourdough.webp`  -  omit or break to show placeholder */
  imageSrc?: string;
  /** Passed to `object-position` with `object-cover` (e.g. `center 38%` to keep a tall subject in frame). */
  imageObjectPosition?: string;
  variants: { sku: CheckoutSku; shortLabel: string; priceDisplay: string }[];
}[] = [
  {
    id: "plain-sourdough",
    title: "Plain Sourdough",
    description: "Classic sourdough with a chewy crumb and crispy crust. Good for everything.",
    imageSrc: "/IMG_6002_VSCO.JPG",
    variants: [
      { sku: "plain-sourdough-mini", shortLabel: "Mini", priceDisplay: "$5" },
      { sku: "plain-sourdough-regular", shortLabel: "Regular", priceDisplay: "$10" },
    ],
  },
  {
    id: "jalapeno-cheddar",
    title: "Jalapeño Cheddar Sourdough",
    description: "A little heat and sharp cheddar baked into every slice.",
    imageSrc: "/IMG_5967_VSCO.JPG",
    variants: [
      { sku: "jalapeno-mini", shortLabel: "Mini", priceDisplay: "$6" },
      { sku: "jalapeno-regular", shortLabel: "Regular", priceDisplay: "$12" },
    ],
  },
  {
    id: "cinnamon-sugar",
    title: "Cinnamon Sugar Sourdough",
    description: "Sourdough swirled with cinnamon sugar. Hard to eat just one slice.",
    imageSrc: "/IMG_6249_VSCO.JPG",
    imageObjectPosition: "center 30%",
    variants: [
      { sku: "cinnamon-sugar-mini", shortLabel: "Mini", priceDisplay: "$6" },
      { sku: "cinnamon-sugar-regular", shortLabel: "Regular", priceDisplay: "$12" },
    ],
  },
  {
    id: "plain-bagels",
    title: "Plain Bagels",
    description: "Chewy, boiled bagels  -  perfect with cream cheese or your favorite spread.",
    imageSrc: "/2BD15450-2976-4311-A7ED-7117767DF9FC_VSCO.JPG",
    variants: [
      { sku: "plain-bagels-4", shortLabel: "4 pack", priceDisplay: "$8" },
      { sku: "plain-bagels-8", shortLabel: "8 pack", priceDisplay: "$16" },
    ],
  },
  {
    id: "thyme-focaccia",
    title: "Thyme & Honey Focaccia",
    description:
      "Dimpled focaccia with thyme and a drizzle of honey. Great with soup or on its own.",
    imageSrc: "/IMG_6335_VSCO.JPG",
    variants: [{ sku: "thyme-focaccia", shortLabel: "One loaf", priceDisplay: "$15" }],
  },
  {
    id: "cinnamon-rolls",
    title: "Cinnamon Rolls",
    description: "Jumbo cinnamon rolls. Bailey's most-requested item.",
    variants: [
      { sku: "cinnamon-rolls-4", shortLabel: "4 jumbo", priceDisplay: "$12" },
      { sku: "cinnamon-rolls-8", shortLabel: "8 jumbo", priceDisplay: "$24" },
    ],
  },
  {
    id: "choc-chunk-cookies",
    title: "Brown Butter Choc Chunk Cookies",
    description: "Rich brown butter dough loaded with chocolate chunks.",
    variants: [
      { sku: "cookies-4", shortLabel: "4 jumbo", priceDisplay: "$8" },
      { sku: "cookies-8", shortLabel: "8 jumbo", priceDisplay: "$16" },
    ],
  },
];

export const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Bay's Baked Goods",
  url: "https://baysbakedgoods.com",
  telephone: "+18014503852",
  address: {
    "@type": "PostalAddress",
    addressLocality: "West Jordan",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Utah",
  },
  servesCuisine: "Bakery",
  priceRange: "$",
  description:
    "Order-based home bakery in West Jordan, Utah specializing in fresh sourdough, bagels, focaccia, cinnamon rolls, and custom bakes. Pickup in West Jordan and local delivery to surrounding areas  -  text to confirm delivery availability.",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61587904335534",
    "https://www.instagram.com/bays.bakedgoods",
  ],
  potentialAction: {
    "@type": "OrderAction",
    target: "https://baysbakedgoods.com/order",
  },
};

/** ItemList + Product entries for signature menu (menu page). */
export function getMenuItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: signatureMenuItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: `${item.name}  -  handmade at Bay's Baked Goods, West Jordan, Utah.`,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://baysbakedgoods.com/order",
          description: item.price,
        },
      },
    })),
  };
}

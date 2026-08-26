import { ORDER_LEAD_TIME_DAYS, formatDeliveryFeeDisplay } from "@/config/site";

/** Shown once above the FAQ list on the contact page. */
export const faqSmsIntro =
  "For any of the below, you can always reach Bailey by text at 801-450-3852.";

/**
 * Ordered so the questions that decide whether someone can order at all come
 * first. Every answer here is also emitted as FAQPage structured data, so keep
 * them factual  -  do not state a delivery radius, order minimum, or cottage
 * food registration status that has not been confirmed with Bailey.
 */
export function getFaqEntries() {
  const fee = formatDeliveryFeeDisplay();
  return [
    {
      question: "How far in advance do I need to order?",
      answer: `At least ${ORDER_LEAD_TIME_DAYS} days. Everything is baked to order in small batches, so sourdough in particular needs time to proof. Text Bailey to check availability for your date.`,
    },
    {
      question: "Can I order the same day?",
      answer: `Usually not - orders need at least ${ORDER_LEAD_TIME_DAYS} days' notice. If you are in a pinch, text Bailey at 801-450-3852 and she will let you know whether anything is already baked.`,
    },
    {
      question: "Do you offer delivery?",
      answer: `Yes. Bay's Baked Goods offers local delivery to areas surrounding West Jordan for a ${fee} fee. Text Bailey to confirm your address is in the delivery zone before placing your order.`,
    },
    {
      question: "Where and when is pickup?",
      answer:
        "Pickup is free in West Jordan, Utah. After you order, Bailey will text you to arrange a pickup time, and the exact address is shared once your order is confirmed.",
    },
    {
      question: "Do you take custom orders?",
      answer:
        "Absolutely. The Make Your Own menu covers custom sourdough, focaccia, bagels, and cookies with your choice of inclusions, and pricing depends on what you add. Text Bailey for a quote.",
    },
    {
      question: "Can I order a different quantity than what's listed?",
      answer:
        "Yes. Bailey can accommodate smaller or larger quantities for most items - just ask when you text.",
    },
    {
      question: "Do you do large orders for parties or events?",
      answer:
        "Text Bailey with your date, headcount, and what you have in mind. Larger orders need more notice than the usual couple of days, so reach out as early as you can.",
    },
    {
      question: "Do you offer catering?",
      answer:
        "Yes, drop-off style. Bailey bakes bagel boards, sourdough and focaccia for a crowd, cinnamon roll boxes, and cookie trays for parties, showers, brunches, and office mornings - everything arrives baked, boxed, and ready to set out. Text her your date and headcount for a quote.",
    },
    {
      question: "Do you make gift baskets?",
      answer:
        "Yes. Gift boxes of fresh sourdough, bagels, cinnamon rolls, and cookies are assembled to order around your budget and occasion - there is no fixed catalog. Pickup free in West Jordan, or local delivery to the recipient's door in the delivery zone.",
    },
    {
      question: "Do you make wedding cakes?",
      answer:
        "No - Bay's doesn't bake cakes. For weddings, Bailey bakes cookie favors, mini sourdough loaves for welcome bags, dessert-table cookies and cinnamon rolls, and bread for rehearsal dinners, and she is happy to work alongside your cake baker.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Signature menu items can be paid for by card at checkout, handled securely through Stripe. Custom Make Your Own orders are quoted by text and typically paid through Venmo.",
    },
    {
      question: "Are your products made in a home kitchen?",
      answer:
        "Yes. Bay's Baked Goods is a home bakery in West Jordan, Utah, not a commercial storefront. Everything is baked by Bailey in her own kitchen in small batches.",
    },
    {
      question: "Do you handle allergies or offer gluten-free options?",
      answer:
        "There are no gluten-free options - every item is made with wheat flour, and the same home kitchen also handles dairy, eggs, tree nuts, and soy, so cross-contamination cannot be ruled out. Bay's is not a safe choice for celiac disease or a severe allergy. Text Bailey with any allergy questions before ordering.",
    },
    {
      question: "How should I store my bread, and how long does it stay fresh?",
      answer:
        "Keep sourdough at room temperature in a paper bag or bread box, cut side down, and it is at its best for the first two or three days. Avoid the refrigerator, which stales bread faster. For longer storage, slice it first and freeze, then toast straight from frozen.",
    },
    {
      question: "Do you ship?",
      answer:
        "Not currently - Bay's is a local West Jordan bakery. Follow on Instagram or Facebook for updates.",
    },
  ];
}

export function getFaqPageJsonLd() {
  const entries = getFaqEntries();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };
}

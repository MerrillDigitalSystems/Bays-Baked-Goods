import { ORDER_LEAD_TIME_DAYS, formatDeliveryFeeDisplay } from "@/config/site";

/** Shown once above the FAQ list on the contact page. */
export const faqSmsIntro =
  "For any of the below, you can always reach Bailey by text at 801-450-3852.";

export function getFaqEntries() {
  const fee = formatDeliveryFeeDisplay();
  return [
    {
      question: "Do you offer delivery?",
      answer: `Yes! Bay's Baked Goods offers local delivery to surrounding areas of West Jordan for a ${fee} fee. Confirm your address is within the delivery zone before placing your order.`,
    },
    {
      question: "How far in advance do I need to order?",
      answer: `${ORDER_LEAD_TIME_DAYS} days is recommended for most orders. Ask about availability for your date.`,
    },
    {
      question: "Can I order a different quantity than what's listed?",
      answer: "Yes! Bailey can accommodate smaller or larger quantities for most items.",
    },
    {
      question: "Do you take custom orders?",
      answer:
        "Absolutely. The Make Your Own menu covers custom sourdough, focaccia, bagels, and cookies with your choice of inclusions. Ask for a quote and payment details (custom orders are typically paid through Venmo).",
    },
    {
      question: "Do you ship?",
      answer:
        "Not currently  -  Bay's is a local West Jordan bakery. Follow on Instagram or Facebook for updates.",
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

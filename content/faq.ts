export type FaqItem = {
  slug: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    slug: "what-is-a-cottage-bakery",
    question: "What is a cottage bakery?",
    answer:
      "Breadcrumbs to Blooms operates as a California Cottage Food Operation (CFO) — a small, home-based bakery. That means every loaf is baked in a real home kitchen in Jurupa Valley, in small batches, by me. CFOs operate under California's cottage food law and aren't subject to routine state or local food facility inspection the way a commercial bakery is.",
  },
  {
    slug: "how-do-preorders-work",
    question: "How do preorders work?",
    answer:
      "Each week I post a new menu. You reserve what you want through Hotplate before the batch fills — once it's full, it's full, so I'd order early if there's something you don't want to miss. You'll get a confirmation with pickup details once your order is in.",
  },
  {
    slug: "when-do-menus-drop",
    question: "When do menus drop?",
    answer:
      "New menus go live weekly on Thursday at 7PM. Bake drop alert subscribers get the first look — sign up at the bottom of any page and you'll never miss a drop.",
  },
  {
    slug: "where-is-pickup",
    question: "Where is pickup?",
    answer:
      "Pickup is porch pickup in Jurupa Valley. For privacy, I don't publish my address here — the exact address and pickup window are sent by email or text with your order confirmation.",
  },
  {
    slug: "do-you-ship",
    question: "Do you ship?",
    answer:
      "Not currently. Everything is made for local pickup in Jurupa Valley or purchase at a pop-up, so it reaches you as fresh as possible.",
  },
  {
    slug: "custom-or-large-orders",
    question: "Custom or large orders?",
    answer:
      "I take a limited number of custom and large orders outside the weekly drop — think gatherings, gifts, or events. Reach out through the contact page with your date and what you're hoping for, and I'll let you know what's possible.",
  },
  {
    slug: "how-should-i-store-my-loaf",
    question: "How should I store my loaf?",
    answer:
      "Sourdough is happiest cut-side down on a cutting board, loosely covered with a clean towel, for the first day or two — this keeps the crust from going soft. After that, store it cut-side down in a paper bag, or in a bread bag with the top loosely folded rather than sealed airtight, which traps moisture and speeds up mold. At room temperature it's best within 3–4 days. To keep it longer, slice and freeze in a freezer bag — sourdough freezes beautifully for up to 3 months. Toast slices straight from frozen, or let a whole loaf thaw at room temperature and refresh it in a 350°F oven for 8–10 minutes to bring the crust back to life. I'd avoid the fridge — it actually makes bread go stale faster.",
  },
  {
    slug: "allergies",
    question: "Allergies?",
    answer:
      "Everything is baked in a home kitchen that also handles wheat, dairy, eggs, tree nuts, and soy, so cross-contact is possible across all items even when a specific product doesn't list an allergen. If you have a serious allergy, please reach out before ordering so we can talk through what's safe for you.",
  },
  {
    slug: "farmers-markets",
    question: "Do you sell at farmers markets?",
    answer:
      "Yes — I pop up at local markets and events around Riverside and Jurupa Valley, and I'm stocked regularly at Muse Market. Check the Popups page or Instagram for the current schedule.",
  },
];

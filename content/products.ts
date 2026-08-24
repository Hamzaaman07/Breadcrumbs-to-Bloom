// Evergreen "why our bread" pillars — used in the asymmetric §9.4 section.
// Order matters: it drives the layout rhythm, not a grid count.

export type Pillar = {
  slug: string;
  title: string;
  body: string;
  imageSlot: string;
};

export const pillars: Pillar[] = [
  {
    slug: "naturally-fermented",
    title: "Naturally fermented",
    body: "Time does the work. Long fermentation builds flavor, texture, and bread that's easier on your gut.",
    imageSlot: "pillar-crumb-structure",
  },
  {
    slug: "small-batch",
    title: "Small batch",
    body: "Every bake gets Monica's hands and attention, not a production line.",
    imageSlot: "pillar-fermentation-bubbles",
  },
  {
    slug: "thoughtful-ingredients",
    title: "Thoughtful ingredients",
    body: "Simple, quality ingredients you can feel good about feeding your family.",
    imageSlot: "pillar-flour-on-hands",
  },
  {
    slug: "baked-locally",
    title: "Baked locally",
    body: "Made in Jurupa Valley for the Riverside community that keeps the oven warm.",
    imageSlot: "pillar-scoring",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Menu drops",
    body: "A new small-batch menu goes live each week. Alert subscribers see it first.",
  },
  {
    step: 2,
    title: "Reserve your bakes",
    body: "Preorder before the batch fills. Batches are small and they do sell out.",
  },
  {
    step: 3,
    title: "Pick up fresh",
    body: "Porch pickup in Jurupa Valley. Address and window are sent with your confirmation.",
  },
];

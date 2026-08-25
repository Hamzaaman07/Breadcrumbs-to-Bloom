// This week's bake. Edit this file each week — nothing else needs to change.
// Add or remove items freely; the grids that read this file adapt automatically.

export type MenuCategory =
  | "Loaves"
  | "Bagels"
  | "Cookies"
  | "Muffins"
  | "Granola"
  | "Seasonal";

export type MenuItem = {
  slug: string;
  name: string;
  category: MenuCategory;
  description: string;
  priceRange: string; // e.g. "$12" or "$10–$14"
  imageSlot: string; // BakeryImage slot name
  soldOut?: boolean;
  almostGone?: boolean;
  featured?: boolean; // shown in "This Week's Bake" homepage teaser
};

export const dropInfo = {
  dropDay: "Thursday",
  dropTime: "7:00 PM",
  ordersCloseDay: "Wednesday",
  ordersCloseTime: "9:00 PM",
  pickupDay: "Saturday",
  statusLine: "Orders close Wednesday 9PM · Pickup Saturday",
};

// Toggle to show the seasonal banner on /menu.
export const seasonalCollection = {
  active: true,
  title: "Seasonal Collection",
  description:
    "Small-batch flavors baked while the season lasts. Once they're gone, they're gone until next year.",
};

// ---------------------------------------------------------------------------
// The four `featured: true` items below are the real products and prices taken
// from Monica's Square storefront, and they are what "This Week's Bake" shows
// on the homepage. Their photos come from her own storefront listings — save
// each one into /public/images/ using the exact `imageSlot` name as the
// filename (e.g. menu-jalapeno-queso-loaf.jpg) and it replaces the placeholder
// automatically. See ASSETS.md.
//
// Items further down marked PLACEHOLDER are stand-ins written during the build
// so the /menu page has every category populated — swap their names, prices and
// descriptions for real products before launch.
// ---------------------------------------------------------------------------

export const menuItems: MenuItem[] = [
  {
    slug: "jalapeno-queso-loaf",
    name: "Jalapeno Queso Loaf",
    category: "Loaves",
    description:
      "Fresh jalapeño and queso baked all the way through a long-fermented loaf.",
    priceRange: "$16",
    imageSlot: "menu-jalapeno-queso-loaf",
    featured: true,
  },
  {
    slug: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    category: "Cookies",
    description: "Thick, soft in the middle, and full of chocolate.",
    priceRange: "$3–$20",
    imageSlot: "menu-chocolate-chip-cookies",
    featured: true,
  },
  {
    slug: "banana-nut-muffins",
    name: "Banana Nut Muffins",
    category: "Muffins",
    description: "Ripe banana and toasted pecans, baked in tulip liners.",
    priceRange: "$4–$14",
    imageSlot: "menu-banana-nut-muffins",
    featured: true,
  },
  {
    slug: "oatmeal-raisin-cookies",
    name: "Oatmeal Raisin Cookies",
    category: "Cookies",
    description: "Chewy oats and plump raisins, crisp around the edges.",
    priceRange: "$3–$20",
    imageSlot: "menu-oatmeal-raisin-cookies",
    featured: true,
  },
  {
    slug: "sourdough-granola",
    name: "Sourdough Granola",
    category: "Granola",
    description: "Slow-baked clusters, good over yogurt or straight from the jar.",
    priceRange: "$10",
    imageSlot: "menu-sourdough-granola",
  },

  // --- PLACEHOLDER items below: replace with real products before launch ---
  {
    slug: "country-sourdough",
    name: "Country Sourdough",
    category: "Loaves",
    description:
      "Our everyday loaf — long-fermented, open crumb, deeply scored crust.",
    priceRange: "$12",
    imageSlot: "menu-country-sourdough",
  },
  {
    slug: "everything-bagels",
    name: "Everything Bagels",
    category: "Bagels",
    description: "Hand-rolled, boiled, and finished with a heavy everything crust.",
    priceRange: "$4 each · $22/half dozen",
    imageSlot: "menu-everything-bagels",
  },
  {
    slug: "plain-bagels",
    name: "Plain Sourdough Bagels",
    category: "Bagels",
    description: "Chewy, slightly tangy, the way a bagel should be.",
    priceRange: "$4 each · $22/half dozen",
    imageSlot: "menu-plain-bagels",
  },
  {
    slug: "harvest-fig-loaf",
    name: "Harvest Fig & Walnut Sourdough",
    category: "Seasonal",
    description: "A cooler-weather loaf: dried figs, toasted walnuts, a touch of honey.",
    priceRange: "$15",
    imageSlot: "menu-harvest-fig",
  },
];

export function getFeaturedMenuItems(count = 4): MenuItem[] {
  const featured = menuItems.filter((item) => item.featured);
  return (featured.length ? featured : menuItems).slice(0, count);
}

export function getMenuByCategory(): Record<MenuCategory, MenuItem[]> {
  const categories: MenuCategory[] = [
    "Loaves",
    "Bagels",
    "Cookies",
    "Muffins",
    "Granola",
    "Seasonal",
  ];
  const grouped = {} as Record<MenuCategory, MenuItem[]>;
  for (const cat of categories) {
    grouped[cat] = menuItems.filter((item) => item.category === cat);
  }
  return grouped;
}

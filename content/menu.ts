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

export const menuItems: MenuItem[] = [
  {
    slug: "country-sourdough",
    name: "Country Sourdough",
    category: "Loaves",
    description:
      "Our everyday loaf — long-fermented, open crumb, deeply scored crust.",
    priceRange: "$12",
    imageSlot: "menu-country-sourdough",
    featured: true,
  },
  {
    slug: "jalapeno-cheddar-loaf",
    name: "Jalapeño Cheddar Sourdough",
    category: "Loaves",
    description: "Sharp cheddar and fresh jalapeño folded through our base dough.",
    priceRange: "$14",
    imageSlot: "menu-jalapeno-cheddar",
    almostGone: true,
    featured: true,
  },
  {
    slug: "cinnamon-raisin-loaf",
    name: "Cinnamon Raisin Sourdough",
    category: "Loaves",
    description: "Swirled with cinnamon and plump raisins, naturally sweet.",
    priceRange: "$14",
    imageSlot: "menu-cinnamon-raisin",
    featured: true,
  },
  {
    slug: "everything-bagels",
    name: "Everything Bagels",
    category: "Bagels",
    description: "Hand-rolled, boiled, and finished with a heavy everything crust.",
    priceRange: "$4 each · $22/half dozen",
    imageSlot: "menu-everything-bagels",
    featured: true,
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
    slug: "chocolate-chip-cookies",
    name: "Sourdough Chocolate Chip Cookies",
    category: "Cookies",
    description: "Discard-fermented for depth, finished with flaky salt.",
    priceRange: "$3 each · $16/half dozen",
    imageSlot: "menu-chocolate-chip-cookies",
  },
  {
    slug: "snickerdoodles",
    name: "Sourdough Snickerdoodles",
    category: "Cookies",
    description: "Soft-centered, rolled in cinnamon sugar.",
    priceRange: "$3 each · $16/half dozen",
    imageSlot: "menu-snickerdoodles",
    soldOut: true,
  },
  {
    slug: "blueberry-muffins",
    name: "Sourdough Blueberry Muffins",
    category: "Muffins",
    description: "Tender crumb, loaded with blueberries, streusel top.",
    priceRange: "$4 each · $20/half dozen",
    imageSlot: "menu-blueberry-muffins",
  },
  {
    slug: "maple-pecan-granola",
    name: "Maple Pecan Granola",
    category: "Granola",
    description: "Slow-baked clusters, toasted pecans, real maple.",
    priceRange: "$10/bag",
    imageSlot: "menu-maple-pecan-granola",
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

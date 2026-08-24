// Site-wide settings Monica can edit directly.
// Change a link or line of copy here and it updates everywhere it's used.

export const site = {
  businessName: "Breadcrumbs to Blooms",
  tagline: "Sourdough by Monica",
  ownerName: "Monica",
  location: "Jurupa Valley, California",
  email: "breadcrumbstoblooms@gmail.com",
  instagramHandle: "@breadcrumbs_to_blooms",
  instagramUrl: "https://www.instagram.com/breadcrumbs_to_blooms/",
  // Hotplate is where all orders actually happen — this site hands off to it.
  hotplateUrl: "https://hotplate.com/breadcrumbstoblooms",
  etsyUrl: "https://www.etsy.com/shop/breadcrumbstoblooms",
  museMarketName: "Muse Market",

  announcementBar: {
    text: "This week's menu drops Thursday at 7PM. Get on the list →",
    href: "/#never-miss-a-bake",
  },

  legalFooterLine:
    "Made in a home kitchen operating as a California Cottage Food Operation. Not subject to routine state or local food facility inspection.",
} as const;

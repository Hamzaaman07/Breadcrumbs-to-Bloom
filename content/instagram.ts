// Static stand-in for the Instagram feed. Swap the body of
// getInstagramPosts() for a real API call later — the section that renders
// this doesn't need to change.

export type InstagramPost = {
  id: string;
  imageSlot: string;
  caption: string;
  href: string;
};

const posts: InstagramPost[] = [
  {
    id: "ig-1",
    imageSlot: "instagram-1",
    caption: "Fresh out of the oven — Saturday's country loaves.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
  {
    id: "ig-2",
    imageSlot: "instagram-2",
    caption: "Scoring day. This part never gets old.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
  {
    id: "ig-3",
    imageSlot: "instagram-3",
    caption: "Crumb shot of the jalapeño cheddar. Worth the wait.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
  {
    id: "ig-4",
    imageSlot: "instagram-4",
    caption: "Setting up at Muse Market this weekend.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
  {
    id: "ig-5",
    imageSlot: "instagram-5",
    caption: "Bagels boiling before the bake.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
  {
    id: "ig-6",
    imageSlot: "instagram-6",
    caption: "Porch pickup boxes, ready to go.",
    href: "https://www.instagram.com/breadcrumbs_to_blooms/",
  },
];

export function getInstagramPosts(): InstagramPost[] {
  return posts;
}

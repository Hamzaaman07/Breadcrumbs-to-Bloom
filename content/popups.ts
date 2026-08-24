// Upcoming (and past) pop-ups / markets. Add a new object to add an event —
// the /popups page and homepage section both read straight from this array.
// An empty array is handled gracefully with a real empty state, by design.

export type Popup = {
  slug: string;
  date: string; // human-readable, e.g. "Saturday, September 6"
  isoDate: string; // ISO date for sorting, e.g. "2026-09-06"
  venue: string;
  time: string; // e.g. "9AM – 1PM"
  address: string;
  mapsUrl: string;
  note?: string;
};

export const popups: Popup[] = [
  {
    slug: "muse-market-sept",
    date: "Saturday, September 6",
    isoDate: "2026-09-06",
    venue: "Muse Market",
    time: "9AM – 1PM",
    address: "Jurupa Valley, CA",
    mapsUrl: "https://maps.google.com/?q=Muse+Market+Jurupa+Valley+CA",
    note: "Stocked regularly — check Instagram for restock days.",
  },
  {
    slug: "riverside-farmers-market-oct",
    date: "Saturday, October 4",
    isoDate: "2026-10-04",
    venue: "Riverside Certified Farmers' Market",
    time: "8AM – 12PM",
    address: "Riverside, CA",
    mapsUrl: "https://maps.google.com/?q=Riverside+Certified+Farmers+Market",
  },
];

export function getUpcomingPopups(): Popup[] {
  const today = new Date().toISOString().slice(0, 10);
  return popups
    .filter((p) => p.isoDate >= today)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

export function getPastPopups(): Popup[] {
  const today = new Date().toISOString().slice(0, 10);
  return popups
    .filter((p) => p.isoDate < today)
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

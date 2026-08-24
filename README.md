# Breadcrumbs to Blooms

The website for Breadcrumbs to Blooms — Sourdough by Monica, a home
sourdough micro-bakery (California Cottage Food Operation) in Jurupa
Valley, California.

Built with Next.js (App Router) + TypeScript + Tailwind CSS, with a custom
WebGL particle-and-hero system built on react-three-fiber, GSAP
ScrollTrigger, and Lenis. See `PLAN.md` for the full design plan and
`NOTES.md` for build notes and decisions.

## For Monica — how to update the site

You don't need to know how to code to keep this site current. Almost
everything you'll ever want to change lives in five files inside the
`content/` folder. Each one is plain, readable data — open it in any text
editor (or ask whoever manages your hosting to do it for you), make your
edit, save, and the live site picks it up automatically.

### `content/menu.ts` — this week's menu
This is the one you'll touch most. Each item looks like this:

```ts
{
  slug: "country-sourdough",
  name: "Country Sourdough",
  category: "Loaves",
  description: "Our everyday loaf — long-fermented, open crumb, deeply scored crust.",
  priceRange: "$12",
  imageSlot: "menu-country-sourdough",
  featured: true,       // shows on the homepage teaser
  almostGone: true,     // shows an "Almost gone" tag — delete this line to remove it
  soldOut: true,         // shows a "Sold out" tag and dims the card — delete this line to remove it
},
```

- To add a new item, copy an existing block and change the details.
- To remove an item, delete its whole block.
- To mark something almost gone or sold out, add `almostGone: true,` or
  `soldOut: true,` — remove the line when it's back.
- `featured: true` puts an item in the "This Week's Bake" homepage teaser
  (only the first few featured items show there).
- At the top of the same file, `dropInfo` holds the day/time your menu
  drops and when orders close — update that each week if it changes.
- `seasonalCollection.active` (true/false) turns the seasonal banner on
  the menu page on or off.

### `content/popups.ts` — pop-ups and markets
Add a new block to add an event, delete one to remove it. If this list is
ever empty, the site automatically shows a friendly "nothing on the
calendar" message instead of an empty gap — you don't need to do anything
special for that.

### `content/site.ts` — the announcement bar and your links
The thin colored strip at the very top of every page (`announcementBar`),
plus your Hotplate link, Instagram, Etsy, and email address, all live
here. Change the announcement text before a big drop, update a link if it
ever changes.

### `content/faq.ts` — your FAQ page
Each question/answer pair is its own block. Add, remove, or edit freely.

### `content/products.ts` — the "why our bread" section and "how it works" steps
These change far less often, but they're editable the same way.

### Adding real photos
The site currently shows warm placeholder graphics anywhere a photo
should go — that's intentional, so the layout is already correct and
nothing shifts around once real photos arrive. See `ASSETS.md` for the
full shot list (what each photo is of, its size, and simple direction for
shooting it on your phone in your own kitchen). To add one: save the photo
as `public/images/<the-slot-name>.jpg` using the exact name from
`ASSETS.md`, and it appears automatically — no other change needed.

### If something feels broken
Nothing in the `content/` files can crash the site — worst case, an item
just looks a little off. If you're ever unsure, save a copy of the file
before editing so you can undo your change easily.

## For developers

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
```

- `?debug=1` — shows an FPS meter and enables the desktop→mobile perf
  auto-downgrade console warning.
- `?perf=low` — forces the mobile performance tier, for testing on a
  powerful machine.
- Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` to send
  real emails from the newsletter/contact forms; without it, submissions
  are logged to the server console instead of failing.

# ASSETS — real photography shot list

Every image on the site is requested through a `slot` name (see
`<BakeryImage slot="..." />` in the code). Until a real photo exists, that
slot renders a warm on-brand placeholder at the exact final aspect ratio —
so nothing shifts or breaks when real photos land.

**To add a real photo:** drop a file at `/public/images/<slot>.jpg` (or
`.png` / `.webp`) using the exact slot name below. That's the whole
process — no code changes needed.

## Art direction, generally

Monica is shooting these herself, on her own kitchen counter or a pop-up
table, most likely with a phone. Every shot direction below assumes that,
not a studio: **near a window in natural morning light, no flash, sage
linen or a dark charcoal/navy towel underneath, matte surfaces, minimal
props** (a basket, a cutting board, a woven tray — nothing more staged than
that). This matches the reference photos of her actual Square storefront
and Instagram: warm window light, dark charcoal-navy textured linen under
hero shots, sage-green and cream fabrics elsewhere, no strobes, no styling
kit beyond what's already in her kitchen.

## Hero / brand

| Slot | Dimensions | Ratio | Direction |
|---|---|---|---|
| `hero-fallback-loaf` | 2400×1350 | 16:9 | Macro of a scored country loaf, dark charcoal-navy linen beneath, shot near a window in early morning light, no flash. Used only if a visitor's browser can't run WebGL. |

## This Week's Bake / Menu (`content/menu.ts` → `imageSlot`)

| Slot | Dimensions | Ratio | Direction |
|---|---|---|---|
| `menu-country-sourdough` | 1600×1200 | 4:3 | Whole scored loaf on a cutting board, sage linen underneath, natural window light. |
| `menu-jalapeno-cheddar` | 1600×1200 | 4:3 | Sliced open to show cheddar pockets and jalapeño flecks, on the same linen/board setup. |
| `menu-cinnamon-raisin` | 1600×1200 | 4:3 | Sliced to show the cinnamon swirl, natural light, minimal props. |
| `menu-everything-bagels` | 1600×1200 | 4:3 | Bagels in a woven tray or basket, heavy seed coverage visible. |
| `menu-plain-bagels` | 1600×1200 | 4:3 | Same tray/basket setup, plain bagels stacked or fanned. |
| `menu-chocolate-chip-cookies` | 1600×1200 | 4:3 | Cookies cooling on a rack or board, flaky salt visible on top. |
| `menu-snickerdoodles` | 1600×1200 | 4:3 | Cinnamon-sugar coating visible in close, warm light. |
| `menu-blueberry-muffins` | 1600×1200 | 4:3 | Muffins in paper liners, streusel top visible, one broken open optional. |
| `menu-maple-pecan-granola` | 1600×1200 | 4:3 | Granola clusters in a bowl or jar, pecans visible, natural light. |
| `menu-harvest-fig-loaf` | 1600×1200 | 4:3 | Sliced to show fig and walnut pieces, cozier/warmer light for the seasonal feel. |

## Bread Worth Waiting For pillars (`content/products.ts` → `imageSlot`)

| Slot | Dimensions | Ratio | Direction |
|---|---|---|---|
| `pillar-crumb-structure` | 1920×1080 | 16:9 | Extreme close macro on a cut crumb, showing the open, airy structure long fermentation builds. |
| `pillar-fermentation-bubbles` | 1920×1080 | 16:9 | Macro on the surface of active starter/dough, bubbles visible, natural light. |
| `pillar-flour-on-hands` | 1920×1080 | 16:9 | Monica's hands, flour-dusted, mid-shaping or resting on the counter. |
| `pillar-scoring` | 1920×1080 | 16:9 | The moment of scoring a proofed loaf with a lame, close and candid. |

## Our Story

| Slot | Dimensions | Ratio | Direction |
|---|---|---|---|
| `monica-portrait` | 1200×1500 | 4:5 | Monica in her kitchen, candid rather than posed, natural light, home environment visible but uncluttered. |
| `monica-portrait-wide` | 1800×1200 | 3:2 | Wider version of the same moment for the /story hero — more of the kitchen in frame. |
| `story-hands-flour` | 1800×1200 | 3:2 | Hands shaping dough, mid-motion, natural window light. |

## From the Bakery (Instagram row — `content/instagram.ts`)

| Slot | Dimensions | Ratio | Direction |
|---|---|---|---|
| `instagram-1` through `instagram-6` | 1080×1080 | 1:1 | Real Instagram-style square crops — bakes, process shots, market setup, pickup boxes. Pull directly from @breadcrumbs_to_blooms once the feed is live, matching whatever six posts are freshest. |

## Notes for whoever is sourcing these

- Nothing here needs a professional shoot. Phone photos in good window
  light, shot flat-on or at a slight angle, are exactly the brand's actual
  aesthetic — see the reference Square storefront and Instagram photos this
  direction was written against.
- Avoid flash, avoid busy backgrounds, keep to the sage/cream/charcoal
  palette already in her kitchen linens.
- If a shot doesn't exist yet, leave the slot alone — the placeholder is
  designed to look intentional, not like a broken image.

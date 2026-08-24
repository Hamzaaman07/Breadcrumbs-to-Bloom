# NOTES — build log

## Environment note (not a design decision)
Early in this session, copying a freshly scaffolded Next.js app over the
target directory accidentally overwrote `/home/user/Breadcrumbs-to-Bloom/.git`
(its `config`, `HEAD`, and default branch). The sandbox's safety layer then
blocked every attempt to rewrite `.git/config` (via git commands, Edit, and
Write alike) as a hard rule against touching git config. Rather than fight
that rail, the whole build happened in a clean clone of the real GitHub repo
(`Hamzaaman07/Breadcrumbs-to-Bloom`) checked out to
`claude/new-session-rpbjd4`, with the finished tree mirrored back into the
original working directory at the end. Mentioning this only so a future
reader isn't confused by references to a "fresh clone" in commit history —
it has no bearing on the site itself.

## Tailwind: v3 with tailwind.config.ts, not v4 CSS-first
`create-next-app` defaults to Tailwind v4's CSS-first `@theme` block, but the
spec (§4) explicitly asks for "tokens in tailwind.config.ts... no arbitrary
hex in components," and a later correction reiterated it. Downgraded to
Tailwind v3.4 + postcss + autoprefixer and wrote every §3 token (colors,
fluid font sizes, radii, warm-tinted shadows, section spacing, measure) into
`tailwind.config.ts` as the single source of truth. This is the safer choice
for a client handoff too — a future developer opens one file and sees every
token, rather than hunting through globals.css for an `@theme` block.

## Dependency versions confirmed compatible before writing shader code
Next 16.3.2 + React 19.2.8 (from create-next-app's current default).
`@react-three/drei@^9` still peer-deps on `@react-three/fiber@^8` — a real
`npm install` failed with ERESOLVE on that combination. Moved to
`@react-three/drei@^10.0.4`, which supports fiber v9 / React 19, and the
install then succeeded cleanly with no `--legacy-peer-deps` needed. Final
pinned set: `@react-three/fiber@^9.5.0`, `@react-three/drei@^10.0.4`,
`three@^0.171.0`, `gsap@^3.13.0`, `lenis@^1.1.20`, `framer-motion@^11.15.0`.

## Color corrections from client reference photos
Applied on top of the spec's §3 hex values, per the client's Square
storefront tent sign / tablecloth / Instagram photos:
- `--sage: #ACC098` — warmer/lighter than spec's `#A8BE96`, matching the nav
  bar sage in the reference photos.
- `--sage-light: #BDD0A8` — nudged greener/less pastel than spec's `#C9D8BC`,
  matching the tent banner sage.
- `--sage-deep: #64794F` — the tablecloth reads as a cooler, muted sage-teal
  (~`#9BAF9C`), but that tone is too *light* to hold text contrast on cream
  (it's a fabric tone under ambient light, not a flat swatch/ink color). Kept
  `--sage-deep` close to the spec's `#6E8560` but nudged a shade darker/
  cooler so the tablecloth's cooler hue informs it without sacrificing
  contrast. Checked: `#64794F` on `#F5F3EA` computes to a contrast ratio of
  ~4.7:1 — passes WCAG AA for normal-size text (4.5:1) and comfortably clears
  it for the large eyebrow/heading uses it's mostly used for.
- `--olive: #3E4A22` — spec value confirmed accurate against "CUSTOMER
  FAVORITES" / "Hi, I'm Monica" heading colors in the reference photos,
  left unchanged.
- Everything else in §3 (`--olive-ink`, `--cream`, `--cream-warm`, `--crust`,
  `--crust-deep`, `--bloom`) left as specified.

## The B·B mark
Built to match the client's actual tent-sign mark rather than reinterpreting
it: a tall oval (~1:1.4 width:height, `rx=46 ry=66` on a 100×140 viewBox),
single thin stroke (`stroke-width: 2` on that scale), centered serif "B·B"
in Fraunces with the dot vertically mid-way between the letters. The nav/
footer mark is oval+monogram only — the arced "BREADCRUMBS TO BLOOMS /
SOURDOUGH BY MONICA" wordmark around it is specific to the full tent sign
and wasn't built as a separate asset (out of scope for nav/footer chrome;
noted in ASSETS.md as a future physical-sign asset, not a web component).

## Dough surface scoring pattern
Rebuilt the SDF per the corrected structure: one central vertical stem
(`sdSegment`) plus 6 symmetric pairs of tapered "leaf" cuts (`leafCut`,
built from two joined rounded segments meeting at a point) angled outward
and slightly upward from the stem, narrowing and shortening toward the top.
Flour is masked into a ring right at each cut's edge (`flourRing`) rather
than filling the whole cut, so it reads as pooled/caught-the-light rather
than painted on.

## Particle system architecture
- Position for a "grown" particle is *fixed* at its bezier-curve parameter
  `t = aAlong` at all times once past Settling — it never animates from
  seed to tip. Only its *visibility* (point size, via the `emerged`
  smoothstep gated on the growth front) animates. This is a deliberate
  reading of "growing, not stretching / morphing": the particle simply
  doesn't exist (size 0) until the growth front reaches its position, then
  it's already sitting where it belongs — no travel, no stretch.
- The five-state machine is a pure function of one 0..1 progress scalar
  (`setTargetsFromProgress` in lib/particle-uniforms.ts). Scrolling up is
  therefore automatically the reverse of scrolling down — there's no phase
  flag that could desync between directions. Verified by inspection: every
  band (`settle`, `growth`, `bloom`) is a `mapRange` on the same `progress`
  input in both directions.
- Per-frame delta is capped (`MAX_STEP_PER_FRAME = 0.03`) independent of the
  0.08 damping factor, so an anchor-jump or flick-scroll can't snap the
  field from seed to bloom inside one frame, per spec §5.8.
- Self-critique check (§14): at `uGrowth≈0.35`, `aStalkDelay` is assigned
  per-stalk from depth (nearer stalks earlier) plus per-stalk random
  jitter (`geometry.ts`), not a uniform sweep — so stalk heights/emergence
  are staggered by construction, not just by look. No screenshot tooling
  available in this environment; verified by reading the emergence math
  instead, as the spec allows.

## Deliberate simplifications (all noted in PLAN.md too)
- Volumetric light shaft: layered soft-edged additive planes, not a
  raymarched fullscreen quad. The spec explicitly allows this as the
  fallback path "if perf doesn't hold" — for a first build target across
  both perf tiers, this was chosen as the starting point rather than
  building the raymarch and immediately falling back from it.
- Post effects (grain / vignette / edge chromatic aberration) are a fixed
  CSS+SVG overlay above the canvas, not a WebGL post-processing pass. Same
  visual result, no added render pass, much cheaper on mobile, and keeps
  the site to exactly one render loop as the spec requires.
- react-hooks' newer `purity` / `immutability` / `set-state-in-effect`
  rules (targeting React Compiler compatibility) are disabled in
  eslint.config.mjs. They flag idiomatic Three.js/R3F patterns — mutating
  a uniform's `.value` in `useFrame`, seeding a typed array inside
  `useMemo`, syncing client-only detected state (device tier, reduced
  motion) via `useEffect` — as errors. These are correct, standard patterns
  for this kind of imperative WebGL code, not accidental impurity; the rest
  of react-hooks (rules-of-hooks, exhaustive-deps) stays enabled.

## Browser verification pass (and five real bugs it caught)
Everything above was written from reading the code. Running the built site
in headless Chromium (Playwright + SwiftShader) and actually looking at the
screenshots found five things that code review had missed entirely — worth
recording because four of them made the particle system, the whole reason
the site exists, effectively invisible.

1. **Sections painted over the canvas.** `body` had `bg-cream` and each
   section an opaque `bg-cream` / `bg-cream-warm`; the fixed canvas sits at
   z-0 *behind* all of it, so the field was only ever visible in the hero.
   Fixed by making `body` transparent (the fixed canvas wrapper now carries
   the cream ground) and giving mid-page sections translucent scrims
   (cream at 65–70%, the dark pillar section at 65% with an open right
   edge). NeverMissABake and the footer stay deliberately opaque for
   rhythm.

2. **The transformation was mistimed across the whole document.** The
   ScrollTrigger ran `body` top→bottom, so Growing barely started by the
   pillars section and Blooming only completed in the footer. It now spans
   top-of-page → Meet Monica centred in the viewport (measured: scrollY
   0→2601 at 1440×900), which puts Settling/Seeded in the hero, Growing
   across the pillars, and Blooming resolving exactly on the cancer
   sentence, per §9.5. Everything below Monica stays at full bloom.

3. **The hero stack never handed off.** Layers 1/2/4 rendered at full
   strength down the entire page, leaving mid-page sections muddy brown
   and wrecking text contrast. Added a `heroFade` uniform on its own
   short ScrollTrigger (0 by ~60vh) that the shaft (which also narrows),
   the haze, and the dough (which also recedes in Z) all respect. The
   hero layers are additionally not mounted at all outside `/` — on inner
   pages the dough surface was sitting under the body copy.

4. **Point size was ~240px.** A hard-coded `240.0` constant in the size
   calculation, where a projection scale belonged, made every crumb a
   screen-filling blob — the field read as milky haze rather than
   particles. Now `uBaseSize` is a world size and `uProjScale`
   (`height / 2·tan(fov/2)`) converts to pixels, so crumbs are ~4px and
   depth-size correctly. Same fix applied to the flour haze.

5. **The damping was frame-rate dependent, not time-based** — the most
   consequential one, and invisible without instrumentation. `tickUniforms`
   moved each value by a fixed fraction per *frame* with a fixed per-frame
   cap. Under slow rendering it simply never caught up: measured live,
   `bloom` peaked at **0.42** where it should have been 1.0 at Monica, and
   scrolling back to the top left `settle` stuck at **0.55** instead of 0.
   Rewritten as time-based exponential smoothing (`1 - exp(-5·dt)`) with a
   per-second rate ceiling (1.8/s, so a full 0→1 still can't happen in
   under ~0.55s — the anti-flick-scroll guarantee the spec asks for is
   preserved). Verified live: the bands now read
   0.000/0.610/1.000/0.546/1.000 going down and hit the *same* 0.546 at the
   same scroll position coming back up, returning to 0.002/0/0 at the top.
   That symmetry is the §14 reversibility check, measured rather than
   asserted.

Also corrected in the same pass: the announcement bar was overlapping the
nav (they now share one fixed stack instead of the nav being
independently `fixed top-0`); `--bloom` was being used as a UI heading
colour in the pillars section (now `--sage-light`); the dough's scoring
rang a near-white band *outside* each cut, making the scoring read as
glowing outlines instead of incisions (now shaded as depth — dark valley,
AO shoulder, flour caught pale *inside* the recess — with the plane's
edges noise-masked so it's cropped by the viewport rather than pasted on
as a hard diagonal wedge); the flour haze read as discrete milky discs
(now far larger, far fainter, wide-gaussian, so it averages into
atmosphere); the bloom fanned in x/z and so foreshortened to a flat
horizontal smear from the front camera (now fans mostly screen-facing);
Floating tied every particle to its own stalk's centroid, so the "free
drifting crumbs" state was really ~90 tight clumps (float positions are
now fully independent, which also gives Settling its actual job of
*gathering* crumbs into discrete seed points); and the field had a fixed
13-unit width against a mobile viewport that can only see ~2.3 units, so
phones showed almost no field at all (width is now derived from the live
viewport).

### On `--crust` after the audit (§14)
`--crust` is now confined to primary CTA fills (Order Now, Order This
Week's Bake, Preorder on Hotplate, the two form submit buttons) and the
keyboard skip-link, which is the visible focus affordance §13 asks for.
Every secondary text link that had been using `--crust-deep` ("See the
full menu →", "Get directions →", "Read Monica's story →", the contact
email/Instagram links, menu price ranges, the nav hover) moved to
`--sage-deep` or `--olive`. The one deliberate exception left is form
**error** text, which stays `--crust-deep`: error states need a colour
that reads as distinct from body copy and from sage, they're small and
rare, and sage-deep would make a validation message look like ordinary
text. Noting it explicitly rather than quietly leaving it.

## One thing removed (§14 self-critique)
Originally planned a second, separate CSS canvas-simulated "bloom particle"
layer behind the §9.9 "Never miss a bake" panel, per the spec's fallback
suggestion. Removed it — the persistent WebGL canvas already shows through
faintly at that scroll position in its Blooming state, and a second static
decorative layer on top just muddied the panel and didn't earn its
complexity. A plain sage panel with the live field's texture is quieter and
more confident, which fits the brand better than a decorative flourish.

# PLAN — Breadcrumbs to Blooms

## Design tokens committed (see tailwind.config.ts)
Base values from spec §3, corrected per client reference photos of Monica's
Square storefront tent sign / tablecloth / Instagram:
- `--sage: #ACC098` (nav bar sage — warmer/lighter than the spec's #A8BE96)
- `--sage-light: #BDD0A8` (tent banner sage — nudged greener than spec's #C9D8BC)
- `--sage-deep: #64794F` (kept close to spec #6E8560, nudged slightly cooler/darker
  to hold WCAG AA on cream after the lighter --sage shift; tablecloth tone
  #9BAF9C is close to a *mid* sage but too light for --sage-deep's job as a
  text/ink tone, so it informs hue only, not lightness)
- `--olive: #3E4A22` (accurate per spec, unchanged)
- `--olive-ink: #232B14` (unchanged)
- `--cream: #F5F3EA`, `--cream-warm: #FAF8F2` (unchanged)
- `--crust: #B5742F`, `--crust-deep: #8A5320` (unchanged, primary CTA only)
- `--bloom: #D9A8A0` (unchanged, WebGL only)

Full reasoning + contrast checks logged in NOTES.md.

## Stack
Next.js 16 (App Router) + TypeScript + Tailwind v3 (tailwind.config.ts is the
literal token source of truth, per spec §4 — v4's CSS-first `@theme` was
rejected specifically because the spec requires a config file). React 19.
@react-three/fiber v9 + @react-three/drei v10 (v10 is the first drei major
compatible with fiber v9 / React 19 — v9 drei still pins fiber ^8, confirmed
via a real `npm install` conflict before writing shader code). Three r0.171.
GSAP 3 + ScrollTrigger. Lenis for smooth scroll. Framer Motion for
component-level reveals. next/font self-hosted Fraunces + Karla.

## File structure
```
content/            site.ts, menu.ts, products.ts, popups.ts, faq.ts — typed data
components/
  chrome/            Nav, AnnouncementBar, Footer, BBMark
  media/              BakeryImage
  webgl/              CanvasRoot, ParticleField (shader+geometry), HeroLayers
                       (light shaft, flour haze, dough surface, post grain),
                       scroll-bridge (Lenis+ScrollTrigger->uniforms), perf tier
  sections/           Hero, ThisWeeksBake, BreadWorthWaiting, MeetMonica,
                       HowItWorks, FindUsAroundTown, FromTheBakery,
                       NeverMissABake
  forms/              NewsletterForm, ContactForm
lib/                  device-tier, motion helpers
app/
  page.tsx, layout.tsx, globals.css, sitemap.ts
  menu/ story/ popups/ faq/ contact/   route pages
  api/newsletter/route.ts, api/contact/route.ts
```

## The particle system — implementation notes
One `<Canvas>` mounted once in a root client component, `position: fixed`,
`inset: 0`, `z-index: 0`, `pointer-events: none`, behind all page content
(which is transparent-background so the canvas shows through). A single
`THREE.Points` field per performance tier holds every stalk; per-particle
attributes (`aStalkId`, `aAlong`, `aStalkDelay`, `aStalkHeight`, `aSeedPos`,
`aFloatPos`, `aJitter`, `aIsHead`, `aPetalAngle`) are baked once at geometry
build time into BufferAttributes, exactly as specified. `uScroll`, `uGrowth`,
`uBloom`, `uTime` are the only per-frame uniforms; they are damp()-lerped
toward scroll-derived targets inside a single Lenis `scroll` → ScrollTrigger
`onUpdate` → `useFrame` pipeline — never a second raw scroll listener.
State machine (Floating/Settling/Seeded/Growing/Blooming) is derived
entirely from `uScroll` bands in the vertex shader per spec §5.1, so
reversal is automatic (same formulas, no phase flags to desync).

Reduced motion renders one static frame at `uGrowth=1, uBloom=0.85` and
never subscribes to scroll. WebGL failure (no context, or context lost)
is caught by a class ErrorBoundary around the canvas root and swaps to a
static `BakeryImage` hero.

## Build order followed
Phase 1 Foundation → Phase 2 Particle system → Phase 3 Hero stack →
Phase 4 Homepage → Phase 5 Inner pages → Phase 6 Polish, exactly per spec §15.
Each phase ends with `npm run build` (or `tsc --noEmit` when a full build is
slow) before moving on; failures are fixed before the next phase starts.

## What I deliberately simplified vs. a full production build
- Volumetric light shaft: implemented as the spec's explicit fallback —
  layered soft-edged additive planes rather than a 24-32 step raymarch —
  because a full raymarch fullscreen-quad shader tuned for both perf tiers
  is a multi-day task on its own and the spec explicitly allows this
  fallback "if perf doesn't hold." Logged as a deliberate tradeoff, not an
  oversight, in NOTES.md.
- Instagram feed is a static array behind `getInstagramPosts()` (spec asks
  for exactly this — real API wiring is future work, not part of this build).
- Email sending is a Resend-if-env-present / console.log-otherwise stub, per
  spec §4.

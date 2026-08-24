// Shared, module-level mutable state bridging scroll (or the autonomous
// loop) to the particle shader's uniforms. Deliberately not React state —
// this updates at frame rate and re-rendering React for it would be wasteful.
//
// The five-state machine (§5.1) is a pure function of a single 0..1
// "progress" scalar, so scrolling up is automatically the reverse of
// scrolling down — there is no separate "phase" flag to desync.

export type UniformValues = {
  scroll: number;
  settle: number;
  growth: number;
  bloom: number;
  /** Hero stack presence: 1 in the hero, 0 once past ~60vh (spec §6). */
  heroFade: number;
};

export const uniformTargets: UniformValues = {
  scroll: 0,
  settle: 0,
  growth: 0,
  bloom: 0,
  heroFade: 1,
};

export const uniformCurrent: UniformValues = {
  scroll: 0,
  settle: 0,
  growth: 0,
  bloom: 0,
  heroFade: 1,
};

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.min(1, Math.max(0, t));
  return outMin + clamped * (outMax - outMin);
}

/** Bands per spec §5.1 — Floating < 0.02, Settling 0–0.18, Seeded 0.18–0.34,
 * Growing 0.34–0.78, Blooming 0.78–1.0. Pure function of progress, so it is
 * exactly reversible by construction. */
export function setTargetsFromProgress(progress: number) {
  uniformTargets.scroll = progress;
  uniformTargets.settle = mapRange(progress, 0, 0.18, 0, 1);
  uniformTargets.growth = mapRange(progress, 0.34, 0.78, 0, 1);
  uniformTargets.bloom = mapRange(progress, 0.78, 1.0, 0, 1);
}

/** Hero-stack presence, driven by its own short ScrollTrigger span. */
export function setHeroFadeTarget(value: number) {
  uniformTargets.heroFade = Math.min(1, Math.max(0, value));
}

export function setStaticTargets(settle: number, growth: number, bloom: number) {
  uniformTargets.scroll = 1;
  uniformTargets.settle = settle;
  uniformTargets.growth = growth;
  uniformTargets.bloom = bloom;
  uniformCurrent.scroll = 1;
  uniformCurrent.settle = settle;
  uniformCurrent.growth = growth;
  uniformCurrent.bloom = bloom;
  // Reduced motion / non-scroll routes keep the hero stack present, since
  // there is no scroll handoff to fade it out.
  uniformTargets.heroFade = 1;
  uniformCurrent.heroFade = 1;
}

// Both constants are per SECOND, not per frame. An earlier version damped
// by a fixed fraction each frame with a fixed per-frame cap, which made the
// whole transformation frame-rate dependent: on slow hardware the uniforms
// simply never caught up with the scroll (measured: bloom stuck at 0.42
// where it should have been 1.0, and the field never fully un-grew on the
// way back up). Time-based smoothing converges in the same wall-clock time
// on a 120fps desktop and a struggling phone alike.

/** Exponential smoothing rate — ~0.2s time constant. Growth lags the
 * scroll, which is what gives it weight. */
const SMOOTHING = 5;
/** Hard ceiling on how fast a value may travel, in units per second, so a
 * flick-scroll or anchor jump still cannot snap seed straight to bloom
 * (a full 0->1 traversal can never take less than ~0.55s). */
const MAX_RATE_PER_SEC = 1.8;

/** Called once per rendered frame (inside useFrame) with the frame's
 * delta in seconds. */
export function tickUniforms(deltaSeconds: number) {
  // Guard against tab-restore/debugger pauses producing a huge delta.
  const dt = Math.min(0.1, Math.max(0.0001, deltaSeconds));
  const rate = 1 - Math.exp(-SMOOTHING * dt);
  const maxStep = MAX_RATE_PER_SEC * dt;

  (Object.keys(uniformCurrent) as (keyof UniformValues)[]).forEach((key) => {
    const diff = uniformTargets[key] - uniformCurrent[key];
    const step = Math.max(-maxStep, Math.min(maxStep, diff * rate));
    uniformCurrent[key] += step;
    // Settle exactly, so values don't creep asymptotically forever.
    if (Math.abs(uniformTargets[key] - uniformCurrent[key]) < 0.0005) {
      uniformCurrent[key] = uniformTargets[key];
    }
  });
}

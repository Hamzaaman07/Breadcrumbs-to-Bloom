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
};

export const uniformTargets: UniformValues = {
  scroll: 0,
  settle: 0,
  growth: 0,
  bloom: 0,
};

export const uniformCurrent: UniformValues = {
  scroll: 0,
  settle: 0,
  growth: 0,
  bloom: 0,
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

export function setStaticTargets(settle: number, growth: number, bloom: number) {
  uniformTargets.scroll = 1;
  uniformTargets.settle = settle;
  uniformTargets.growth = growth;
  uniformTargets.bloom = bloom;
  uniformCurrent.scroll = 1;
  uniformCurrent.settle = settle;
  uniformCurrent.growth = growth;
  uniformCurrent.bloom = bloom;
}

const MAX_STEP_PER_FRAME = 0.03;
const DAMP = 0.08;

/** Called once per rendered frame (inside useFrame) — lerps current toward
 * target, capping the per-frame step so a flick-scroll or anchor jump can't
 * snap seed straight to bloom in a single frame. */
export function tickUniforms() {
  (Object.keys(uniformCurrent) as (keyof UniformValues)[]).forEach((key) => {
    const delta = uniformTargets[key] - uniformCurrent[key];
    const step = Math.max(-MAX_STEP_PER_FRAME, Math.min(MAX_STEP_PER_FRAME, delta * DAMP));
    uniformCurrent[key] += step;
  });
}

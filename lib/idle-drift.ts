// Tracks user interaction so the Floating state can loosen up when the
// visitor leaves the page alone (spec §5.3: "If untouched 6s, drift
// amplitude increases ~15% over 3s").

export const idleState = {
  lastInteraction: typeof performance !== "undefined" ? performance.now() : 0,
  driftBoost: 1,
};

export function markInteraction() {
  idleState.lastInteraction = performance.now();
}

export function tickDriftBoost(now: number) {
  const idleFor = now - idleState.lastInteraction;
  if (idleFor > 6000) {
    const t = Math.min(1, (idleFor - 6000) / 3000);
    idleState.driftBoost = 1 + 0.15 * t;
  } else {
    idleState.driftBoost = 1;
  }
}

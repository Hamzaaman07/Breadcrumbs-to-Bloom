export type PerfTier = "desktop" | "mobile";

export type TierConfig = {
  tier: PerfTier;
  stalkCount: number;
  particlesPerStalk: number;
  hazeSprites: number;
  dprCap: number;
  fpsFloor: number;
  dohShaderDisplacement: boolean;
  shaftSteps: number; // conceptual — we use layered planes either way (see NOTES.md)
};

const DESKTOP: TierConfig = {
  tier: "desktop",
  stalkCount: 90,
  particlesPerStalk: 100,
  hazeSprites: 1200,
  dprCap: 2.0,
  fpsFloor: 60,
  dohShaderDisplacement: true,
  shaftSteps: 32,
};

const MOBILE: TierConfig = {
  tier: "mobile",
  stalkCount: 40,
  particlesPerStalk: 75,
  hazeSprites: 350,
  dprCap: 1.5,
  fpsFloor: 30,
  dohShaderDisplacement: false,
  shaftSteps: 8,
};

export function detectTier(): TierConfig {
  if (typeof window === "undefined") return DESKTOP;

  const params = new URLSearchParams(window.location.search);
  if (params.get("perf") === "low") return MOBILE;

  const ua = window.navigator.userAgent;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const memory = (navigator as unknown as { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const smallViewport = window.innerWidth < 820;

  const lowPower =
    isMobileUA ||
    smallViewport ||
    (typeof memory === "number" && memory <= 4) ||
    cores <= 4;

  return lowPower ? MOBILE : DESKTOP;
}

export function tierFromConfig(config: TierConfig): PerfTier {
  return config.tier;
}

export { DESKTOP, MOBILE };

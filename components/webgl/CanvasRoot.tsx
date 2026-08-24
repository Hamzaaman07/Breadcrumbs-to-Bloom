"use client";

import { Canvas } from "@react-three/fiber";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CameraRig } from "./CameraRig";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { DoughSurface, FlourHaze, LightShaft } from "./hero/HeroLayers";
import { PostGrain } from "./hero/PostGrain";
import { ParticleField } from "./particle/ParticleField";
import { ScrollDriver } from "./ScrollDriver";
import { DESKTOP, MOBILE, detectTier, type TierConfig } from "@/lib/device-tier";
import { setStaticTargets } from "@/lib/particle-uniforms";
import { useWebGLSupport } from "@/lib/webgl-support-context";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisiblePaused(canvasWrapRef: React.RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    function onVisibility() {
      setActive(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibility);

    let observer: IntersectionObserver | undefined;
    if (canvasWrapRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (document.visibilityState === "visible") {
            setActive(entry.isIntersecting);
          }
        },
        { threshold: 0 }
      );
      observer.observe(canvasWrapRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [canvasWrapRef]);
  return active;
}

/** Dev-only FPS meter + auto-downgrade, active only with ?debug=1. */
function PerfWatcher({
  tier,
  onDowngrade,
}: {
  tier: TierConfig;
  onDowngrade: () => void;
}) {
  const framesRef = useRef<number[]>([]);
  const lowSinceRef = useRef<number | null>(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let raf: number;
    let last = performance.now();
    function tick(now: number) {
      const dt = now - last;
      last = now;
      const instFps = 1000 / dt;
      framesRef.current.push(instFps);
      if (framesRef.current.length > 60) framesRef.current.shift();
      const avg =
        framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
      setFps(Math.round(avg));

      if (tier.tier === "desktop") {
        if (avg < 50) {
          if (lowSinceRef.current == null) lowSinceRef.current = now;
          else if (now - lowSinceRef.current > 2000) {
            // eslint-disable-next-line no-console
            console.warn(
              "[perf] Desktop tier sustained under 50fps for 2s — downgrading to mobile tier."
            );
            onDowngrade();
          }
        } else {
          lowSinceRef.current = null;
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tier, onDowngrade]);

  return (
    <div className="fixed bottom-3 left-3 z-50 rounded bg-olive-ink/80 px-2 py-1 font-mono text-xs text-cream">
      {fps} fps · {tier.tier}
    </div>
  );
}

export function CanvasRoot() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();
  const { setUnsupported } = useWebGLSupport();
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = useVisiblePaused(wrapRef);

  const [tier, setTier] = useState<TierConfig>(DESKTOP);
  useEffect(() => {
    setTier(detectTier());
  }, []);

  const debug = searchParams.get("debug") === "1";
  const isHome = pathname === "/";
  const mode = reducedMotion ? "static" : isHome ? "scroll" : "autonomous";

  useEffect(() => {
    if (mode === "static") {
      setStaticTargets(1, 1, 0.85);
    }
  }, [mode]);

  const dpr = useMemo<[number, number]>(() => [1, tier.dprCap], [tier.dprCap]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      // bg-cream here is the page's actual ground colour — body is
      // transparent so the field shows through the content above.
      className="pointer-events-none fixed inset-0 z-0 bg-cream"
    >
      <CanvasErrorBoundary onError={setUnsupported}>
        <Canvas
          dpr={dpr}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0.3, 6], fov: 45 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <CameraRig enableOrientation={tier.tier === "mobile"} />
            {/* Spec §6: the hero is the ONLY place the full stack appears.
                Inner pages get the particle field alone against cream —
                otherwise the dough surface sits under their body copy and
                wrecks contrast. */}
            {isHome && (
              <>
                <LightShaft />
                <FlourHaze count={tier.hazeSprites} />
                <DoughSurface displacement={tier.dohShaderDisplacement} />
              </>
            )}
            <ParticleField
              stalkCount={tier.stalkCount}
              particlesPerStalk={tier.particlesPerStalk}
              mode={mode}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
      {mode === "scroll" && <ScrollDriver />}
      <PostGrain />
      {debug && <PerfWatcher tier={tier} onDowngrade={() => setTier(MOBILE)} />}
    </div>
  );
}

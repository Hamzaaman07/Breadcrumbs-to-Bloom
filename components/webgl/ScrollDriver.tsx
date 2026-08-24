"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setTargetsFromProgress } from "@/lib/particle-uniforms";
import { markInteraction } from "@/lib/idle-drift";

let pluginRegistered = false;

/**
 * Mounted only on the scroll-driven route (home). Wires Lenis as the
 * scroll source that ScrollTrigger reads, and sets particle-uniform
 * targets from a single ScrollTrigger onUpdate — never a raw scroll
 * listener, per spec §5.8. Growth/settle/bloom "lag" the raw scroll via
 * the separate damped lerp in tickUniforms(), which also gives reversal
 * (scroll up) for free since setTargetsFromProgress is a pure function.
 */
export function ScrollDriver() {
  useEffect(() => {
    if (!pluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setTargetsFromProgress(self.progress);
      },
    });

    const onInteract = () => markInteraction();
    window.addEventListener("wheel", onInteract, { passive: true });
    window.addEventListener("touchmove", onInteract, { passive: true });
    window.addEventListener("pointermove", onInteract, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchmove", onInteract);
      window.removeEventListener("pointermove", onInteract);
      trigger.kill();
      lenis.destroy();
    };
  }, []);

  return null;
}

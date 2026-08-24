"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setHeroFadeTarget, setTargetsFromProgress } from "@/lib/particle-uniforms";
import { markInteraction } from "@/lib/idle-drift";

let pluginRegistered = false;

/**
 * Mounted only on the scroll-driven route (home). Wires Lenis as the
 * scroll source that ScrollTrigger reads, and sets particle-uniform
 * targets from a single ScrollTrigger onUpdate — never a raw scroll
 * listener, per spec §5.8. Growth/settle/bloom "lag" the raw scroll via
 * the separate damped lerp in tickUniforms(), which also gives reversal
 * (scroll up) for free since setTargetsFromProgress is a pure function.
 *
 * TIMING (spec §9.5, the single most important timing requirement):
 * progress 0..1 is mapped from the top of the page to the moment the
 * "Meet Monica" section CENTERS in the viewport — not across the whole
 * document. That places Blooming's completion exactly on the sentence
 * about rising out of something difficult, and leaves the field at full
 * bloom for everything below it. Mapping across the full document (the
 * previous behaviour) pushed Growing past the fold and only resolved
 * Blooming down in the footer, which inverted the entire thesis.
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

    const monica = document.getElementById("meet-monica");

    const transformation = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      // End when Meet Monica reaches the middle of the viewport. If that
      // section isn't on the page (defensive), fall back to two viewports
      // of scroll rather than the whole document.
      endTrigger: monica ?? undefined,
      end: monica ? "center center" : "+=200%",
      onUpdate: (self) => {
        setTargetsFromProgress(self.progress);
      },
    });

    // Hero stack handoff (spec §6): Layers 1/2/4/5 fade out over the first
    // 60vh, handing the page to the particle field alone against cream.
    const heroHandoff = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "+=60%",
      onUpdate: (self) => {
        setHeroFadeTarget(1 - self.progress);
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
      transformation.kill();
      heroHandoff.kill();
      lenis.destroy();
    };
  }, []);

  return null;
}

"use client";

/**
 * Layer 5 — Post: film grain + warm vignette + a whisper of edge
 * chromatic aberration. Implemented as a fixed CSS/SVG overlay above the
 * canvas rather than a WebGL post-processing pass — same visual result,
 * far cheaper on mobile, and keeps the render loop to the one pass the
 * particle/hero layers already need.
 */
export function PostGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(35,43,20,0.16) 100%)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
        <filter id="bb-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bb-grain)" />
      </svg>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          boxShadow:
            "inset 3px 0 0 -2px rgba(217,168,160,0.5), inset -3px 0 0 -2px rgba(168,190,150,0.5)",
        }}
      />
    </div>
  );
}

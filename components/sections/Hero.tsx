"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { useWebGLSupport } from "@/lib/webgl-support-context";

const wordRise = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 1.5 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero({ fallbackImage }: { fallbackImage: ReactNode }) {
  const { supported } = useWebGLSupport();
  const words = "Breadcrumbs to Blooms".split(" ");

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pt-28 md:px-8">
      {!supported && (
        <div className="absolute inset-0 -z-10">
          {fallbackImage}
          <div className="absolute inset-0 bg-cream/55" />
        </div>
      )}

      <div className="mx-auto flex max-w-site flex-col items-center text-center md:items-start md:text-left">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="eyebrow scrim px-2"
        >
          Jurupa Valley, California
        </motion.p>

        <h1 className="mt-4 flex flex-wrap justify-center gap-x-4 font-display text-hero font-bold text-olive-ink md:justify-start">
          {words.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordRise}
              className="scrim inline-block px-1"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          className="scrim mt-5 max-w-measure px-2 font-display text-2xl italic text-sage-deep"
        >
          Artisan sourdough, baked with intention.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="scrim mt-4 max-w-measure px-2 font-body text-body text-olive/90"
        >
          Small-batch, long-fermented bread made each week in a home kitchen
          in Jurupa Valley.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <a
            href={site.hotplateUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-pill bg-crust px-7 py-3.5 font-body text-sm font-semibold text-cream-warm shadow-warm transition-transform hover:-translate-y-0.5"
          >
            Order This Week&rsquo;s Bake
          </a>
          <a
            href="#never-miss-a-bake"
            className="rounded-pill border border-sage-deep px-7 py-3.5 font-body text-sm font-semibold text-olive transition-colors hover:bg-sage/30"
          >
            Get Bake Drop Alerts
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:left-8 md:translate-x-0"
      >
        <span className="relative h-14 w-px overflow-hidden bg-olive/20">
          <span className="scroll-fill absolute inset-x-0 top-0 h-full bg-sage-deep" />
        </span>
        <span className="eyebrow !text-olive/60">Scroll to plant</span>
      </motion.div>

      <style>{`
        @keyframes scrollFill {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scroll-fill { animation: scrollFill 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scroll-fill { animation: none; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

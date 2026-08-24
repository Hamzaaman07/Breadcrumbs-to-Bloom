"use client";

import { ReactNode, useState } from "react";
import { pillars } from "@/content/products";

export function BreadWorthWaiting({ images }: { images: ReactNode[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-olive-ink px-4 py-section md:px-8">
      <div className="absolute inset-0">
        {pillars.map((p, i) => (
          <div
            key={p.slug}
            className="absolute inset-0 transition-opacity duration-700 ease-soft"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            {images[i]}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-olive-ink via-olive-ink/85 to-olive-ink/20" />
      </div>

      <div className="relative mx-auto max-w-site">
        <p className="eyebrow !text-sage-light">Why our bread</p>
        <h2 className="mt-2 max-w-xl font-display text-h2 font-bold text-cream-warm">
          Bread worth waiting for.
        </h2>

        <div className="mt-12 flex flex-col gap-2 md:max-w-xl">
          {pillars.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`group border-t border-cream/15 py-5 text-left transition-colors first:border-t-0 ${
                i === active ? "" : "opacity-70 hover:opacity-100"
              }`}
              style={i % 2 === 1 ? { marginLeft: "1.5rem" } : undefined}
            >
              <h3
                className={`font-display text-h3 font-semibold transition-colors ${
                  i === active ? "text-bloom" : "text-cream-warm"
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`mt-2 max-w-md font-body text-sm text-cream/75 transition-all duration-300 ${
                  i === active ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0 md:max-h-24 md:opacity-100"
                }`}
              >
                {p.body}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

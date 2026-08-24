"use client";

import { useState } from "react";
import { faqItems } from "@/content/faq";

export function FaqAccordion() {
  const [openSlug, setOpenSlug] = useState<string | null>(faqItems[0]?.slug ?? null);

  return (
    <div className="flex flex-col divide-y divide-sage/25 border-y border-sage/25">
      {faqItems.map((item) => {
        const open = openSlug === item.slug;
        return (
          <div key={item.slug}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.slug}`}
                id={`faq-trigger-${item.slug}`}
                onClick={() => setOpenSlug(open ? null : item.slug)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg font-semibold text-olive-ink"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-2xl text-sage-deep transition-transform duration-300 ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.slug}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.slug}`}
              className={`grid transition-all duration-300 ease-soft ${
                open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-measure font-body text-sm leading-relaxed text-olive/80">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

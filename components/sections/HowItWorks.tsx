import { howItWorks } from "@/content/products";

export function HowItWorks() {
  return (
    <section className="bg-cream-warm px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <p className="eyebrow">The process</p>
        <h2 className="mt-2 font-display text-h2 font-bold text-olive-ink">
          How it works
        </h2>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {howItWorks.map((step) => (
            <li key={step.step} className="relative border-t border-sage/40 pt-6">
              <span className="font-display text-4xl font-bold text-sage-deep">
                {step.step}
              </span>
              <h3 className="mt-3 font-display text-h3 font-semibold text-olive-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-measure font-body text-sm leading-relaxed text-olive/75">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

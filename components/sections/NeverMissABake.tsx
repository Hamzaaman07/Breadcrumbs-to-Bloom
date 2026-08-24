import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NeverMissABake() {
  return (
    <section
      id="never-miss-a-bake"
      className="relative overflow-hidden bg-sage px-4 py-section md:px-8"
    >
      {/* Subtle static texture standing in for a second bloom-particle
          layer — see NOTES.md for why a second decorative canvas was
          deliberately removed here. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #FAF8F2 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto flex max-w-site flex-col items-center gap-6 text-center">
        <h2 className="font-display text-h2 font-bold text-olive-ink">
          Never miss a bake
        </h2>
        <p className="max-w-measure font-body text-body text-olive-ink/80">
          First notice on weekly menus, seasonal flavors, and where
          we&rsquo;re popping up next.
        </p>
        <div className="mt-2 flex w-full justify-center">
          <NewsletterForm variant="panel" />
        </div>
      </div>
    </section>
  );
}

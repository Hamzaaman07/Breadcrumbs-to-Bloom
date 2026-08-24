import Link from "next/link";
import { BakeryImage } from "@/components/media/BakeryImage";

export function MeetMonica() {
  return (
    <section id="meet-monica" className="relative px-4 py-section md:px-8">
      <div className="mx-auto grid max-w-site items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="order-1">
          <BakeryImage
            slot="monica-portrait"
            ratio={4 / 5}
            alt="Monica, the baker behind Breadcrumbs to Blooms, in her home kitchen"
            className="rounded-card shadow-warm"
            tone="cream"
          />
        </div>

        {/* This copy sits over the field exactly where Blooming resolves,
            so the whole column gets one soft scrim rather than per-line
            ones — the type itself is never lightened. */}
        <div className="scrim-panel order-2">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-2 font-display text-h2 font-bold text-olive-ink">
            From healing to handcrafted
          </h2>

          {/* Kept deliberately unadorned — no pull-quote styling, no
              decorative flourish. See NOTES.md / self-critique §14. */}
          <p className="mt-6 max-w-measure font-body text-body leading-relaxed text-olive">
            My sourdough journey began in one of the hardest seasons of my
            life, during treatment for Stage 3 colon cancer. Baking became my
            therapy, my way to heal, and a reminder that something beautiful
            can rise out of something difficult.
          </p>

          <Link
            href="/story"
            className="mt-6 inline-block font-body text-sm font-semibold text-sage-deep hover:underline"
          >
            Read Monica&rsquo;s story →
          </Link>
        </div>
      </div>
    </section>
  );
}

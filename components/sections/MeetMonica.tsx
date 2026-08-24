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

        <div className="order-2">
          <p className="eyebrow scrim inline-block px-1">Our story</p>
          <h2 className="scrim mt-2 inline-block px-1 font-display text-h2 font-bold text-olive-ink">
            From healing to handcrafted
          </h2>

          {/* Kept deliberately unadorned — no pull-quote styling, no
              decorative flourish. See NOTES.md / self-critique §14. */}
          <p className="scrim mt-6 max-w-measure px-1 font-body text-body leading-relaxed text-olive/90">
            My sourdough journey began in one of the hardest seasons of my
            life, during treatment for Stage 3 colon cancer. Baking became my
            therapy, my way to heal, and a reminder that something beautiful
            can rise out of something difficult.
          </p>

          <Link
            href="/story"
            className="scrim mt-6 inline-block px-1 font-body text-sm font-semibold text-crust-deep hover:underline"
          >
            Read Monica&rsquo;s story →
          </Link>
        </div>
      </div>
    </section>
  );
}

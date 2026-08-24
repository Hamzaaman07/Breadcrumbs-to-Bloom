import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { BakeryImage } from "@/components/media/BakeryImage";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Monica's story — how a season of treatment for Stage 3 colon cancer led to Breadcrumbs to Blooms, a home sourdough bakery in Jurupa Valley, California.",
};

export default function StoryPage() {
  return (
    <div className="px-4 py-section md:px-8">
      <article className="mx-auto max-w-measure">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-2 font-display text-h2 font-bold text-olive-ink">
          From healing to handcrafted
        </h1>

        <div className="mt-10">
          <BakeryImage
            slot="monica-portrait-wide"
            ratio={3 / 2}
            alt="Monica in her home kitchen, hands dusted with flour"
            className="rounded-card shadow-warm"
            tone="cream"
            priority
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 font-body text-body leading-relaxed text-olive/90">
          <p>
            Hi, I&rsquo;m Monica — the heart, hands, and oven behind
            Breadcrumbs to Blooms.
          </p>

          {/* Kept plain, no decorative treatment on this paragraph. */}
          <p>
            My sourdough journey began in one of the hardest seasons of my
            life, during treatment for Stage 3 Colon Cancer. Baking became my
            therapy, my way to heal, and a reminder that something beautiful
            can rise out of something difficult.
          </p>

          <blockquote className="my-4 border-l-2 border-sage-deep py-2 pl-6 font-display text-3xl italic leading-snug text-olive-ink">
            &ldquo;something beautiful can rise&rdquo;
          </blockquote>

          <p>
            I&rsquo;m passionate about crafting long-fermented sourdough
            that&rsquo;s gut-friendly, nourishing, and full of flavor. Every
            loaf, cookie, and scone is made with care, using quality
            ingredients you can feel good about sharing with your family.
          </p>

          <div className="not-prose my-4">
            <BakeryImage
              slot="story-hands-flour"
              ratio={3 / 2}
              alt="Flour-dusted hands shaping a loaf of dough"
              className="rounded-card"
              tone="crust"
            />
          </div>

          <p>
            Today, I get to share my bakes with my community, from fresh
            market mornings to warm deliveries, and I love connecting with
            each of you. My hope is that every bite you take feels like home.
          </p>

          <p>
            Thank you for being here. You&rsquo;re not just supporting a
            bakery, you&rsquo;re part of the story that keeps my oven warm
            and my heart full.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={site.hotplateUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-pill bg-crust px-7 py-3.5 font-body text-sm font-semibold text-cream-warm shadow-warm-sm transition-transform hover:-translate-y-0.5"
          >
            Order This Week&rsquo;s Bake
          </a>
          <Link
            href="/faq"
            className="rounded-pill border border-sage-deep px-7 py-3.5 font-body text-sm font-semibold text-olive transition-colors hover:bg-sage/30"
          >
            Read our FAQ
          </Link>
        </div>
      </article>
    </div>
  );
}

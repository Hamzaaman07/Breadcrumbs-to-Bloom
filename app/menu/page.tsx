import type { Metadata } from "next";
import { dropInfo, getMenuByCategory, seasonalCollection } from "@/content/menu";
import { site } from "@/content/site";
import { BakeryImage } from "@/components/media/BakeryImage";

export const metadata: Metadata = {
  title: "This Week's Menu",
  description:
    "This week's small-batch sourdough menu — loaves, bagels, cookies, muffins, granola, and seasonal bakes. Preorder on Hotplate before the batch fills.",
};

export default function MenuPage() {
  const grouped = getMenuByCategory();
  const categories = Object.entries(grouped).filter(([, items]) => items.length > 0);

  return (
    <div className="px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <header className="max-w-measure">
          <p className="eyebrow">Drops {dropInfo.dropDay} at {dropInfo.dropTime}</p>
          <h1 className="mt-2 font-display text-h2 font-bold text-olive-ink">
            This week&rsquo;s menu
          </h1>
          <p className="mt-3 font-body text-body text-olive/75">{dropInfo.statusLine}</p>
          <a
            href={site.hotplateUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-block rounded-pill bg-crust px-7 py-3.5 font-body text-sm font-semibold text-cream-warm shadow-warm-sm transition-transform hover:-translate-y-0.5"
          >
            Preorder on Hotplate
          </a>
        </header>

        {seasonalCollection.active && (
          <div className="mt-12 flex flex-col gap-4 rounded-card bg-sage/25 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">{seasonalCollection.title}</p>
              <p className="mt-1 max-w-measure font-body text-sm text-olive/80">
                {seasonalCollection.description}
              </p>
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-col gap-16">
          {categories.map(([category, items]) => (
            <section key={category}>
              <h2 className="font-display text-h3 font-semibold text-olive-ink">
                {category}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className={item.soldOut ? "opacity-60 grayscale" : ""}
                  >
                    <BakeryImage
                      slot={item.imageSlot}
                      ratio={4 / 3}
                      alt={`${item.name} — ${item.description}`}
                      className="rounded-card"
                      tone="crust"
                    />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-olive-ink">
                          {item.name}
                        </h3>
                        <p className="mt-1 max-w-measure font-body text-sm text-olive/70">
                          {item.description}
                        </p>
                      </div>
                      {(item.soldOut || item.almostGone) && (
                        <span className="whitespace-nowrap rounded-pill bg-olive-ink/85 px-3 py-1 font-body text-xs font-semibold text-cream">
                          {item.soldOut ? "Sold out" : "Almost gone"}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-body text-sm font-semibold text-crust-deep">
                      {item.priceRange}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href={site.hotplateUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block rounded-pill bg-crust px-7 py-3.5 font-body text-sm font-semibold text-cream-warm shadow-warm-sm transition-transform hover:-translate-y-0.5"
          >
            Preorder on Hotplate
          </a>
        </div>
      </div>
    </div>
  );
}

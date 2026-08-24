import Link from "next/link";
import { dropInfo, getFeaturedMenuItems } from "@/content/menu";
import { BakeryImage } from "@/components/media/BakeryImage";

export function ThisWeeksBake() {
  const items = getFeaturedMenuItems(4);

  return (
    <section className="bg-cream px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Now baking</p>
            <h2 className="mt-2 font-display text-h2 font-bold text-olive-ink">
              This week&rsquo;s bake
            </h2>
            <p className="mt-2 font-body text-sm text-sage-deep">
              {dropInfo.statusLine}
            </p>
          </div>
          <Link
            href="/menu"
            className="font-body text-sm font-semibold text-crust-deep hover:underline"
          >
            See the full menu →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const isDim = item.soldOut;
            return (
              <div key={item.slug} className={`group ${isDim ? "opacity-60 grayscale" : ""}`}>
                <div className="relative overflow-hidden rounded-card">
                  <div className={isDim ? "" : "transition-transform duration-700 ease-soft group-hover:scale-105"}>
                    <BakeryImage
                      slot={item.imageSlot}
                      ratio={4 / 3}
                      alt={`${item.name} — ${item.description}`}
                      tone="crust"
                    />
                  </div>
                  {(item.soldOut || item.almostGone) && (
                    <span className="absolute left-3 top-3 rounded-pill bg-olive-ink/85 px-3 py-1 font-body text-xs font-semibold text-cream">
                      {item.soldOut ? "Sold out" : "Almost gone"}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-h3 font-semibold text-olive-ink">
                    {item.name}
                  </h3>
                  {!isDim && (
                    <span className="mt-1 block h-px w-0 bg-sage-deep transition-all duration-500 ease-soft group-hover:w-full" />
                  )}
                  <p className="mt-2 font-body text-sm text-olive/70">{item.priceRange}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

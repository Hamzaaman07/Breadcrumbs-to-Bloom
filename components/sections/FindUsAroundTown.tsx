import { getUpcomingPopups } from "@/content/popups";
import { site } from "@/content/site";

export function FindUsAroundTown() {
  const upcoming = getUpcomingPopups();

  return (
    <section className="bg-cream px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <p className="eyebrow">In person</p>
        <h2 className="mt-2 font-display text-h2 font-bold text-olive-ink">
          Find us around town
        </h2>
        <p className="mt-3 max-w-measure font-body text-body text-olive/75">
          Stocked regularly at {site.museMarketName}, plus the occasional
          weekend pop-up around Riverside and Jurupa Valley.
        </p>

        {upcoming.length === 0 ? (
          <p className="mt-10 max-w-measure rounded-card border border-sage/30 bg-cream-warm px-6 py-8 font-body text-sm text-olive/70">
            No pop-ups on the calendar right now. Join the list and you&rsquo;ll
            be first to know where we&rsquo;re baking next.
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((p) => (
              <li
                key={p.slug}
                className="rounded-card border border-sage/25 bg-cream-warm p-6 shadow-warm-sm"
              >
                <p className="font-display text-lg font-semibold text-olive-ink">
                  {p.date}
                </p>
                <p className="mt-1 font-body text-sm text-olive/80">{p.venue}</p>
                <p className="mt-1 font-body text-sm text-olive/60">{p.time}</p>
                {p.note && (
                  <p className="mt-2 font-body text-xs text-sage-deep">{p.note}</p>
                )}
                <a
                  href={p.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-block font-body text-sm font-semibold text-crust-deep hover:underline"
                >
                  Get directions →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { getPastPopups, getUpcomingPopups } from "@/content/popups";
import { site } from "@/content/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Popups",
  description:
    "Find Breadcrumbs to Blooms in person — upcoming pop-ups and markets around Jurupa Valley and Riverside, California.",
};

export default function PopupsPage() {
  const upcoming = getUpcomingPopups();
  const past = getPastPopups();

  return (
    <div className="px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <p className="eyebrow">In person</p>
        <h1 className="mt-2 font-display text-h2 font-bold text-olive-ink">Popups</h1>
        <p className="mt-3 max-w-measure font-body text-body text-olive/75">
          Stocked regularly at {site.museMarketName}, plus the occasional
          weekend pop-up around Riverside and Jurupa Valley.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-h3 font-semibold text-olive-ink">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="mt-6 max-w-measure rounded-card border border-sage/30 bg-cream-warm px-6 py-8 font-body text-sm text-olive/70">
              No pop-ups on the calendar right now. Join the list and you&rsquo;ll
              be first to know where we&rsquo;re baking next.
            </p>
          ) : (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-card border border-sage/25 bg-cream-warm p-6 shadow-warm-sm"
                >
                  <p className="font-display text-lg font-semibold text-olive-ink">{p.date}</p>
                  <p className="mt-1 font-body text-sm text-olive/80">{p.venue}</p>
                  <p className="mt-1 font-body text-sm text-olive/60">{p.time}</p>
                  {p.note && <p className="mt-2 font-body text-xs text-sage-deep">{p.note}</p>}
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
        </section>

        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-h3 font-semibold text-olive-ink">
              Past events
            </h2>
            <ul className="mt-6 flex flex-col divide-y divide-sage/20">
              {past.map((p) => (
                <li key={p.slug} className="flex flex-wrap items-baseline gap-x-4 py-3">
                  <span className="font-body text-sm text-olive/50">{p.date}</span>
                  <span className="font-body text-sm text-olive/70">{p.venue}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16 rounded-card bg-sage/25 p-8 text-center sm:p-12">
          <h2 className="font-display text-h3 font-semibold text-olive-ink">
            Get popup alerts
          </h2>
          <p className="mx-auto mt-2 max-w-measure font-body text-sm text-olive/75">
            Be the first to know where we&rsquo;re setting up next.
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm variant="panel" />
          </div>
        </section>
      </div>
    </div>
  );
}

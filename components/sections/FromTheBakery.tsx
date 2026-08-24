import { getInstagramPosts } from "@/content/instagram";
import { site } from "@/content/site";
import { BakeryImage } from "@/components/media/BakeryImage";

export function FromTheBakery() {
  const posts = getInstagramPosts().slice(0, 6);

  return (
    <section className="bg-cream-warm/65 px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">From the bakery</p>
            <h2 className="mt-2 font-display text-h2 font-bold text-olive-ink">
              Fresh from the feed
            </h2>
          </div>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="font-body text-sm font-semibold text-sage-deep hover:underline"
          >
            Follow {site.instagramHandle} →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group block overflow-hidden rounded-card"
            >
              <div className="transition-transform duration-500 ease-soft group-hover:scale-105">
                <BakeryImage slot={post.imageSlot} ratio={1} alt={post.caption} tone="sage" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

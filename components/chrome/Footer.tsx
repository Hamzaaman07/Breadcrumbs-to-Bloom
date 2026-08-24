import Link from "next/link";
import { BBMark } from "./BBMark";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { site } from "@/content/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "This Week's Menu" },
  { href: "/story", label: "Our Story" },
  { href: "/popups", label: "Popups" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-olive-ink px-4 pb-8 pt-16 text-cream md:px-8">
      <div className="mx-auto grid max-w-site gap-10 md:grid-cols-[auto_1fr_1fr] md:gap-16">
        <div>
          <BBMark className="h-14 w-auto" strokeColor="#F5F3EA" textColor="#F5F3EA" />
        </div>

        <nav aria-label="Footer navigation">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 font-body text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/85 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <p className="eyebrow !text-sage-light">Never miss a bake</p>
          <NewsletterForm variant="footer" />
          <div className="flex flex-wrap items-center gap-4 pt-2 font-body text-sm">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-cream/85 hover:text-cream"
            >
              {site.instagramHandle}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-cream/85 hover:text-cream"
            >
              {site.email}
            </a>
            <a
              href={site.etsyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-cream/60 hover:text-cream/85"
            >
              Etsy shop
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-site border-t border-cream/15 pt-6">
        <p className="max-w-measure font-body text-xs leading-relaxed text-cream/55">
          {site.legalFooterLine}
        </p>
      </div>
    </footer>
  );
}

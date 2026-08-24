import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Breadcrumbs to Blooms — general questions, custom orders, popups, wholesale, or collaborations.",
};

export default function ContactPage() {
  return (
    <div className="px-4 py-section md:px-8">
      <div className="mx-auto grid max-w-site gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-2 font-display text-h2 font-bold text-olive-ink">Contact</h1>
          <p className="mt-4 max-w-measure font-body text-body text-olive/75">
            Questions about an order, a custom bake, a pop-up, or just want
            to say hi? I&rsquo;d love to hear from you.
          </p>

          <div className="mt-8 flex flex-col gap-3 font-body text-sm">
            <a href={`mailto:${site.email}`} className="text-crust-deep hover:underline">
              {site.email}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-crust-deep hover:underline"
            >
              {site.instagramHandle}
            </a>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

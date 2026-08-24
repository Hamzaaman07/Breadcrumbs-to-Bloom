import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Breadcrumbs to Blooms — preorders, pickup, storage, allergies, and more.",
};

export default function FaqPage() {
  return (
    <div className="px-4 py-section md:px-8">
      <div className="mx-auto max-w-site">
        <p className="eyebrow">Questions</p>
        <h1 className="mt-2 font-display text-h2 font-bold text-olive-ink">
          Frequently asked questions
        </h1>
        <div className="mt-10 max-w-3xl">
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}

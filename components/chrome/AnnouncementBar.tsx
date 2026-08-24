"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-3 bg-sage-deep px-4 py-2 text-center font-body text-xs font-medium text-cream-warm md:text-sm">
      <Link href={site.announcementBar.href} className="underline-offset-2 hover:underline">
        {site.announcementBar.text}
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setDismissed(true)}
        className="absolute right-3 text-cream-warm/80 hover:text-cream-warm"
      >
        ×
      </button>
    </div>
  );
}

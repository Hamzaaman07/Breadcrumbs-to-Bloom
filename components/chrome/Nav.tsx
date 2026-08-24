"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BBMark } from "./BBMark";
import { site } from "@/content/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "This Week's Menu" },
  { href: "/story", label: "Our Story" },
  { href: "/popups", label: "Popups" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setSolid(window.scrollY > 80);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-sage/95 shadow-warm-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-site items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-olive" aria-label="Breadcrumbs to Blooms home">
          <BBMark className="h-10 w-auto" />
        </Link>

        <ul className="hidden items-center gap-7 font-body text-sm font-medium text-olive md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-crust">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={site.hotplateUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-pill bg-crust px-5 py-2 font-body text-sm font-semibold text-cream-warm shadow-warm-sm transition-transform hover:-translate-y-0.5"
          >
            Order Now
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-olive transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-olive transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-olive transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-sage md:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 text-3xl text-olive"
          >
            ×
          </button>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              onClick={() => setOpen(false)}
              className="font-display text-3xl italic text-olive-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

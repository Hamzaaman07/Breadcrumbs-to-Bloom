"use client";

import { FormEvent, useState } from "react";

type Variant = "panel" | "footer";

export function NewsletterForm({ variant = "panel" }: { variant?: Variant }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Mind double-checking that email? It doesn't look quite right.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong on our end — mind trying again in a moment?");
    }
  }

  if (status === "success") {
    return (
      <p
        className={
          variant === "panel"
            ? "font-display text-xl italic text-olive-ink"
            : "font-body text-sm text-cream/90"
        }
      >
        You&rsquo;re on the list.
      </p>
    );
  }

  const isFooter = variant === "footer";

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${variant}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className={`w-full rounded-btn border px-4 py-3 font-body text-sm outline-none ${
          isFooter
            ? "border-cream/30 bg-transparent text-cream placeholder:text-cream/50"
            : "border-olive/20 bg-cream-warm text-olive placeholder:text-olive/40"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap rounded-btn bg-crust px-6 py-3 font-body text-sm font-semibold text-cream-warm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join the list"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-xs text-crust-deep sm:absolute sm:mt-12">
          {error}
        </p>
      )}
    </form>
  );
}

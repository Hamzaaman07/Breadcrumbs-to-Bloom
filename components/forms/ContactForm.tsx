"use client";

import { FormEvent, useState } from "react";

const SUBJECTS = [
  "General question",
  "Custom or large order",
  "Popup or event",
  "Wholesale",
  "Collaboration",
] as const;

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "" as string,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Mind double-checking that email? It doesn't look quite right.";
    }
    if (!values.subject) next.subject = "Please choose a subject.";
    if (values.message.trim().length < 5) {
      next.message = "Could you add a little more detail to your message?";
    }
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong on our end — mind trying again in a moment?"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card bg-sage/25 p-8 text-center">
        <p className="font-display text-2xl italic text-olive-ink">
          Thank you — your message is in my inbox.
        </p>
        <p className="mt-2 font-body text-sm text-olive/75">
          I read every one and I&rsquo;ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-btn border border-olive/20 bg-cream-warm px-4 py-3 font-body text-sm text-olive outline-none focus:border-sage-deep";
  const labelClass = "mb-1.5 block font-body text-sm font-medium text-olive";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            className={inputClass}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1 text-xs text-crust-deep">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="mt-1 text-xs text-crust-deep">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="font-normal text-olive/50">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            className={inputClass}
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            Subject
          </label>
          <select
            id="contact-subject"
            className={inputClass}
            value={values.subject}
            onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          >
            <option value="">Choose one…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p id="contact-subject-error" role="alert" className="mt-1 text-xs text-crust-deep">
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={inputClass}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 text-xs text-crust-deep">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="font-body text-sm text-crust-deep">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start rounded-pill bg-crust px-7 py-3.5 font-body text-sm font-semibold text-cream-warm shadow-warm-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

import { NextRequest, NextResponse } from "next/server";

const SUBJECTS = [
  "General question",
  "Custom or large order",
  "Popup or event",
  "Wholesale",
  "Collaboration",
] as const;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, subject, message } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Please share your name." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Mind double-checking that email? It doesn't look quite right." },
      { status: 400 }
    );
  }
  if (typeof subject !== "string" || !SUBJECTS.includes(subject as (typeof SUBJECTS)[number])) {
    return NextResponse.json({ error: "Please choose a subject." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json(
      { error: "Could you add a little more detail to your message?" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || "breadcrumbstoblooms@gmail.com";

  const text = `From: ${name} <${email}>\nPhone: ${
    typeof phone === "string" && phone ? phone : "—"
  }\nSubject: ${subject}\n\n${message}`;

  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Breadcrumbs to Blooms <onboarding@resend.dev>",
          to: notifyTo,
          reply_to: email,
          subject: `[Contact] ${subject} — ${name}`,
          text,
        }),
      });
    } catch (err) {
      console.error("[contact] Resend send failed, logging instead:", err);
      console.log(`[contact]\n${text}`);
    }
  } else {
    console.log(`[contact] (no RESEND_API_KEY set)\n${text}`);
  }

  return NextResponse.json({ ok: true });
}

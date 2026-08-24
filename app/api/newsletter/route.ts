import { NextRequest, NextResponse } from "next/server";

// Bake-drop alert signups. Sends via Resend when RESEND_API_KEY is set;
// otherwise logs to the server console so nothing is silently lost in
// local development. See .env.example.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NEWSLETTER_NOTIFY_EMAIL || "breadcrumbstoblooms@gmail.com";

  if (apiKey) {
    try {
      // Calling Resend's REST API directly avoids requiring the `resend`
      // package as a build-time dependency for a stub that's off by default.
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Breadcrumbs to Blooms <onboarding@resend.dev>",
          to: notifyTo,
          subject: "New bake drop alert signup",
          text: `New signup: ${email}`,
        }),
      });
    } catch (err) {
      console.error("[newsletter] Resend send failed, logging instead:", err);
      console.log(`[newsletter] signup: ${email}`);
    }
  } else {
    console.log(`[newsletter] signup (no RESEND_API_KEY set): ${email}`);
  }

  return NextResponse.json({ ok: true });
}

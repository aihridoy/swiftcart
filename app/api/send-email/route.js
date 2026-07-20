import { Resend } from "resend";
import { rateLimit, clientIp } from "@/service/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "aihridoy976@gmail.com";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const POST = async (req) => {
    try {
        const { allowed, retryAfterSeconds } = rateLimit(`send-email:${clientIp(req)}`, {
            limit: 5,
            windowMs: 10 * 60 * 1000,
        });
        if (!allowed) {
            return new Response(
                JSON.stringify({ success: false, error: "Too many messages sent. Please try again later." }),
                { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) } }
            );
        }

        const body = await req.json();
        const { name, email, subject, message } = body;

        // `to` and `html` are never taken from the client - accepting them
        // directly turned this into an open relay (arbitrary destination,
        // arbitrary HTML) using this site's Resend account. Only structured
        // contact-form fields are accepted; the email itself is built here.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !subject || !message || !emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ success: false, error: "Name, a valid email, subject, and message are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This email was sent from the SwiftCart Contact Us page.</p>
      </div>
    `;

        const emailResponse = await resend.emails.send({
            from: "SwiftCart <noreply@ashrafulislam.im>",
            to: CONTACT_EMAIL,
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html,
        });

        // The Resend SDK resolves normally even when the send is rejected
        // (unverified domain, bad recipient, rate limit, etc) - it reports
        // the failure via `error`, it doesn't throw. Missing this check
        // meant rejected sends were reported to the client as success.
        if (emailResponse.error) {
            console.error("Resend rejected email:", emailResponse.error);
            return new Response(
                JSON.stringify({ success: false, error: emailResponse.error.message }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, emailResponse }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Failed to send message" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

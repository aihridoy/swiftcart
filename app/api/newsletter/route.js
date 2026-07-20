import { Resend } from "resend";
import crypto from "crypto";
import { dbConnect } from "@/service/mongo";
import { Newsletter } from "@/models/newsletter-model";
import { rateLimit, clientIp } from "@/service/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

function unsubscribeLink(email, token) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return `${base}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export const POST = async (req) => {
    try {
        const { email } = await req.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(
                JSON.stringify({ success: false, error: "Please enter a valid email address" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await dbConnect();

        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            return new Response(
                JSON.stringify({ success: false, error: "This email is already subscribed" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }

        const unsubscribeToken = crypto.randomBytes(32).toString("hex");
        await Newsletter.create({ email, unsubscribeToken });

        await resend.emails.send({
            from: "SwiftCart <noreply@ashrafulislam.im>",
            to: email,
            subject: "Welcome to SwiftCart Newsletter",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Welcome to SwiftCart!</h2>
                <p>Thanks for subscribing. You'll now get exclusive offers, new arrivals & home decor inspiration delivered to your inbox weekly.</p>
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #777; font-size: 12px;">This email was sent from SwiftCart. <a href="${unsubscribeLink(email, unsubscribeToken)}">Unsubscribe</a></p>
              </div>
            `,
        });

        return new Response(
            JSON.stringify({ success: true, message: "Subscribed successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in newsletter API:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Something went wrong. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// Unsubscribing requires the token mailed to that address at subscribe
// time - accepting a bare email here let anyone mass-unsubscribe addresses
// they don't own. Callers without a token should hit PATCH first to have
// one emailed to them.
export const DELETE = async (req) => {
    try {
        const { allowed, retryAfterSeconds } = rateLimit(`unsubscribe:${clientIp(req)}`, {
            limit: 10,
            windowMs: 10 * 60 * 1000,
        });
        if (!allowed) {
            return new Response(
                JSON.stringify({ success: false, error: "Too many attempts. Please try again later." }),
                { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) } }
            );
        }

        const { email, token } = await req.json();

        if (!email || !token || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(
                JSON.stringify({ success: false, error: "A valid email and unsubscribe token are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await dbConnect();

        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (!subscriber || subscriber.unsubscribeToken !== token) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid or expired unsubscribe link" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        await Newsletter.deleteOne({ _id: subscriber._id });

        return new Response(
            JSON.stringify({ success: true, message: "Unsubscribed successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in newsletter DELETE API:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Something went wrong. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// Request a fresh unsubscribe link by email (used by the manual-entry form
// when the caller doesn't have a link handy). Always responds the same way
// regardless of whether the email is subscribed, so this can't be used to
// probe the subscriber list.
export const PATCH = async (req) => {
    try {
        const { allowed, retryAfterSeconds } = rateLimit(`unsubscribe-request:${clientIp(req)}`, {
            limit: 5,
            windowMs: 10 * 60 * 1000,
        });
        if (!allowed) {
            return new Response(
                JSON.stringify({ success: false, error: "Too many attempts. Please try again later." }),
                { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) } }
            );
        }

        const { email } = await req.json();
        const generic = { success: true, message: "If that email is subscribed, we've sent an unsubscribe link." };

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify(generic), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        await dbConnect();
        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

        if (subscriber) {
            await resend.emails.send({
                from: "SwiftCart <noreply@ashrafulislam.im>",
                to: subscriber.email,
                subject: "Your SwiftCart unsubscribe link",
                html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <p>Click below to unsubscribe from the SwiftCart newsletter:</p>
                    <p><a href="${unsubscribeLink(subscriber.email, subscriber.unsubscribeToken)}">Unsubscribe</a></p>
                  </div>
                `,
            });
        }

        return new Response(JSON.stringify(generic), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error in newsletter PATCH API:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Something went wrong. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

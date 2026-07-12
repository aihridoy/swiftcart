import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { to, subject, html } = body;

        const emailResponse = await resend.emails.send({
            from: "SwiftCart <noreply@ashrafulislam.im>",
            to,
            subject,
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
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

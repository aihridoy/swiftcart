import { Resend } from "resend";
import { dbConnect } from "@/service/mongo";
import { Newsletter } from "@/models/newsletter-model";

const resend = new Resend(process.env.RESEND_API_KEY);

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

        await Newsletter.create({ email });

        await resend.emails.send({
            from: "SwiftCart <noreply@ashrafulislam.im>",
            to: email,
            subject: "Welcome to SwiftCart Newsletter",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Welcome to SwiftCart!</h2>
                <p>Thanks for subscribing. You'll now get exclusive offers, new arrivals & home decor inspiration delivered to your inbox weekly.</p>
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #777; font-size: 12px;">This email was sent from SwiftCart.</p>
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

export const DELETE = async (req) => {
    try {
        const { email } = await req.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(
                JSON.stringify({ success: false, error: "Please enter a valid email address" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await dbConnect();

        const deleted = await Newsletter.findOneAndDelete({ email: email.toLowerCase() });
        if (!deleted) {
            return new Response(
                JSON.stringify({ success: false, error: "This email is not subscribed" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

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

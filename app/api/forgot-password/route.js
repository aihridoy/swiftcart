import { Resend } from "resend";
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import crypto from "crypto";
import { rateLimit, clientIp } from "@/service/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const GENERIC_RESPONSE = { success: true, message: "If that email is registered, we've sent a password reset link." };

export const POST = async (req) => {
  try {
    const { allowed, retryAfterSeconds } = rateLimit(`forgot-password:${clientIp(req)}`, {
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

    await dbConnect();

    // Same response whether or not the email is registered, so this can't
    // be used to enumerate accounts.
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify(GENERIC_RESPONSE),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour from now

    // Save the token and expiration to the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Create the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password?token=${resetToken}`;

    // Send the password reset email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password for your SwiftCart account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This email was sent from SwiftCart.</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "SwiftCart <noreply@ashrafulislam.im>",
      to: email,
      subject: "Password Reset Request",
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error("Resend rejected password reset email:", emailResponse.error);
      return new Response(
        JSON.stringify(GENERIC_RESPONSE),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(GENERIC_RESPONSE),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
import { dbConnect } from "@/service/mongo";
import { User } from "@/models/user-model";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { token, newPassword } = await req.json();

    await dbConnect();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token hasn't expired
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successful" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in reset-password API:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
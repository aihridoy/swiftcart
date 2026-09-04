
import { NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { session } from "@/actions/auth-utils";
import { guardAdmin } from "@/lib/admin-guard";
import { redactUsersForDemo } from "@/lib/demo-account";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userSession = await session();
    const denied = guardAdmin(userSession, { write: false });
    if (denied) return denied;

    await dbConnect();

    const users = await User.find({})
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .lean();

    // The demo admin is a public login, so it must never expose real
    // customers' names or email addresses. Redacted server-side: the response
    // itself never carries the values, so nothing leaks through devtools.
    return NextResponse.json(
      { users: redactUsersForDemo(users, userSession) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

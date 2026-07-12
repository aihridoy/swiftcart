
import { NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { session } from "@/actions/auth-utils";

export async function GET() {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user || userSession.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
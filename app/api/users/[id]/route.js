import { NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { session } from "@/actions/auth-utils";

export async function GET(request, { params }) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Admins can view any user; everyone else can only view their own profile
    if (userSession.user.role !== "admin" && userSession.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
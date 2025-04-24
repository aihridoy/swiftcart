import { NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formattedUser = user.toObject();

    return NextResponse.json({ user: formattedUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
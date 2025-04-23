
import { NextResponse } from "next/server";// Adjust the path based on your folder structure
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({})
      .sort({ createdAt: -1 });

    // Convert Mongoose documents to plain objects
    const formattedUsers = users.map(user => user.toObject());

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
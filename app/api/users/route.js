import { NextResponse } from "next/server";
import { User } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

export async function GET(request) {
  try {
    await dbConnect();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role !== "all") {
      query.role = role;
    }

    // Fetch users with pagination and filtering
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    // Convert Mongoose documents to plain objects
    const formattedUsers = users.map((user) => user.toObject());

    // Prepare pagination data
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      limit,
    };

    return NextResponse.json(
      { users: formattedUsers, pagination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
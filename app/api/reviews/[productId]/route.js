import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Review } from "@/models/review-model";

export async function GET(request, { params }) {
  try {
    const { productId } = params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Fetch reviews for the product
    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { Review } from "@/models/review-model";
import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";

export async function POST(request) {
  try {
    // Check authentication
    const userSession = await session();
    if (!userSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { productId, review, rating } = await request.json();

    if (!productId || !review || !rating) {
      return NextResponse.json(
        { error: "Product ID, review, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (review.length < 3 || review.length > 500) {
      return NextResponse.json(
        { error: "Review must be between 3 and 500 characters" },
        { status: 400 }
      );
    }

    // Connect to DB
    await dbConnect();

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: userSession.user.id,
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      productId,
      userId: userSession.user.id,
      review,
      rating,
    });

    await newReview.save();

    // Update product's average rating and review count
    const reviews = await Review.find({ productId });
    const averageRating =
      reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
    const reviewCount = reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviewCount,
    });

    return NextResponse.json(
      { message: "Review added successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
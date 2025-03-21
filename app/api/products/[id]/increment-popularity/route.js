// app/api/products/[id]/increment-popularity/route.js
import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { incrementBy = 1 } = await req.json();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.popularityScore = (product.popularityScore || 0) + incrementBy;
    await product.save();

    return NextResponse.json(
      { message: "Popularity incremented", popularityScore: product.popularityScore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error incrementing popularity:", error);
    return NextResponse.json({ error: "Failed to increment popularity" }, { status: 500 });
  }
}
// app/api/products/[id]/increment-popularity/route.js
import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/service/rate-limit";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    // Anonymous view-count ping, no session required by design - but the
    // increment amount must never come from the client, or anyone can call
    // this in a loop to inflate rankings arbitrarily. Always +1, rate
    // limited per IP+product so repeated page loads can't be scripted.
    const { allowed, retryAfterSeconds } = rateLimit(`popularity:${clientIp(req)}:${id}`, {
      limit: 10,
      windowMs: 60 * 1000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { popularityScore: 1 } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Popularity incremented",
        popularityScore: product.popularityScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error incrementing popularity:", error);
    return NextResponse.json(
      { error: "Failed to increment popularity" },
      { status: 500 }
    );
  }
}

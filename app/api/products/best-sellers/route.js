import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Order } from "@/models/order-model";
import { Product } from "@/models/product-model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();

    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 8;

    const ranked = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", unitsSold: { $sum: "$items.quantity" } } },
      { $sort: { unitsSold: -1 } },
      { $limit: limit },
    ]);

    const productIds = ranked.map((r) => r._id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const unitsSoldById = new Map(ranked.map((r) => [r._id.toString(), r.unitsSold]));
    const ordered = productIds
      .map((id) => products.find((p) => p._id.toString() === id.toString()))
      .filter(Boolean)
      .map((product) => ({
        ...product,
        unitsSold: unitsSoldById.get(product._id.toString()),
      }));

    return NextResponse.json({ products: ordered }, { status: 200 });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return NextResponse.json({ error: "Failed to fetch best sellers" }, { status: 500 });
  }
}

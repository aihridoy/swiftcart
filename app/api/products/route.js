import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
import { escapeRegExp } from "@/lib/escape-regexp";

export const dynamic = 'force-dynamic';

const ALLOWED_SORTS = new Set([
  "price", "-price",
  "createdAt", "-createdAt",
  "popularityScore", "-popularityScore",
  "title", "-title",
]);

export async function GET(req) {
    await dbConnect();

    try {
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit")) || 0;
        const rawSort = searchParams.get("sort");
        const sort = ALLOWED_SORTS.has(rawSort) ? rawSort : undefined;
        const category = searchParams.get("category") || null;
        const discounted = searchParams.get("discounted") === "true";

        let query = Product.find();

        if (category) {
          query = query.where("category").regex(new RegExp(`^${escapeRegExp(category)}$`, "i"));
        }

        if (discounted) {
          query = query.where({ $expr: { $gt: ["$originalPrice", "$price"] } });
        }

        query = query.sort(sort);
        if (limit > 0) {
          query = query.limit(limit);
        }
    
        const products = await query.lean();
        return NextResponse.json({ products }, {
          status: 200,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
      } 
}
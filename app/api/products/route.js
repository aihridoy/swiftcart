import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 0;
        const sort = searchParams.get("sort") || "-createdAt";
        const category = searchParams.get("category") || null;
    
        let query = Product.find();

        if (category) {
          query = query.where("category").regex(new RegExp(`^${category}$`, "i"));
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
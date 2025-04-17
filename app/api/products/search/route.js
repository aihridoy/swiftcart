import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    await dbConnect();

    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const limit = parseInt(searchParams.get("limit")) || 10;
        
        if (!query.trim()) {
            return NextResponse.json({ products: [] }, { status: 200 });
        }

        // Create a regex search pattern that is case insensitive
        const searchRegex = new RegExp(query, "i");
        
        // Search across multiple fields
        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        })
        .limit(limit)
        .lean();

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error searching products:", error);
        return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
    }
}
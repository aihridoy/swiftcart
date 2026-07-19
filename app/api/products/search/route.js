import { Product } from "@/models/product-model";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
import { escapeRegExp } from "@/lib/escape-regexp";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    await dbConnect();

    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const requestedLimit = parseInt(searchParams.get("limit")) || 10;
        const limit = Math.min(Math.max(requestedLimit, 1), 50);

        if (!query.trim()) {
            return NextResponse.json({ products: [] }, { status: 200 });
        }

        // Escaped: an unescaped "(" made this route throw a 500 and ".*" matched
        // the entire catalogue.
        const searchRegex = new RegExp(escapeRegExp(query.trim()), "i");

        // Search across multiple fields. The field is `title`, not `name` - the
        // old `name` clause silently never matched anything.
        const products = await Product.find({
            $or: [
                { title: { $regex: searchRegex } },
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
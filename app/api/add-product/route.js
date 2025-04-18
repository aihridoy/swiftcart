import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import { session } from "@/actions/auth-utils";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json(); 
    
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, brand, category, sku, price, description, mainImage, quantity } = body;
    if (!title || !brand || !category || !sku || !price || !description || !mainImage || !quantity) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const product = new Product({
      user: userSession.user.id,
      title,
      availability: body.availability || "In Stock",
      brand,
      category,
      sku,
      price: parseFloat(price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      description,
      quantity: parseInt(quantity, 10),
      mainImage,
      thumbnails: body.thumbnails || [],
    });

    await product.save();

    return NextResponse.json({ message: "Product added successfully", product }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "SKU must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
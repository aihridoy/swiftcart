import { NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { Wishlist } from "@/models/wishlist-model";
import { Product } from "@/models/product-model";
import { session } from "@/actions/auth-utils";

export async function GET(req) {
  await dbConnect();

  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = userSession.user.id;

    // Find the user's wishlist and populate the products
    let wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      // If the user doesn't have a wishlist, create an empty one
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    return NextResponse.json(
      { wishlist: wishlist.products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = userSession.user.id;
    const { productId, action } = await req.json();

    if (!productId || !["add", "remove"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request. Provide productId and action (add/remove)." },
        { status: 400 }
      );
    }

    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    if (action === "add") {
      // Add the product to the wishlist if it's not already there
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
        return NextResponse.json(
          { message: "Product added to wishlist", wishlist: wishlist.products },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { message: "Product already in wishlist", wishlist: wishlist.products },
        { status: 200 }
      );
    } else if (action === "remove") {
      // Remove the product from the wishlist
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
      return NextResponse.json(
        { message: "Product removed from wishlist", wishlist: wishlist.products },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
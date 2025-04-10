import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Cart } from "@/models/cart-model";
import { Product } from "@/models/product-model";

// Add or update item in cart (POST /api/cart)
export async function POST(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { productId, quantity = 1 } = await request.json();

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ user: userSession.user.id });
    if (!cart) {
      cart = new Cart({ user: userSession.user.id, items: [] });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if product exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();

    return NextResponse.json(
      { message: "Product added to cart successfully!", cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}

// Fetch cart (GET /api/cart)
export async function GET() {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const cart = await Cart.findOne({ user: userSession.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      return NextResponse.json({ cart: { items: [] } }, { status: 200 });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Remove item from cart (DELETE /api/cart)
export async function DELETE(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { productId } = await request.json();

    const cart = await Cart.findOne({ user: userSession.user.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return NextResponse.json(
      { message: "Product removed from cart successfully!", cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove product from cart" },
      { status: 500 }
    );
  }
}
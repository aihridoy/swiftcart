import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Cart } from "@/models/cart-model";

export async function GET(request, { params }) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartId } = params;
    if (!cartId) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }

    await dbConnect();

    // Find the cart by ID and populate the product field
    const cart = await Cart.findById(cartId).populate("items.product");

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Verify that the cart belongs to the current user
    if (cart.user.toString() !== userSession.user.id) {
      return NextResponse.json({ error: "Unauthorized to access this cart" }, { status: 403 });
    }

    // Return the entire cart object
    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
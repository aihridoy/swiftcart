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

    const { itemId } = params;
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await dbConnect();

    // Find the cart for the user and populate the product field
    const cart = await Cart.findOne({ user: userSession.user.id }).populate("items.product");

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the specific item in the cart's items array
    const cartItem = cart.items.find((item) => item._id.toString() === itemId);

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ cartItem }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart item:", error);
    return NextResponse.json({ error: "Failed to fetch cart item" }, { status: 500 });
  }
}
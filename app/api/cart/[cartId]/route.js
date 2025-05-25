import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Cart } from "@/models/cart-model";

export const dynamic = "force-dynamic";

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

    // Create response with cache-busting headers
    const response = NextResponse.json({ cart }, { status: 200 });
    
    // Set cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('ETag', `"${Date.now()}"`);

    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
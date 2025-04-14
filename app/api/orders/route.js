import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Order } from "@/models/order-model";
import { Cart } from "@/models/cart-model";

export async function POST(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartId, shippingDetails, subtotal, shipping, total } = body;

    if (!cartId || !shippingDetails || !subtotal || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Find the cart to get the items
    const cart = await Cart.findById(cartId);
    if (!cart || cart.user.toString() !== userSession.user.id) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Create the order
    const order = new Order({
      user: userSession.user.id,
      items: cart.items, // Copy items from the cart
      shippingDetails,
      subtotal,
      shipping: shipping || 0,
      total,
      status: "Pending",
    });

    await order.save();

    // Clear the cart by removing all items
    cart.items = [];
    await cart.save();

    return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ user: userSession.user.id }).populate("items.product").sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
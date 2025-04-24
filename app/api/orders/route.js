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

export async function GET(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get pagination parameters from query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let orders;
    let totalOrders;

    // Check if the user is an admin
    const isAdmin = userSession.user.role === "admin";

    if (isAdmin) {
      // Fetch all orders for admin
      orders = await Order.find({})
        .populate("items.product")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      totalOrders = await Order.countDocuments();
    } else {
      // Fetch user-specific orders
      orders = await Order.find({ user: userSession.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      totalOrders = await Order.countDocuments({ user: userSession.user.id });
    }

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json(
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user || userSession.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate status against the enum defined in the order model
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await dbConnect();

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
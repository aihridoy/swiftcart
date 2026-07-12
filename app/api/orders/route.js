import { NextResponse } from "next/server";
import { Resend } from "resend";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Order } from "@/models/order-model";
import { Cart } from "@/models/cart-model";
import { Product } from "@/models/product-model";

const resend = new Resend(process.env.RESEND_API_KEY);

function orderConfirmationHtml(order) {
  return `
    <h1 style="color: #0087de;">SwiftCart Order Confirmation</h1>
    <h2>Order Overview</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${order.status}</p>

    <h2>Shipping Details</h2>
    <p><strong>Name:</strong> ${order.shippingDetails?.firstName} ${order.shippingDetails?.lastName}</p>
    ${order.shippingDetails?.company ? `<p><strong>Company:</strong> ${order.shippingDetails.company}</p>` : ""}
    <p><strong>Address:</strong> ${order.shippingDetails?.address}</p>
    <p><strong>City, Country:</strong> ${order.shippingDetails?.city}, ${order.shippingDetails?.country}</p>
    <p><strong>Phone:</strong> ${order.shippingDetails?.phone}</p>

    <h2>Payment Information</h2>
    <p><strong>Payment Method:</strong> ${order.paymentDetails?.paymentMethod?.toUpperCase()}</p>
    <p><strong>Card:</strong> **** **** **** ${order.paymentDetails?.cardLast4}</p>

    <h2>Items</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #e6f0fa;">
          <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          ?.map(
            (item) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.product?.title || "Product"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>

    <h2>Order Summary</h2>
    <p><strong>Subtotal:</strong> $${order.subtotal?.toFixed(2)}</p>
    <p><strong>Shipping:</strong> ${order.shipping === 0 ? "Free" : `$${order.shipping?.toFixed(2)}`}</p>
    <p><strong>Total:</strong> $${order.total?.toFixed(2)}</p>

    <p style="color: #0087de;">Thank you for shopping with SwiftCart!</p>
    <p style="color: #0087de;">Contact us: <a href="mailto:support@swiftcart.com">support@swiftcart.com</a></p>
  `;
}

function orderStatusUpdateHtml(order) {
  return `
    <h1 style="color: #0087de;">SwiftCart Order Update</h1>
    <p>Hi ${order.shippingDetails?.firstName || "there"},</p>
    <p>Your order <strong>${order._id}</strong> is now:</p>
    <p style="font-size: 18px;"><strong>${order.status}</strong></p>
    <p><strong>Total:</strong> $${order.total?.toFixed(2)}</p>
    <p style="color: #0087de;">Thank you for shopping with SwiftCart!</p>
    <p style="color: #0087de;">Contact us: <a href="mailto:support@swiftcart.com">support@swiftcart.com</a></p>
  `;
}

// Transactional order emails always go to the logged-in account's email,
// not shippingDetails.email - the shipping form field can be edited to
// something other than the account holder's own address.
async function sendOrderEmail({ to, subject, html }) {
  try {
    const emailResponse = await resend.emails.send({
      from: "SwiftCart <noreply@ashrafulislam.im>",
      to,
      subject,
      html,
    });
    if (emailResponse.error) {
      console.error("Resend rejected order email:", emailResponse.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending order email:", error);
    return false;
  }
}

export async function POST(request) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartId, shippingDetails, paymentDetails } = body;

    if (!cartId || !shippingDetails || !paymentDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Find the cart to get the items
    const cart = await Cart.findById(cartId).populate("items.product");
    if (!cart || cart.user.toString() !== userSession.user.id) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Verify stock is still available for every item - never trust client-submitted totals
    for (const item of cart.items) {
      if (
        !item.product ||
        item.product.availability !== "In Stock" ||
        item.quantity > item.product.quantity
      ) {
        return NextResponse.json(
          {
            error: `${item.product?.title || "An item"} in your cart is no longer available in that quantity`,
          },
          { status: 400 }
        );
      }
    }

    // Recompute pricing server-side from the cart's own stored prices
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    // Create the order
    const order = new Order({
      user: userSession.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingDetails,
      paymentDetails,
      subtotal,
      shipping,
      total,
      status: "Pending",
    });

    await order.save();

    // Decrement stock for each purchased item
    for (const item of cart.items) {
      const remaining = Math.max(item.product.quantity - item.quantity, 0);
      await Product.findByIdAndUpdate(item.product._id, {
        quantity: remaining,
        availability: remaining <= 0 ? "Out of Stock" : "In Stock",
      });
    }

    // Clear the cart by removing all items
    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    const emailSent = await sendOrderEmail({
      to: userSession.user.email,
      subject: `SwiftCart Order Confirmation - ${order._id}`,
      html: orderConfirmationHtml(order),
    });

    return NextResponse.json(
      { message: "Order placed successfully", order, emailSent },
      { status: 201 }
    );
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
    const order = await Order.findById(orderId).populate("user", "email");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    const emailSent = await sendOrderEmail({
      to: order.user?.email,
      subject: `SwiftCart Order Update - ${order._id}`,
      html: orderStatusUpdateHtml(order),
    });

    return NextResponse.json(
      { message: "Order updated successfully", order, emailSent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
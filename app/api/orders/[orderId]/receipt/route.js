import { NextResponse } from "next/server";
import { session } from "@/actions/auth-utils";
import { dbConnect } from "@/service/mongo";
import { Order } from "@/models/order-model";
import { generateReceiptPdf } from "@/lib/generate-receipt";

export async function GET(request, { params }) {
  try {
    const userSession = await session();
    if (!userSession || !userSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { orderId } = params;
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = userSession.user.role === "admin";
    const isOwner = order.user?.toString() === userSession.user.id;
    if (!isAdmin && !isOwner) {
      // 404 rather than 403 so this can't be used to probe which order IDs exist
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const pdfBytes = await generateReceiptPdf(order);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SwiftCart_Order_${order._id}_Receipt.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 });
  }
}

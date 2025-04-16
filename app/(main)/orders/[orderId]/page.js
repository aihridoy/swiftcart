"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getOrders } from "@/actions/order-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch orders and find the specific order by ID
  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const result = await getOrders();
      const order = result.orders.find((o) => o._id === orderId);
      if (!order) throw new Error("Order not found");
      return order;
    },
    enabled: !!session && !!orderId,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your order.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error loading order: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Function to generate and download the PDF receipt
const downloadReceipt = async (order) => {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); 
    const { width, height } = page.getSize();

    // Embed fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Define colors
    const primaryColor = rgb(0, 0.53, 0.87); 
    const lightGray = rgb(0.95, 0.95, 0.95); 
    const borderColor = rgb(0.8, 0.8, 0.8); 
    const blackColor = rgb(0, 0, 0); 
    const pendingColor = rgb(0.9, 0.6, 0); 
    const completedColor = rgb(0, 0.6, 0.3); 

    const margin = 50;
    const contentWidth = width - (2 * margin);
    let yPosition = height - margin;

    // Helper function to draw text
    const drawText = (text, x, y, options = {}) => {
      const {
        size = 10,
        font = regularFont,
        color = blackColor,
        align = 'left',
        maxWidth = null
      } = options;
      
      let xPos = x;
      if (align === 'center' && maxWidth) {
        const textWidth = font.widthOfTextAtSize(text, size);
        xPos = x + (maxWidth - textWidth) / 2;
      } else if (align === 'right' && maxWidth) {
        const textWidth = font.widthOfTextAtSize(text, size);
        xPos = x + maxWidth - textWidth;
      }
      
      page.drawText(text, {
        x: xPos,
        y: y,
        size,
        font,
        color,
      });
      
      return font.heightAtSize(size);
    };

    // Helper function to draw a rectangle
    const drawRect = (x, y, w, h, options = {}) => {
      const {
        borderWidth = 0,
        borderColor = rgb(0, 0, 0),
        fillColor = null
      } = options;
      
      const drawOptions = { borderWidth, borderColor };
      if (fillColor) drawOptions.color = fillColor;
      
      page.drawRectangle({
        x,
        y: y - h,
        width: w,
        height: h,
        ...drawOptions,
      });
    };

    // Draw border around the page
    drawRect(margin - 10, height - margin + 10, width - 2 * (margin - 10), height - 2 * (margin - 10), {
      borderWidth: 1,
      borderColor: rgb(0.8, 0.8, 0.8)
    });
    
    // Header
    yPosition -= 10;
    drawText("SwiftCart", margin, yPosition, { size: 24, font: boldFont, color: primaryColor });
    yPosition -= 35;
    drawText("Order Receipt", margin, yPosition, { size: 18, font: boldFont, color: primaryColor });
    yPosition -= 30;
    
    // Draw a separator line
    drawRect(margin, yPosition, contentWidth, 1, { fillColor: rgb(0.85, 0.85, 0.85) });
    yPosition -= 20;

    // Order Overview Section
    drawText("Order Overview", margin, yPosition, { size: 14, font: boldFont, color: primaryColor });
    yPosition -= 25;
    
    // Order details box
    const overviewBoxHeight = 80;
    drawRect(margin, yPosition, contentWidth, overviewBoxHeight, { 
      borderWidth: 1, 
      borderColor,
      fillColor: rgb(0.98, 0.98, 0.98)
    });
    
    // Order ID and Date
    drawText(`Order ID: ${order._id}`, margin + 15, yPosition - 20, { size: 10, font: boldFont });
    drawText(`Placed on: ${new Date(order.createdAt).toLocaleDateString()}`, margin + 15, yPosition - 40);
    
    // Status with colored background
    const statusText = `Status: ${order.status}`;
    const statusWidth = 100;
    const statusHeight = 22;
    const statusX = margin + 15;
    const statusY = yPosition - 50;
    
    drawRect(statusX, statusY, statusWidth, statusHeight, { 
      fillColor: order.status === "Pending" ? rgb(1, 0.9, 0.7) : rgb(0.9, 1, 0.9),
      borderWidth: 1,
      borderColor: order.status === "Pending" ? pendingColor : completedColor
    });
    
    drawText(statusText, statusX + 10, statusY - 15, { 
      font: boldFont, 
      color: order.status === "Pending" ? pendingColor : completedColor
    });
    
    yPosition -= overviewBoxHeight + 30;

    // Shipping Details Section
    drawText("Shipping Details", margin, yPosition, { size: 14, font: boldFont, color: primaryColor });
    yPosition -= 25;
    
    // Shipping Details Box
    const shippingBoxHeight = 140;
    drawRect(margin, yPosition, contentWidth, shippingBoxHeight, { 
      borderWidth: 1, 
      borderColor,
      fillColor: rgb(0.98, 0.98, 0.98)
    });
    
    let detailsY = yPosition - 20;
    drawText(`${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`, margin + 15, detailsY, { font: boldFont });
    detailsY -= 20;
    
    if (order.shippingDetails.company) {
      drawText(order.shippingDetails.company, margin + 15, detailsY);
      detailsY -= 20;
    }
    
    drawText(order.shippingDetails.address, margin + 15, detailsY);
    detailsY -= 20;
    
    drawText(`${order.shippingDetails.city}, ${order.shippingDetails.country}`, margin + 15, detailsY);
    detailsY -= 20;
    
    drawText(`Phone: ${order.shippingDetails.phone}`, margin + 15, detailsY);
    detailsY -= 20;
    
    drawText(`Email: ${order.shippingDetails.email}`, margin + 15, detailsY);
    
    yPosition -= shippingBoxHeight + 30;

    // Items Table
    drawText("Items", margin, yPosition, { size: 14, font: boldFont, color: primaryColor });
    yPosition -= 25;
    
    // Table headers
    const columns = [
      { width: contentWidth * 0.6, title: "Product" },
      { width: contentWidth * 0.15, title: "Quantity" },
      { width: contentWidth * 0.25, title: "Total" }
    ];
    
    let tableX = margin;
    const headerHeight = 30;
    
    // Draw table header background
    drawRect(tableX, yPosition, contentWidth, headerHeight, { 
      fillColor: lightGray,
      borderWidth: 1,
      borderColor
    });
    
    // Draw header text
    columns.forEach(column => {
      drawText(column.title, tableX + 10, yPosition - 20, { font: boldFont });
      tableX += column.width;
    });
    
    yPosition -= headerHeight;
    
    // Draw table rows
    order.items.forEach((item, index) => {
      const rowHeight = 40;
      tableX = margin;
      
      // Row background (alternating colors)
      drawRect(tableX, yPosition, contentWidth, rowHeight, { 
        fillColor: index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.98, 0.98, 0.98),
        borderWidth: 1,
        borderColor
      });
      
      // Product column
      const productText = `${item.product.title} (${item.product.brand} - ${item.product.category})`;
      drawText(productText, tableX + 10, yPosition - 20, { maxWidth: columns[0].width - 20 });
      tableX += columns[0].width;
      
      // Quantity column
      drawText(`${item.quantity}`, tableX + 10, yPosition - 20, { align: 'center', maxWidth: columns[1].width - 20 });
      tableX += columns[1].width;
      
      // Total column
      drawText(`$${(item.price * item.quantity).toFixed(2)}`, tableX + 10, yPosition - 20, { 
        font: boldFont,
        align: 'right',
        maxWidth: columns[2].width - 20
      });
      
      yPosition -= rowHeight;
    });
    
    yPosition -= 30;

    // Order Summary
    drawText("Order Summary", margin, yPosition, { size: 14, font: boldFont, color: primaryColor });
    yPosition -= 25;
    
    // Summary box
    const summaryWidth = contentWidth * 0.5;
    const summaryX = margin + contentWidth - summaryWidth;
    
    // Draw summary lines
    const summaryRowHeight = 25;
    
    // Subtotal
    drawRect(summaryX, yPosition, summaryWidth, summaryRowHeight, { borderWidth: 1, borderColor });
    drawText("Subtotal:", summaryX + 10, yPosition - 17);
    drawText(`$${order.subtotal.toFixed(2)}`, summaryX + summaryWidth - 80, yPosition - 17, { align: 'right', maxWidth: 70 });
    yPosition -= summaryRowHeight;
    
    // Shipping
    drawRect(summaryX, yPosition, summaryWidth, summaryRowHeight, { borderWidth: 1, borderColor });
    drawText("Shipping:", summaryX + 10, yPosition - 17);
    drawText(
      order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`, 
      summaryX + summaryWidth - 80, 
      yPosition - 17, 
      { align: 'right', maxWidth: 70 }
    );
    yPosition -= summaryRowHeight;
    
    // Total
    drawRect(summaryX, yPosition, summaryWidth, summaryRowHeight, { 
      borderWidth: 1, 
      borderColor,
      fillColor: lightGray
    });
    drawText("Total:", summaryX + 10, yPosition - 17, { font: boldFont });
    drawText(
      `$${order.total.toFixed(2)}`,
      summaryX + summaryWidth - 80,
      yPosition - 17,
      { font: boldFont, align: 'right', maxWidth: 70 }
    );
    
    // Footer
    const footerY = margin + 40;
    drawText("Thank you for shopping with SwiftCart!", margin, footerY, { color: primaryColor, font: boldFont });
    drawText("Contact us: support@swiftcart.com", margin, footerY - 20, { color: primaryColor });

    // Generate and download PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `SwiftCart_Order_${order._id}_Receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    toast.error("Failed to generate receipt. Please try again.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

  if (isLoading) {
    return (
      <div className="container min-h-screen py-16 flex justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Failed to load order details. Please try again later.</p>
      </div>
    );
  }

  const order = data;

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium mb-6">Order Details</h2>

      <div className="border border-gray-200 rounded p-4 shadow-sm">
        {/* Order Overview */}
        <div className="mb-6">
          <p className="text-gray-800 font-medium">Order ID: {order?._id}</p>
          <p className="text-gray-600 text-sm">
            Placed on: {new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                order?.status === "Pending"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {order?.status}
            </span>
          </p>
        </div>

        {/* Shipping Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Shipping Details</h3>
          <p className="text-gray-600">
            {order?.shippingDetails.firstName} {order?.shippingDetails.lastName}
          </p>
          {order?.shippingDetails.company && (
            <p className="text-gray-600">{order?.shippingDetails.company}</p>
          )}
          <p className="text-gray-600">{order?.shippingDetails.address}</p>
          <p className="text-gray-600">
            {order?.shippingDetails.city}, {order?.shippingDetails.country}
          </p>
          <p className="text-gray-600">Phone: {order?.shippingDetails.phone}</p>
          <p className="text-gray-600">Email: {order?.shippingDetails.email}</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="space-y-2">
            {order?.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b border-gray-100 py-2"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.title}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                  <div>
                    <h4 className="text-gray-800 font-medium">
                      {item.product.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {item.product.brand} - {item.product.category}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-2">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <div className="flex justify-between text-gray-600 mb-1">
            <p>Subtotal</p>
            <p>${order?.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600 mb-1">
            <p>Shipping</p>
            <p>
              {order?.shipping === 0 ? "Free" : `$${order?.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="flex justify-between text-gray-800 font-semibold">
            <p>Total</p>
            <p>${order?.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link href="/orders" className="text-primary hover:underline">
          Back to Order History
        </Link>
        <button
          onClick={() => downloadReceipt(order)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
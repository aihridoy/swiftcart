import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Server-side order-receipt PDF generation. Pure pdf-lib, no DOM - runs in
// the API route so ~290 lines of pdf-lib don't ship to (and execute in)
// every client that opens an order page. Returns the PDF bytes; the caller
// (browser) handles the actual download.
export async function generateReceiptPdf(order) {
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
  const contentWidth = width - 2 * margin;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (text, x, y, options = {}) => {
    const {
      size = 10,
      font = regularFont,
      color = blackColor,
      align = "left",
      maxWidth = null,
    } = options;

    let xPos = x;
    if (align === "center" && maxWidth) {
      const textWidth = font.widthOfTextAtSize(text, size);
      xPos = x + (maxWidth - textWidth) / 2;
    } else if (align === "right" && maxWidth) {
      const textWidth = font.widthOfTextAtSize(text, size);
      xPos = x + maxWidth - textWidth;
    }

    page.drawText(text, { x: xPos, y, size, font, color });

    return font.heightAtSize(size);
  };

  // Helper function to draw a rectangle
  const drawRect = (x, y, w, h, options = {}) => {
    const { borderWidth = 0, borderColor = rgb(0, 0, 0), fillColor = null } = options;

    const drawOptions = { borderWidth, borderColor };
    if (fillColor) drawOptions.color = fillColor;

    page.drawRectangle({ x, y: y - h, width: w, height: h, ...drawOptions });
  };

  // Draw border around the page
  drawRect(margin - 10, height - margin + 10, width - 2 * (margin - 10), height - 2 * (margin - 10), {
    borderWidth: 1,
    borderColor: rgb(0.8, 0.8, 0.8),
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
    fillColor: rgb(0.98, 0.98, 0.98),
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
    borderColor: order.status === "Pending" ? pendingColor : completedColor,
  });

  drawText(statusText, statusX + 10, statusY - 15, {
    font: boldFont,
    color: order.status === "Pending" ? pendingColor : completedColor,
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
    fillColor: rgb(0.98, 0.98, 0.98),
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
    { width: contentWidth * 0.25, title: "Total" },
  ];

  let tableX = margin;
  const headerHeight = 30;

  // Draw table header background
  drawRect(tableX, yPosition, contentWidth, headerHeight, {
    fillColor: lightGray,
    borderWidth: 1,
    borderColor,
  });

  // Draw header text
  columns.forEach((column) => {
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
      borderColor,
    });

    // Product column
    const productText = `${item.product.title} (${item.product.brand} - ${item.product.category})`;
    drawText(productText, tableX + 10, yPosition - 20, { maxWidth: columns[0].width - 20 });
    tableX += columns[0].width;

    // Quantity column
    drawText(`${item.quantity}`, tableX + 10, yPosition - 20, { align: "center", maxWidth: columns[1].width - 20 });
    tableX += columns[1].width;

    // Total column
    drawText(`$${(item.price * item.quantity).toFixed(2)}`, tableX + 10, yPosition - 20, {
      font: boldFont,
      align: "right",
      maxWidth: columns[2].width - 20,
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
  drawText(`$${order.subtotal.toFixed(2)}`, summaryX + summaryWidth - 80, yPosition - 17, { align: "right", maxWidth: 70 });
  yPosition -= summaryRowHeight;

  // Shipping
  drawRect(summaryX, yPosition, summaryWidth, summaryRowHeight, { borderWidth: 1, borderColor });
  drawText("Shipping:", summaryX + 10, yPosition - 17);
  drawText(
    order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`,
    summaryX + summaryWidth - 80,
    yPosition - 17,
    { align: "right", maxWidth: 70 }
  );
  yPosition -= summaryRowHeight;

  // Total
  drawRect(summaryX, yPosition, summaryWidth, summaryRowHeight, {
    borderWidth: 1,
    borderColor,
    fillColor: lightGray,
  });
  drawText("Total:", summaryX + 10, yPosition - 17, { font: boldFont });
  drawText(`$${order.total.toFixed(2)}`, summaryX + summaryWidth - 80, yPosition - 17, {
    font: boldFont,
    align: "right",
    maxWidth: 70,
  });

  // Footer
  const footerY = margin + 40;
  drawText("Thank you for shopping with SwiftCart!", margin, footerY, { color: primaryColor, font: boldFont });
  drawText("Contact us: support@swiftcart.com", margin, footerY - 20, { color: primaryColor });

  return pdfDoc.save();
}

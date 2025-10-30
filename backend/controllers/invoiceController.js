import Invoice from "../models/invoice.js";
import Order from "../models/order.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  const nextNum = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.replace("INV-", "")) + 1
    : 1;
  return `INV-${nextNum.toString().padStart(4, "0")}`;
};

/**
Generate and Download Invoice (PDF)
 */
export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params; 
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const invoiceNumber = await generateInvoiceNumber();

   
    const invoice = new Invoice({
      invoiceNumber,
      orderId: order._id,
      seller: {
        name: "My Store",
        address: "123 Market St, City",
        contact: "9876543210",
      },
      products: order.products,
      total: order.totalPrice,
    });
    await invoice.save();

 
    const invoicesDir = path.resolve("invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

    const filename = `invoice_${order._id}.pdf`;
    const filePath = path.join(invoicesDir, filename);

   
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- HEADER ---
    doc
      .fontSize(22)
      .fillColor("#2563eb")
      .text("ShopEase INVOICE", { align: "center" })
      .moveDown();

    // --- META INFO ---
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Invoice Number: ${invoiceNumber}`)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`)
      .text(`Order ID: ${order._id}`)
      .moveDown();

    // --- SELLER INFO ---
    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Seller Information", { underline: true })
      .fontSize(12)
      .fillColor("black")
      .text(`Name: ${invoice.seller.name}`)
      .text(`Address: ${invoice.seller.address}`)
      .text(`Contact: ${invoice.seller.contact}`)
      .moveDown();

    // --- BUYER INFO ---
    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Buyer Information", { underline: true })
      .fontSize(12)
      .fillColor("black")
      .text(`Name: ${order.customer.name}`)
      .text(`Email: ${order.customer.email}`)
      .text(`Address: ${order.customer.address}`)
      .moveDown();

    // --- PRODUCTS TABLE ---
    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Order Items", { underline: true })
      .moveDown(0.5);

    // Table Headers
    doc.font("Helvetica-Bold").text("Product", 50, doc.y, { continued: true });
    doc.text("Qty", 250, doc.y, { continued: true });
    doc.text("Price", 300, doc.y, { continued: true });
    doc.text("Subtotal", 400);
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Rows
    doc.font("Helvetica");
    order.products.forEach((p) => {
      const subtotal = p.price * p.quantity;
      doc.text(p.name, 50, doc.y, { continued: true });
      doc.text(p.quantity.toString(), 250, doc.y, { continued: true });
      doc.text(`₹${p.price.toFixed(2)}`, 300, doc.y, { continued: true });
      doc.text(`₹${subtotal.toFixed(2)}`, 400);
    });

    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);

    // --- TOTAL ---
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total Amount: ₹${order.totalPrice.toFixed(2)}`, { align: "right" })
      .moveDown(2);

    // --- FOOTER ---
    doc
      .fontSize(12)
      .font("Helvetica-Oblique")
      .fillColor("gray")
      .text("Thank you for shopping with ShopEase!", { align: "center" })
      .moveDown(0.5)
      .text("This is a system-generated invoice. No signature required.", {
        align: "center",
      });

    doc.end();

    
    stream.on("finish", () => {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error(" Error sending invoice:", err);
          return res.status(500).json({ message: "Error sending invoice" });
        }
      
        setTimeout(() => {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn("⚠️ Could not delete temp file:", e.message);
          }
        }, 30000);
      });
    });
  } catch (err) {
    console.error(" Invoice Generation Error:", err);
    res.status(500).json({ message: err.message });
  }
};

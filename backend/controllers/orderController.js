import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * 🛒 Create Order
 */
export const createOrder = async (req, res) => {
  try {
    const { customer, products } = req.body;

    // 🔹 Input validation
    if (!customer?.name || !customer?.email || !customer?.address) {
      return res
        .status(400)
        .json({ message: "Customer name, email, and address are required." });
    }
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array required." });
    }

    // 🔹 Validate product IDs and quantities
    const productIds = products.map((p) => p.productId);
    if (productIds.some((id) => !id)) {
      return res
        .status(400)
        .json({ message: "Each product must include productId and quantity." });
    }

    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const priceMap = Object.fromEntries(dbProducts.map((p) => [p._id, p.price]));

    let totalPrice = 0;
    const orderItems = products.map((p) => {
      const price = priceMap[p.productId];
      if (price === undefined)
        throw new Error(`Product not found or deleted: ${p.productId}`);
      const quantity = Number(p.quantity) || 0;
      if (quantity <= 0) throw new Error("Quantity must be >= 1");
      totalPrice += price * quantity;
      return {
        productId: new mongoose.Types.ObjectId(p.productId),
        name: p.name || "Unnamed Product",
        price,
        quantity,
      };
    });

    // 🔹 Create and save the order
    const order = await Order.create({
      customer,
      products: orderItems,
      totalPrice,
      orderState: "Pending",
    });


    const io = req.app.get("io");
    io.emit("order:created", {
      order,
      message: `🛒 New order from ${customer.name}`,
    });


    await sendEmail(
      customer.email,
      "🛍️ Order Confirmation - ShopEase",
      `
      <h2>Thank you for your order, ${customer.name}!</h2>
      <p>Your order has been received successfully and is being processed.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${totalPrice.toFixed(2)}</p>
      <p>We’ll notify you when your order is shipped or delivered.</p>
      <br/>
      <p>Best Regards,<br/>ShopEase Team</p>
      `
    );


    await sendEmail(
      process.env.SELLER_EMAIL || process.env.EMAIL_USER,
      "📦 New Order Received - ShopEase",
      `
      <h3>New Order Notification</h3>
      <p>Customer: ${customer.name}</p>
      <p>Email: ${customer.email}</p>
      <p>Total: ₹${totalPrice.toFixed(2)}</p>
      <p>Order ID: ${order._id}</p>
      `
    );

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(" Order Creation Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Get All Orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

/**
 *  Update Order Status (manual label or override)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.emit("order:statusUpdated", {
      order,
      message: `Order ${order._id} status updated to ${status}`,
    });

    await sendEmail(
      order.customer.email,
      "📦 Order Status Updated - ShopEase",
      `
      <h3>Hi ${order.customer.name},</h3>
      <p>Your order <strong>${order._id}</strong> has been updated.</p>
      <p><strong>New Status:</strong> ${status}</p>
      `
    );

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error(" Error updating order status:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Update Order State (Pending → Confirmed → Shipped → Delivered)
 */
export const updateOrderState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const validStates = [
      "Pending",
      "Confirmed",
      "In Packing",
      "Ready to Dispatch",
      "Shipped",
      "Delivered",
    ];

    if (!validStates.includes(state)) {
      return res.status(400).json({ message: "Invalid order state" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderState: state },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.emit("order:stateChanged", {
      order,
      message: `Order ${order._id} moved to state: ${state}`,
    });

    await sendEmail(
      order.customer.email,
      "🚚 Order Update - ShopEase",
      `
      <h3>Hi ${order.customer.name},</h3>
      <p>Your order <strong>${order._id}</strong> is now <strong>${state}</strong>.</p>
      <p>Track your order anytime in your account.</p>
      `
    );

    res.json({ message: "Order state updated successfully", order });
  } catch (err) {
    console.error("Error updating order state:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

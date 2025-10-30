import React, { useEffect, useState } from "react";
import { FileText, Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";
import {
  loadOrders,
  updateOrderState,
} from "../Data/mockOrders"; 

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    setTimeout(() => {
      const data = loadOrders();
      setOrders(data);
      setLoading(false);
    }, 400);
  };

  const handleStatusChange = (id, newStatus) => {
    setUpdating(id);
    setTimeout(() => {
      const updatedOrders = updateOrderState(id, newStatus); 
      setOrders(updatedOrders);
      setUpdating(null);
      toast.success(`Order ${id} updated to ${newStatus}`);
    }, 400);
  };

  const generateInvoice = async (orderId) => {
    try {
      setDownloading(orderId);
      const order = orders.find((o) => o._id === orderId);

      if (!order) {
        toast.error("Order not found!");
        setDownloading(null);
        return;
      }

      const products = order.products || [
        { name: "Wireless Headphones", qty: 1, price: 2999 },
        { name: "USB-C Cable", qty: 2, price: 499 },
      ];

      const invoiceNumber = `INV-${Date.now()}`;
      const date = new Date().toLocaleString();

      const subtotal = products.reduce((sum, p) => sum + p.qty * p.price, 0);
      const tax = subtotal * 0.18; // 18% GST
      const grandTotal = subtotal + tax;

      const invoiceText = `
🧾 ShopEase Official Invoice
========================================
Invoice No: ${invoiceNumber}
Date: ${date}

SELLER DETAILS:
ShopEase Pvt. Ltd.
123, Tech Park, Bangalore, India
Email: support@shopease.com
Phone: +91 98765 43210

CUSTOMER DETAILS:
Name: ${order.customer.name}
Address: ${order.customer.address}

----------------------------------------
ITEMS:
${products
  .map(
    (p) =>
      `• ${p.name}  |  Qty: ${p.qty}  |  ₹${p.price}  |  Subtotal: ₹${p.qty * p.price}`
  )
  .join("\n")}

----------------------------------------
Subtotal: ₹${subtotal.toFixed(2)}
GST (18%): ₹${tax.toFixed(2)}
Grand Total: ₹${grandTotal.toFixed(2)}

Order Status: ${order.orderState}
Payment Method: Cash on Delivery

----------------------------------------
Seller Signature: _______________________

Thank you for shopping with ShopEase!
Visit again 😊
========================================
`;

      const blob = new Blob([invoiceText], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.click();
      a.remove();

      toast.success(` Invoice ${invoiceNumber} downloaded!`);
    } catch (err) {
      console.error(" Invoice Error:", err);
      toast.error("Failed to generate invoice");
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#a8c2ef] text-white">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">Manage Orders</h2>
      </div>

      {loading ? (
        <p className="text-gray-200">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-100">No orders available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full text-sm bg-[#f5f5f6] border border-gray-700 rounded-lg">
            <thead className="bg-[#555557] text-white uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Total (₹)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-[#6b6c6e] transition"
                >
                  <td className="p-3 font-semibold text-yellow-400">
                    {order._id}
                  </td>
                  <td className="p-3 text-black font-bold">
                    {order.customer.name}
                  </td>
                  <td className="p-3 text-black">{order.customer.address}</td>
                  <td className="p-3 text-black font-semibold">
                    ₹{order.totalPrice}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.orderState}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updating === order._id}
                      className="bg-[#09090a] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none"
                    >
                      {[
                        "Pending",
                        "Confirmed",
                        "In Packing",
                        "Ready to Dispatch",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => generateInvoice(order._id)}
                      disabled={downloading === order._id}
                      className={`flex items-center gap-2 ${
                        downloading === order._id
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-600"
                      } text-white px-4 py-2 rounded-md font-semibold transition`}
                    >
                      {downloading === order._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

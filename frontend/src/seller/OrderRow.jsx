import React, { useState } from "react";
import InvoiceModal from "./InvoiceModal";

export default function OrderRow({ order, refreshOrders }) {
  const [showInvoice, setShowInvoice] = useState(false);
  const states = [
    "Pending",
    "Confirmed",
    "In Packing",
    "Ready to Dispatch",
    "Shipped",
    "Delivered",
  ];

  const handleStateChange = async (e) => {
    const newState = e.target.value;
    await fetch(`http://localhost:8000/api/orders/${order._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: newState }),
    });
    refreshOrders();
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-3">{order._id}</td>
        <td className="p-3">{order.customer?.name}</td>
        <td className="p-3">{order.customer?.address}</td>
        <td className="p-3">${order.totalPrice}</td>
        <td className="p-3">
          <select
            value={order.orderState}
            onChange={handleStateChange}
            className="border rounded-lg p-1"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="p-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            Generate Invoice
          </button>
        </td>
      </tr>

      {showInvoice && (
        <InvoiceModal orderId={order._id} close={() => setShowInvoice(false)} />
      )}
    </>
  );
}

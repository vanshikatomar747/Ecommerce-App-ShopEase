import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); 

export default function OrderConfirmation() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrderDetails(location.state.order);
    }
  }, [location.state]);

  useEffect(() => {
    if (!orderDetails) return;

    // Listen for real-time updates for THIS order
    socket.on("order:stateChanged", (data) => {
      if (data.order._id === orderDetails.orderId) {
        setStatusMessage(`Your order is now "${data.order.orderState}" 🚚`);
        setOrderDetails((prev) => ({
          ...prev,
          orderState: data.order.orderState,
        }));
      }
    });

    socket.on("order:statusUpdated", (data) => {
      if (data.order._id === orderDetails.orderId) {
        setStatusMessage(`Order status updated: ${data.order.status}`);
      }
    });

    return () => {
      socket.off("order:stateChanged");
      socket.off("order:statusUpdated");
    };
  }, [orderDetails]);

  if (!orderDetails) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-gray-600">
        <p>No order details found.</p>
        <Link
          to="/"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const { orderId, items, totalAmount, customer, orderState } = orderDetails;

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 bg-white shadow-md rounded-2xl text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Order Confirmed 🎉
      </h2>
      <p className="text-gray-600 mb-6">
        Thank you, <span className="font-medium">{customer?.name}</span>! <br />
        Your order has been placed successfully.
      </p>

      {statusMessage && (
        <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg mb-4">
          {statusMessage}
        </div>
      )}

      <div className="bg-gray-50 border rounded-lg p-4 mb-6 text-left">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Order Summary
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          <strong>Order ID:</strong> {orderId}
        </p>
        {orderState && (
          <p className="text-gray-500 text-sm mb-2">
            <strong>Current Status:</strong>{" "}
            <span className="text-blue-600">{orderState}</span>
          </p>
        )}
        <ul className="divide-y">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between py-2 text-gray-700">
              <span>{item.name}</span>
              <span>
                ₹{item.price} × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-gray-800 mt-3">
          <span>Total Amount:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

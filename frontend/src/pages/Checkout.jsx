import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    const { name, email, phone, address } = form;

    if (!name || !email || !phone || !address) {
      toast.error("Please fill all details before checkout!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const orderId = Math.floor(Math.random() * 1000000);

    // Show success message
    toast.success(`Order placed successfully! Thank you, ${name}.`);

    // Clear cart after placing order
    clearCart();

    // Navigate to order confirmation page with order details
    navigate("/order-confirmation", {
      state: {
        order: {
          orderId,
          items: cart,
          totalAmount: total,
          customer: { name, email, phone, address },
        },
      },
    });

    // Reset form
    setForm({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">🧾 Checkout</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <p className="font-bold text-blue-600">
                      ₹{item.price} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="text-right mb-8 border-t pt-4">
            <h3 className="text-2xl font-semibold">
              Total: <span className="text-blue-600">₹{total}</span>
            </h3>
          </div>

          {/* Checkout Form */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">🧍 Customer Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder="Full Name"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="Email"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInput}
                placeholder="Phone Number"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                name="address"
                value={form.address}
                onChange={handleInput}
                placeholder="Full Address"
                rows="3"
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
              />
            </div>

            <div className="text-right mt-6">
              <button
                onClick={handleOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

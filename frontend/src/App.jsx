import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components & Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import SellerDashboard from "./pages/SellerDashboard";
import InvoicePage from "./pages/InvoicePage";
import SellerRoute from "./components/SellerRoute";
import SellerOrders from "./pages/SellerOrders";

export default function App() {
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
        {/* 🧭 Navbar */}
        <Navbar setCategory={setCategory} setSearchQuery={setSearchQuery} />

        {/* 🗺️ Routes */}
        <main className="pt-4 px-4 md:px-8">
          <Routes>
            
            <Route
              path="/"
              element={<Home category={category} searchQuery={searchQuery} />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

           
            <Route
              path="/seller-dashboard"
              element={
                <SellerRoute>
                  <SellerDashboard />
                </SellerRoute>
              }
            />

            <Route
              path="/seller/invoice/:orderId"
              element={
                <SellerRoute>
                  <InvoicePage />
                </SellerRoute>
              }
            />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller" element={<Navigate to="/seller-dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

       
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
              textAlign: "center",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

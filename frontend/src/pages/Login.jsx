import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Store } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("🔐 Login response:", data);

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Ensure backend returned the expected fields
      if (!data.user || !data.user.role) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // Role check
      if (data.user.role !== role) {
        toast.error(
          `You are registered as a ${data.user.role}. Please switch to the correct role.`,
          { position: "top-center" }
        );
        return;
      }

      // Save credentials
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.name || "User"} 👋`, {
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "12px",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "600",
        },
      });

      // Redirect based on role
      setTimeout(() => {
        if (role === "seller") navigate("/seller-dashboard");
        else navigate("/");
      }, 1200);
    } catch (error) {
      console.error(" Login Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-gray-100 flex flex-col justify-center"
      >
        <div className="flex items-center justify-center mb-6">
          <LogIn className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-3xl font-bold text-blue-600">Login </h2>
        </div>

        {/* Role Selection */}
        <div className="flex justify-between gap-4 mb-6">
          {/* Buyer Option */}
          <div
            onClick={() => setRole("buyer")}
            className={`flex-1 cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              role === "buyer"
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <User
              className={`w-8 h-8 mb-2 ${
                role === "buyer" ? "text-blue-600" : "text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                role === "buyer" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Buyer
            </span>
          </div>

          {/* Seller Option */}
          <div
            onClick={() => setRole("seller")}
            className={`flex-1 cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              role === "seller"
                ? "border-green-600 bg-green-50 shadow-md"
                : "border-gray-200 hover:border-green-400"
            }`}
          >
            <Store
              className={`w-8 h-8 mb-2 ${
                role === "seller" ? "text-green-600" : "text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                role === "seller" ? "text-green-600" : "text-gray-600"
              }`}
            >
              Seller
            </span>
          </div>
        </div>

        {/* Inputs */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInput}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInput}
          className="w-full p-3 mb-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          } text-white font-semibold py-3 rounded-xl shadow-md transition-transform transform hover:scale-105`}
        >
          {loading
            ? "Logging in..."
            : `Login as ${role === "seller" ? "Seller" : "Buyer"}`}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

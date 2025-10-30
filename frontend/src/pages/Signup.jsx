import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Store } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success(`Welcome ${data.user.name}!`);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "seller") navigate("/seller");
      else navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-gray-100 transform transition-all hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border border-gray-300 p-3 rounded-xl w-full mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-xl w-full mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border border-gray-300 p-3 rounded-xl w-full mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Role Selection */}
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Choose your role:
        </h3>
        <div className="flex justify-between gap-4 mb-6">
          {/* Buyer Card */}
          <div
            onClick={() => handleRoleSelect("buyer")}
            className={`flex-1 cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              form.role === "buyer"
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <User
              className={`w-8 h-8 mb-2 ${
                form.role === "buyer" ? "text-blue-600" : "text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                form.role === "buyer" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Buyer
            </span>
          </div>

          {/* Seller Card */}
          <div
            onClick={() => handleRoleSelect("seller")}
            className={`flex-1 cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
              form.role === "seller"
                ? "border-green-600 bg-green-50 shadow-md"
                : "border-gray-200 hover:border-green-400"
            }`}
          >
            <Store
              className={`w-8 h-8 mb-2 ${
                form.role === "seller" ? "text-green-600" : "text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                form.role === "seller" ? "text-green-600" : "text-gray-600"
              }`}
            >
              Seller
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-transform transform hover:scale-[1.02]"
        >
          Sign Up as {form.role === "seller" ? "Seller" : "Buyer"}
        </button>
      </form>
    </div>
  );
}

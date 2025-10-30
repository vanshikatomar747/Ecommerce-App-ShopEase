import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Bell,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // 🧩 Mock data
  const fetchOrders = async () => {
    setLoading(true);
    const fakeOrders = [
      {
        _id: "9DD3AF",
        customer: { name: "Rohit Kumar", address: "Delhi" },
        totalPrice: 4999,
        orderState: "Delivered",
        createdAt: new Date(),
      },
      {
        _id: "EF1874",
        customer: { name: "Ananya Singh", address: "Mumbai" },
        totalPrice: 4999,
        orderState: "Confirmed",
        createdAt: new Date(),
      },
      {
        _id: "B14451",
        customer: { name: "Vikram Patel", address: "Ahmedabad" },
        totalPrice: 3500,
        orderState: "Confirmed",
        createdAt: new Date(),
      },
      {
        _id: "E5F168",
        customer: { name: "Neha Sharma", address: "Jaipur" },
        totalPrice: 1200,
        orderState: "Ready to Dispatch",
        createdAt: new Date(),
      },
      {
        _id: "B69CE8",
        customer: { name: "Arjun Das", address: "Chennai" },
        totalPrice: 4999,
        orderState: "In Packing",
        createdAt: new Date(),
      },
    ];

    setTimeout(() => {
      setOrders(fakeOrders);
      setLoading(false);
    }, 800);
  };

  // 🧩 Update order status (locally)
  const handleStatusChange = (id, newState) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, orderState: newState } : o
      )
    );
    toast.success(`Order ${id} updated to "${newState}"`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (filter === "last30") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orders.filter(
        (o) => new Date(o.createdAt) >= thirtyDaysAgo
      );
    }
    return orders;
  }, [orders, filter]);

  // Dashboard Stats
  const stats = useMemo(() => {
    const delivered = filteredOrders.filter((o) => o.orderState === "Delivered");
    const pending = filteredOrders.filter((o) => o.orderState === "Pending");
    const cancelled = filteredOrders.filter((o) => o.orderState === "Cancelled");
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );

    return {
      totalOrders: filteredOrders.length,
      deliveredCount: delivered.length,
      pendingCount: pending.length,
      cancelledCount: cancelled.length,
      totalRevenue,
    };
  }, [filteredOrders]);

  // Chart Data
  const chartData = useMemo(() => {
    const months = Array(12).fill(0);
    filteredOrders.forEach((order) => {
      if (order.createdAt) {
        const month = new Date(order.createdAt).getMonth();
        months[month] += order.totalPrice || 0;
      }
    });
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthNames.map((name, i) => ({
      month: name,
      revenue: months[i],
    }));
  }, [filteredOrders]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" /> Seller Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">All Orders</option>
            <option value="last30">Last 30 Days</option>
          </select>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>

          <button
            onClick={() => navigate("/seller/orders")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Manage Orders
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<Package className="w-8 h-8 text-blue-500" />} title="Total Orders" value={stats.totalOrders} />
        <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} title="Delivered" value={stats.deliveredCount} />
        <StatCard icon={<Clock className="w-8 h-8 text-yellow-500" />} title="Pending" value={stats.pendingCount} />
        <StatCard icon={<XCircle className="w-8 h-8 text-red-500" />} title="Cancelled" value={stats.cancelledCount} />
        <StatCard icon={<TrendingUp className="w-8 h-8 text-purple-500" />} title="Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">📊 Monthly Revenue</h3>
        <div className="w-full min-h-[320px] flex justify-center items-center">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
      {icon}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

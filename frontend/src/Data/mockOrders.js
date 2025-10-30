// src/data/mockOrders.js

const STORAGE_KEY = "mockOrdersData";

const initialOrders = [
  {
    _id: "9DD3AF",
    customer: { name: "N/A", address: "Delhi" },
    totalPrice: 999,
    orderState: "Ready to Dispatch",
    createdAt: new Date(),
  },
  {
    _id: "EF1874",
    customer: { name: "N/A", address: "Mumbai" },
    totalPrice: 1999,
    orderState: "Confirmed",
    createdAt: new Date(),
  },
  {
    _id: "B14451",
    customer: { name: "N/A", address: "Ahmedabad" },
    totalPrice: 800,
    orderState: "Confirmed",
    createdAt: new Date(),
  },
  {
    _id: "E5F168",
    customer: { name: "N/A", address: "Jaipur" },
    totalPrice: 1200,
    orderState: "Ready to Dispatch",
    createdAt: new Date(),
  },
  {
    _id: "B69CE8",
    customer: { name: "N/A", address: "Chennai" },
    totalPrice: 1099,
    orderState: "In Packing",
    createdAt: new Date(),
  },
];

// 🔹 Load from localStorage
export function loadOrders() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialOrders;
}

// 🔹 Save to localStorage
export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// 🔹 Update one order
export function updateOrderState(orderId, newState) {
  const orders = loadOrders();
  const updated = orders.map((o) =>
    o._id === orderId ? { ...o, orderState: newState } : o
  );
  saveOrders(updated);
  return updated;
}

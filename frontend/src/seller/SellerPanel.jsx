import React, { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";

export default function SellerPanel() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8000/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center"> Seller Panel</h1>
      <OrdersTable orders={orders} refreshOrders={fetchOrders} />
    </div>
  );
}

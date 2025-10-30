import OrderRow from "./OrderRow";

export default function OrdersTable({ orders, refreshOrders }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Total Price</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">No orders yet.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                refreshOrders={refreshOrders}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

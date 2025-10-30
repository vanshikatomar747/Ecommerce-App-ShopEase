import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function InvoicePage() {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/invoices/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();
        setInvoice(data);
      } catch (error) {
        toast.error("Error fetching invoice");
      }
    };
    fetchInvoice();
  }, [orderId]);

  const handleDownload = () => {
    const content = document.getElementById("invoice").innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${orderId}.html`;
    link.click();
  };

  if (!invoice)
    return <p className="text-center text-gray-500 py-10">Loading invoice...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div id="invoice" className="bg-white shadow-lg rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold text-center mb-4">🧾 Invoice</h2>
        <p className="mb-2"><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
        <p className="mb-2"><strong>Order ID:</strong> {invoice.orderId}</p>
        <p className="mb-2"><strong>Customer:</strong> {invoice.customer.name}</p>
        <p className="mb-2"><strong>Address:</strong> {invoice.customer.address}</p>
        <p className="mb-4"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-right text-lg font-bold">
          Total: ₹{invoice.totalAmount}
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}

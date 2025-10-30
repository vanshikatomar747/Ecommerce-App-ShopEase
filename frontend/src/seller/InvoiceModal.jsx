import React, { useEffect, useState } from "react";

export default function InvoiceModal({ orderId, close }) {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const generateInvoice = async () => {
      const res = await fetch(`http://localhost:8000/api/invoices/${orderId}`, {
        method: "POST",
      });
      const data = await res.json();
      setInvoice(data);
    };
    generateInvoice();
  }, [orderId]);

  if (!invoice)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl">Generating invoice...</div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 relative shadow-lg">
        <button
          onClick={close}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Invoice #{invoice.invoiceNumber}</h2>
        <p><strong>Seller:</strong> {invoice.seller.name}</p>
        <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
        <hr className="my-2" />
        <div>
          {invoice.products.map((p, i) => (
            <div key={i} className="flex justify-between mb-1">
              <span>{p.name} × {p.quantity}</span>
              <span>${p.price * p.quantity}</span>
            </div>
          ))}
        </div>
        <hr className="my-2" />
        <p className="text-right font-bold">Total: ${invoice.total}</p>

        <button
          onClick={() => window.print()}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Print / Download
        </button>
      </div>
    </div>
  );
}

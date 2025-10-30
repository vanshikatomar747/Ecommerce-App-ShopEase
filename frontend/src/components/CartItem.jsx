import React from "react";

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-gray-500">${item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdate(item._id, e.target.value)}
          className="w-16 border p-1 rounded text-center"
        />
        <button
          onClick={() => onRemove(item._id)}
          className="text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

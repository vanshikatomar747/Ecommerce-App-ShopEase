import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: Number,
    orderState: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "In Packing",
        "Ready to Dispatch",
        "Shipped",
        "Delivered",
      ],
      default: "Pending",
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Order", orderSchema);


import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js"; 

dotenv.config();


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eshop";

const products = [
  {
    name: "Men’s Cotton T-Shirt",
    description: "Soft and breathable cotton T-shirt perfect for daily wear.",
    price: 799,
    category: "Clothing",
    image:
      "https://www.cotstyle.com/cdn/shop/files/RN01_385134_S_Grey.jpg?v=1685104550",
  },
  {
    name: "Women's Summer Dress",
    description: "Lightweight floral dress perfect for warm days.",
    price: 1899,
    image: "https://m.media-amazon.com/images/I/81lo0TOJL9L._AC_UY1000_.jpg",
    category: "Clothing",
  },
  {
    name: "Women’s Denim Jacket",
    description: "Trendy cropped denim jacket for casual outings.",
    price: 1899,
    category: "Clothing",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxXlPQI7rRFyml4LT8AMnI2nBkhIj72Yxcrw&s",
  },
  {
    name: "Stylish Handbag",
    description: "Trendy leather handbag with spacious compartments",
    price: 2200,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    category: "Accessories",
  }, 
  {
    name: "Wall Clock",
    description: "Modern design clock for home decor",
    price: 899,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVn-SjWXtk7ApJe_qOjn_BbVHz4nk2Le-PA&s",
    category: "Home & Kitchen",
  },
  
  {
    name: "Running Shoes",
    description: "Lightweight and comfortable running shoes with strong grip.",
    price: 2499,
    category: "Footwear",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsYcbj-2jciMX3Zn0sk4GpYR6MvzfcO8CuYg&s",
  },
  {
    name: "Men's Sports Sandals",
    description: "Comfortable sandals designed for outdoor adventures.",
    price: 1399,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Vgh8OOaa8Vdxc52H5YBdx2Fd3w4L_GS5LQ&s",
    category: "Footwear",
  },
  {
    name: "Casual Sneakers",
    description: "Stylish white sneakers suitable for everyday wear.",
    price: 2199,
    category: "Footwear",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjq2ETYxercjy7-ST3R97-CmGc3HzlPa9CFw&s",
  },
  {
    name: "Wireless Earbuds",
    description: "Bluetooth 5.3 earbuds with noise cancellation and 24-hr battery.",
    price: 3499,
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT840ntEL0ItYAlqwWzdo0u6RRfqxriEQquyg&s",
  },
  {
    name: "Bluetooth Speaker",
    description: "Compact speaker with rich bass and 12-hour battery life.",
    price: 2999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8oT3yjGSbi2ydzhrLYCCHIta_1pbM4zC9WQ&s",
    category: "Electronics",
  },
  {
    name: "Smartwatch",
    description:
      "Track your health metrics and stay connected with this stylish smartwatch.",
    price: 4999,
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoiYB27SNAuqXDxYWCgOeKOlWecqV0zNLGpg&s",
  },
  {
    name: "Leather Wallet",
    description: "Premium handcrafted leather wallet with multiple card slots.",
    price: 1199,
    category: "Accessories",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxL4ZuRI9jVWFWon397cdTTe141hUXXncXwA&s",
  },
  {
    name: "Sunglasses",
    description: "UV-protected stylish aviator sunglasses with hard case.",
    price: 999,
    category: "Accessories",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYrTibJfRuubJjzwP8FU-5o8nwwNtiXrgkdw&s",
  },
  {
    name: "Non-Stick Frying Pan",
    description: "Durable 28 cm non-stick frying pan with heat-resistant handle.",
    price: 1599,
    category: "Home & Kitchen",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "Ceramic Dinner Set",
    description: "Beautiful 18-piece dinner set ideal for family meals.",
    price: 2599,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6y0aBwxyKFUaPzRdPq0e6Q6VX1O4fpNqSKQ&s",
    category: "Home & Kitchen",
  },
  {
    name: "Electric Kettle",
    description: "1.7 L stainless-steel kettle with auto shut-off and LED indicator.",
    price: 2199,
    category: "Home & Kitchen",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5_tQc3r2lxeN-z6vnBcOSfuMrCMn_xMhGMQ&s",
  },
  {
    name: "Flower Pot",
    description: "Cute flower pot with washable flowers",
    price: 199,
    category: "Home & Kitchen",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfOYDPaW1_ZWcCS9oXV7zqqtUKlK9oIFDltw&s",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.deleteMany();
    const res = await Product.insertMany(products);
    console.log(`Seeded ${res.length} products successfully.`);
    process.exit();
  } catch (err) {
    console.error(" Error seeding products:", err);
    process.exit(1);
  }
}

seed();

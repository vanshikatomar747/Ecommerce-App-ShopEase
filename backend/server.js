import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Make io accessible in all controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

//  Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

//  Connect MongoDB
connectDB();

//  Routes
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/orders", orderRoutes);


app.use("/api/orders", invoiceRoutes);

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send(" Server running with WebSocket + Email support!");
});


const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server running with WebSockets on port ${PORT}`);
});

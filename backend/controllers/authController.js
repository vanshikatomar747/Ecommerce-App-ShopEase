import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register request:", req.body);

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const allowedRoles = ["buyer", "seller", "admin"];
    const userRole = allowedRoles.includes(role) ? role : "buyer";

    // ⚠️ Do NOT hash manually — handled by schema pre-save
    const user = await User.create({ name, email, password, role: userRole });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(" Login attempt:", email);

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials (user not found)" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials (wrong password)" });

    const token = generateToken(user);

    res.status(200).json({
      message: `Login successful as ${user.role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Login Error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

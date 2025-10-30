import Product from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const { search, category, min, max } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (min || max) query.price = { $gte: min || 0, $lte: max || 100000 };

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

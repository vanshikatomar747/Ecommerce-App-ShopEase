import React, { useState, useEffect } from "react";
import { Filter, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function Home({ category, searchQuery, setCategory, setSearchQuery }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOrder, setSortOrder] = useState("");

  //  Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  //  Filtering Logic
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (category && category !== "") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery && searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort by price
    if (sortOrder === "lowToHigh") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "highToLow") result.sort((a, b) => b.price - a.price);

    setFiltered(result);
  }, [category, searchQuery, priceRange, sortOrder, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleClearFilters = () => {
    setCategory?.("");
    setSearchQuery?.("");
    setPriceRange([0, 50000]);
    setSortOrder("");
    setShowFilter(false);
    toast("Filters cleared", { icon: "🧹" });
  };

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="bg-white shadow-md border rounded-lg p-4 mb-6">
          {/* Price Range */}
          <div className="flex flex-col mb-3">
            <label className="font-medium text-gray-700 mb-1">Price Range:</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="border p-1 rounded w-20"
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="border p-1 rounded w-20"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col mb-3">
            <label className="font-medium text-gray-700 mb-1">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="">None</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilter(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
            >
              <XCircle className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md border rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2">{product.description}</p>
              <p className="font-semibold text-blue-600 mb-3">₹{product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

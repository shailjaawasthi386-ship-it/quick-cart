import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "All", label: "All Products" },
    { id: "Vegetables", label: "Vegetables" },
    { id: "Fruits", label: "Fruits" }
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center pt-10 px-4 md:px-0">
      {/* Header & Filter Controls */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            Fresh Fruits & Vegetables
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search vegetables & fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full py-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4 pb-10 w-full">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-500">
          <p className="text-4xl mb-2">🥬</p>
          <p className="text-base font-semibold">Koi sabzi ya phal nahi mila</p>
          <p className="text-xs text-gray-400 mt-1">Kripya koi doosra naam search karein.</p>
        </div>
      )}

      {/* See All Button */}
      <button
        onClick={() => {
          router.push('/all-products');
        }}
        className="px-10 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-full shadow-md active:scale-95 transition"
      >
        All Products →
      </button>
    </div>
  );
};

export default HomeProducts;

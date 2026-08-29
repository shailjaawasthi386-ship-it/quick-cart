'use client'
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
    const { products } = useAppContext();
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
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-24 pt-8">
                <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">Fresh Produce Catalog</h1>
                        <p className="text-xs md:text-sm text-emerald-700 font-bold mt-1">100% Direct Farm Sourced Daily</p>
                    </div>

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

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4 pb-14 w-full">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center w-full text-gray-500">
                        <p className="text-5xl mb-3">🥬</p>
                        <p className="text-lg font-bold">Koi item nahi mil paya</p>
                        <p className="text-xs text-gray-400 mt-1">Doosra search term try karein.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;

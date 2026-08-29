"use client"
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext, weightFactors } from "@/context/AppContext";
import React from "react";

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedWeight, setSelectedWeight] = useState("1kg");

    useEffect(() => {
        const product = products.find(p => p._id === id);
        if (product) {
            setProductData(product);
            if (product.weights && product.weights.length > 0) {
                setSelectedWeight(product.weights[0]);
            }
        }
    }, [id, products.length]);

    const availableWeights = productData?.weights || ["500g", "1kg", "2kg", "3kg", "4kg", "5kg", "6kg", "7kg", "8kg", "9kg", "10kg"];
    const factor = weightFactors[selectedWeight] || 1;
    const unitOfferPrice = productData ? Math.round(productData.offerPrice * factor) : 0;
    const unitPrice = productData ? Math.round(productData.price * factor) : 0;

    return productData ? (
      <>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-24 pt-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Product Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-2xl overflow-hidden bg-emerald-50/50 border border-emerald-100 p-4 shadow-sm flex items-center justify-center h-80 md:h-96">
                        <img
                            src={mainImage || productData.image[0]}
                            alt={productData.name}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>

                    {productData.image.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {productData.image.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className="cursor-pointer rounded-xl overflow-hidden border border-emerald-200 h-20 p-1 bg-white"
                                >
                                    <img
                                        src={image}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details & Actions */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {productData.category}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
                        {productData.name}
                    </h1>

                    {/* Weight Dropdown Menu */}
                    <div className="pt-2">
                        <label className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block mb-2">
                            Select Weight / Quantity Option (500g to 10kg):
                        </label>
                        <div className="relative max-w-sm">
                            <select
                                value={selectedWeight}
                                onChange={(e) => setSelectedWeight(e.target.value)}
                                className="w-full bg-emerald-50 text-emerald-950 border border-emerald-300 font-extrabold text-sm py-3 pl-4 pr-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm appearance-none"
                            >
                                {availableWeights.map((w) => {
                                    const wFactor = weightFactors[w] || 1;
                                    const wPrice = Math.round(productData.offerPrice * wFactor);
                                    return (
                                        <option key={w} value={w} className="bg-white text-gray-800 font-bold py-2">
                                            {w === "500g" ? "500 grams" : w} — ₹{wPrice}
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-800 font-bold text-sm">
                                ▼
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Pricing */}
                    <div className="flex items-baseline gap-3 pt-2">
                        <span className="text-3xl font-extrabold text-emerald-700">₹{unitOfferPrice}</span>
                        {unitPrice > unitOfferPrice && (
                            <span className="text-lg text-gray-400 line-through">₹{unitPrice}</span>
                        )}
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                            Selected Pack: {selectedWeight}
                        </span>
                    </div>

                    <hr className="border-emerald-100 my-2" />

                    {/* Quality Badges */}
                    <div className="grid grid-cols-3 gap-3 py-2 text-center">
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                            <span className="text-[11px] font-bold text-emerald-800">Fresh Farm Direct</span>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                            <span className="text-[11px] font-bold text-emerald-800">Fast Delivery</span>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                            <span className="text-[11px] font-bold text-emerald-800">Quality Checked</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button 
                            onClick={() => addToCart(productData._id, selectedWeight)} 
                            className="w-full py-4 bg-emerald-100 text-emerald-800 font-extrabold rounded-2xl hover:bg-emerald-200 transition text-sm shadow-sm active:scale-95"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => { addToCart(productData._id, selectedWeight); router.push('/cart') }} 
                            className="w-full py-4 bg-emerald-600 text-white font-extrabold rounded-2xl hover:bg-emerald-700 transition text-sm shadow-md active:scale-95"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="flex flex-col items-center pt-10 pb-16">
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-800">Similar Products</h2>
                    <div className="w-20 h-1 bg-emerald-600 rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                    {products.filter(p => p._id !== id).slice(0, 5).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;
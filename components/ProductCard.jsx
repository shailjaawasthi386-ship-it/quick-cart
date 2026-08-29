import React, { useState } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext, weightFactors } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { router, cartItems, addToCart, updateCartQuantity } = useAppContext();
    const availableWeights = product.weights || ["500g", "1kg", "2kg", "3kg", "4kg", "5kg", "6kg", "7kg", "8kg", "9kg", "10kg"];
    const [selectedWeight, setSelectedWeight] = useState(availableWeights[0]);
    const factor = weightFactors[selectedWeight] || 1;

    const unitOfferPrice = Math.round(product.offerPrice * factor);
    const unitPrice = Math.round(product.price * factor);
    const discountPercent = Math.round(((unitPrice - unitOfferPrice) / unitPrice) * 100);

    const cartKey = `${product._id}__${selectedWeight}`;
    const cartQty = cartItems[cartKey] || 0;

    return (
        <div className="flex flex-col items-start gap-1 w-full bg-white rounded-2xl p-3 border border-emerald-100 shadow-sm hover:shadow-md transition duration-300 relative group">
            {/* Product Image */}
            <div 
                onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
                className="cursor-pointer relative bg-emerald-50/50 rounded-xl w-full h-44 md:h-48 flex items-center justify-center overflow-hidden p-2"
            >
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-300 object-cover rounded-lg w-full h-full"
                    width={400}
                    height={400}
                />
            </div>

            {/* Product Title & Category */}
            <div className="w-full pt-1">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{product.category}</p>
                <h3 
                    onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
                    className="text-sm md:text-base font-bold text-gray-800 cursor-pointer hover:text-emerald-600 transition truncate"
                >
                    {product.name}
                </h3>
                <p className="w-full text-xs text-gray-500 truncate mt-0.5">{product.description}</p>
            </div>

            {/* Sleek Quantity / Weight Dropdown Menu */}
            <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
                <label className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                    Select Pack / Weight:
                </label>
                <div className="relative">
                    <select
                        value={selectedWeight}
                        onChange={(e) => setSelectedWeight(e.target.value)}
                        className="w-full appearance-none bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition shadow-sm"
                    >
                        {availableWeights.map((w) => {
                            const wFactor = weightFactors[w] || 1;
                            const wPrice = Math.round(product.offerPrice * wFactor);
                            return (
                                <option key={w} value={w} className="bg-white text-gray-800 font-bold py-1">
                                    {w === "500g" ? "500 grams" : w} — ₹{wPrice}
                                </option>
                            );
                        })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-emerald-700 font-bold text-xs">
                        ▼
                    </div>
                </div>
            </div>

            {/* Price & Add to Cart Action */}
            <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-gray-100">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-base md:text-lg font-extrabold text-emerald-700">₹{unitOfferPrice}</span>
                        {unitPrice > unitOfferPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{unitPrice}</span>
                        )}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-bold">Unit: {selectedWeight}</p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    {cartQty === 0 ? (
                        <button 
                            onClick={() => addToCart(product._id, selectedWeight)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md active:scale-95 transition flex items-center gap-1"
                        >
                            <span>ADD</span>
                            <span className="text-sm leading-none">+</span>
                        </button>
                    ) : (
                        <div className="flex items-center bg-emerald-600 text-white rounded-xl px-2.5 py-1.5 gap-2.5 shadow-md">
                            <button 
                                onClick={() => updateCartQuantity(cartKey, cartQty - 1)}
                                className="text-xs font-extrabold hover:text-emerald-200"
                            >
                                -
                            </button>
                            <span className="text-xs font-extrabold">{cartQty}</span>
                            <button 
                                onClick={() => addToCart(product._id, selectedWeight)}
                                className="text-xs font-extrabold hover:text-emerald-200"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard
'use client'
import React from "react";
import OrderSummary from "@/components/OrderSummary";
import Navbar from "@/components/Navbar";
import { useAppContext, weightFactors } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();
  const cartKeys = Object.keys(cartItems).filter(key => cartItems[key] > 0);

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-24 pt-10 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 border-b border-emerald-100 pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <span>Your Cart</span>
              <span className="text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                {getCartCount()} Packs
              </span>
            </h1>
          </div>

          {cartKeys.length > 0 ? (
            <div className="overflow-x-auto bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
              <table className="min-w-full table-auto">
                <thead className="text-left border-b border-emerald-100 text-xs uppercase font-extrabold text-emerald-800">
                  <tr>
                    <th className="pb-4 px-2">Item & Pack</th>
                    <th className="pb-4 px-2">Unit Price</th>
                    <th className="pb-4 px-2">Packs (Qty)</th>
                    <th className="pb-4 px-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {cartKeys.map((cartKey) => {
                    const [realId, weight = "1kg"] = cartKey.split("__");
                    const product = products.find(p => p._id === realId);
                    if (!product) return null;

                    const factor = weightFactors[weight] || 1;
                    const unitPrice = Math.round(product.offerPrice * factor);
                    const subtotal = Math.round(unitPrice * cartItems[cartKey]);

                    return (
                      <tr key={cartKey} className="hover:bg-emerald-50/40 transition">
                        <td className="py-4 px-2 flex items-center gap-3">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-emerald-200"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                Pack: {weight === "500g" ? "500 grams" : weight}
                              </span>
                              <span className="text-[11px] text-gray-500 font-medium">
                                ({product.category})
                              </span>
                            </div>
                            <button
                              className="block text-xs text-rose-600 font-bold mt-1 hover:underline"
                              onClick={() => updateCartQuantity(cartKey, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-2 font-bold text-emerald-800">
                          ₹{unitPrice}
                        </td>

                        <td className="py-4 px-2">
                          <div className="flex items-center bg-emerald-600 text-white rounded-xl px-2.5 py-1 gap-3 w-fit shadow-sm">
                            <button
                              className="font-extrabold text-sm hover:text-emerald-200"
                              onClick={() => updateCartQuantity(cartKey, cartItems[cartKey] - 1)}
                            >
                              -
                            </button>
                            <span className="font-extrabold text-xs">{cartItems[cartKey]}</span>
                            <button
                              className="font-extrabold text-sm hover:text-emerald-200"
                              onClick={() => addToCart(cartKey)}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-2 font-extrabold text-emerald-900">
                          ₹{subtotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <p className="text-[40px] mb-3">🛒</p>
              <p className="text-lg font-bold text-gray-800">Your cart is currently empty!</p>
              <p className="text-xs text-gray-500 mt-1">Add fresh vegetables and fruits to get started.</p>
              <button
                onClick={() => router.push('/all-products')}
                className="mt-5 px-8 py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-md hover:bg-emerald-700 transition"
              >
                Start Shopping
              </button>
            </div>
          )}

          <button
            onClick={() => router.push('/all-products')}
            className="flex items-center mt-6 gap-2 text-emerald-700 font-bold text-xs hover:text-emerald-900 transition"
          >
            ← Continue Shopping
          </button>
        </div>

        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;

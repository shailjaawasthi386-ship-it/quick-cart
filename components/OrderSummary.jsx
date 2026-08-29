import { useAppContext, weightFactors } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { router, getCartCount, getCartAmount, addresses, cartItems, products, placeOrder } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleCreateOrder = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to place your order!");
      openSignIn();
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select or add a delivery address!");
      return;
    }

    // Build order items array from cart state
    const orderItems = [];
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [realId, weight = "1kg"] = key.split("__");
        const productInfo = products.find((p) => p._id === realId);
        if (productInfo) {
          const factor = weightFactors[weight] || 1;
          const unitPrice = Math.round(productInfo.offerPrice * factor);
          orderItems.push({
            product: productInfo,
            weight: weight,
            quantity: cartItems[key],
            price: unitPrice,
            total: unitPrice * cartItems[key]
          });
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const totalAmount = getCartAmount();
    const tax = Math.round(totalAmount * 0.02);
    const grandTotal = totalAmount + tax;

    const customerDetails = {
      name: user?.fullName || selectedAddress.fullName || "Customer",
      email: user?.primaryEmailAddress?.emailAddress || "",
      clerkId: user?.id || ""
    };

    placeOrder({
      customer: customerDetails,
      address: selectedAddress,
      items: orderItems,
      amount: grandTotal,
      subtotal: totalAmount,
      tax: tax
    });
  };

  const totalAmount = getCartAmount();
  const tax = Math.round(totalAmount * 0.02);
  const grandTotal = totalAmount + tax;

  return (
    <div className="w-full md:w-96 bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800">Order Summary</h2>
      </div>

      <hr className="border-emerald-100 my-4" />

      <div className="space-y-5">
        {/* Address Dropdown */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
            Delivery Address:
          </label>
          <div className="relative inline-block w-full text-xs">
            <button
              className="peer w-full text-left px-3.5 py-2.5 bg-white text-gray-800 border border-emerald-200 rounded-xl focus:outline-none flex items-center justify-between font-semibold shadow-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                  : "Select Address"}
              </span>
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border border-emerald-200 rounded-xl shadow-lg mt-1 z-20 py-1 font-medium max-h-56 overflow-y-auto">
                {addresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-3.5 py-2.5 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 flex flex-col"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <span className="font-bold text-gray-800">{address.fullName} ({address.phoneNumber})</span>
                    <span className="text-[11px] text-gray-500 truncate">{address.area}, {address.city} - {address.pincode}</span>
                    {address.coordinates && (
                      <span className="text-[10px] text-emerald-600 font-bold">📍 GPS Pin Captured</span>
                    )}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-3.5 py-2.5 text-emerald-700 hover:bg-emerald-50 cursor-pointer text-center font-bold"
                >
                  + Add New Delivery Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-emerald-100 my-4" />

        {/* Cost Breakdown */}
        <div className="space-y-3 text-xs md:text-sm font-semibold">
          <div className="flex justify-between text-gray-600">
            <p>Total Items ({getCartCount()})</p>
            <p className="text-gray-900">₹{totalAmount}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Delivery Fee</p>
            <p className="text-emerald-700 font-bold">₹0</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Govt. Tax & Packaging</p>
            <p className="text-gray-900">₹{tax}</p>
          </div>
          <div className="flex justify-between text-base font-extrabold border-t border-emerald-200 pt-3 text-emerald-950">
            <p>Grand Total</p>
            <p className="text-emerald-700">₹{grandTotal}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleCreateOrder} 
        className="w-full bg-emerald-600 text-white font-extrabold py-3.5 mt-6 rounded-xl hover:bg-emerald-700 active:scale-95 shadow-md transition text-sm flex items-center justify-center gap-2"
      >
        <span>Place Order Now</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default OrderSummary;
'use client';
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";

const Orders = () => {
    const { currency, orders } = useAppContext();

    const forwardToWhatsApp = (order) => {
        const itemsText = order.items?.map(
            (item) => `• ${item.product.name} (${item.weight}) x ${item.quantity} = ₹${item.total}`
        ).join("\n") || "";

        const gpsLink = order.address?.coordinates
            ? `https://www.google.com/maps?q=${order.address.coordinates.lat},${order.address.coordinates.lng}`
            : "No GPS captured";

        const messageText = `🛒 *QUICKCART DELIVERY ORDER*
----------------------------------
🆔 *Order ID:* #${order._id}
👤 *Customer:* ${order.address?.fullName || order.customer?.name}
📞 *Customer Phone:* ${order.address?.phoneNumber}
📍 *Delivery Address:* ${order.address?.area}, ${order.address?.city} - ${order.address?.pincode}
🗺️ *Google Maps Pin:* ${gpsLink}

📦 *ITEMS TO PACK:*
${itemsText}

----------------------------------
💰 *COLLECT CASH (COD): ₹${order.amount}*
----------------------------------`;

        const encodedMsg = encodeURIComponent(messageText);
        window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
    };

    return (
        <div className="flex-1 min-h-screen overflow-y-auto flex flex-col justify-between text-sm bg-gray-50/50">
            <div className="p-4 md:p-8 space-y-6 max-w-5xl">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800">Store Orders Manager</h1>
                        <p className="text-xs text-emerald-700 font-bold mt-1">Live customer orders & delivery locations</p>
                    </div>
                    <span className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm">
                        {orders.length} Active Orders
                    </span>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-emerald-100 text-center space-y-2 shadow-sm">
                        <p className="text-3xl">📦</p>
                        <p className="font-bold text-gray-800">No active customer orders yet.</p>
                        <p className="text-xs text-gray-500">Orders placed by customers will appear here in real-time.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div key={index} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg">
                                            Order #{order._id}
                                        </span>
                                        <span className="text-xs text-gray-500 font-semibold">
                                            {order.formattedDate || new Date(order.date).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="bg-amber-400 text-emerald-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase shadow-sm">
                                        {order.status || "Order Placed"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    {/* Items Purchased */}
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                                        <p className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px]">Items Ordered ({order.items?.length}):</p>
                                        <ul className="space-y-1 text-gray-800">
                                            {order.items?.map((item, idx) => (
                                                <li key={idx} className="flex justify-between font-medium">
                                                    <span>• {item.product.name} ({item.weight}) x {item.quantity}</span>
                                                    <span className="font-bold">₹{item.total}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Customer & Address */}
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
                                        <p className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px]">Customer & Address:</p>
                                        <p className="font-bold text-gray-900 text-sm">{order.address?.fullName || order.customer?.name}</p>
                                        <p className="font-bold text-emerald-700">📞 {order.address?.phoneNumber}</p>
                                        <p className="text-gray-600 leading-relaxed">{order.address?.area}, {order.address?.city} - {order.address?.pincode}</p>
                                        
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {order.address?.coordinates && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${order.address.coordinates.lat},${order.address.coordinates.lng}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition"
                                                >
                                                    <span>📍 Google Maps Pin</span>
                                                    <span>↗</span>
                                                </a>
                                            )}
                                            <button
                                                onClick={() => forwardToWhatsApp(order)}
                                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition"
                                            >
                                                <span>💬 Share via WhatsApp</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Value & Payment */}
                                    <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-col justify-between">
                                        <div>
                                            <p className="text-emerald-200 text-[11px] uppercase tracking-wider font-extrabold">Total Collectable:</p>
                                            <p className="text-2xl font-extrabold mt-1 text-amber-300">{currency}{order.amount}</p>
                                        </div>
                                        <div className="pt-2 text-[11px] text-emerald-200 border-t border-emerald-800">
                                            <p>Payment Mode: <b>Cash on Delivery (COD)</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
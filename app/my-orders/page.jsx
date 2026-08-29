'use client';
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const MyOrders = () => {
    const { currency, orders } = useAppContext();

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-4 md:px-16 lg:px-24 py-8 min-h-[80vh]">
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                        <h1 className="text-2xl font-extrabold text-gray-800">My Orders</h1>
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
                            {orders.length} Placed
                        </span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-3">
                            <p className="text-4xl">📦</p>
                            <p className="text-base font-bold text-gray-800">No orders placed yet.</p>
                            <p className="text-xs text-gray-500">Order fresh vegetables and fruits to see them listed here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                                                #{order._id}
                                            </span>
                                            <span className="text-xs text-gray-500 font-semibold">
                                                {order.formattedDate || new Date(order.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] font-extrabold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase">
                                                {order.status || "Order Placed"}
                                            </span>
                                        </div>

                                        <div className="text-xs space-y-1 text-gray-700">
                                            <p className="font-bold text-sm text-gray-800">
                                                {order.items?.map((item) => `${item.product.name} (${item.weight}) x ${item.quantity}`).join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-xs space-y-1 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 min-w-48">
                                        <p className="font-bold text-gray-800">Deliver To:</p>
                                        <p className="font-semibold">{order.address?.fullName} ({order.address?.phoneNumber})</p>
                                        <p>{order.address?.area}, {order.address?.city} - {order.address?.pincode}</p>
                                        {order.address?.coordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${order.address.coordinates.lat},${order.address.coordinates.lng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block mt-1 text-[11px] font-extrabold text-emerald-700 underline"
                                            >
                                                📍 View Google Maps Pin ↗
                                            </a>
                                        )}
                                    </div>

                                    <div className="text-right flex md:flex-col justify-between items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                                        <span className="text-lg font-extrabold text-emerald-700">
                                            {currency}{order.amount}
                                        </span>
                                        <span className="text-[11px] text-gray-500 font-semibold">Payment: COD</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;
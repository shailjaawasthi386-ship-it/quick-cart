'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const AddAddress = () => {
    const { addAddress, router } = useAppContext();
    const [detecting, setDetecting] = useState(false);

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
        coordinates: null,
    });

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setDetecting(true);
        toast.loading("Detecting your location...", { id: "geo" });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    
                    const addr = data.address || {};
                    const detectedArea = addr.suburb || addr.neighbourhood || addr.road || addr.residential || "";
                    const detectedCity = addr.city || addr.town || addr.district || addr.county || "";
                    const detectedState = addr.state || "";
                    const detectedPincode = addr.postcode || "";

                    setAddress((prev) => ({
                        ...prev,
                        area: detectedArea || prev.area,
                        city: detectedCity || prev.city,
                        state: detectedState || prev.state,
                        pincode: detectedPincode || prev.pincode,
                        coordinates: { lat: latitude, lng: longitude }
                    }));

                    toast.success("Location detected successfully!", { id: "geo" });
                } catch (err) {
                    toast.error("Could not fetch location address details.", { id: "geo" });
                    setAddress((prev) => ({
                        ...prev,
                        coordinates: { lat: latitude, lng: longitude }
                    }));
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                setDetecting(false);
                toast.error("Location permission denied or unavailable.", { id: "geo" });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!address.fullName || !address.phoneNumber || !address.area || !address.city || !address.pincode) {
            toast.error("Please fill in all required fields!");
            return;
        }

        addAddress(address);
        router.push('/cart');
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-12 flex flex-col md:flex-row justify-between items-start gap-10">
                <form onSubmit={onSubmitHandler} className="w-full max-w-lg bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                        <h1 className="text-2xl font-extrabold text-gray-800">
                            Add Shipping <span className="text-emerald-700">Address</span>
                        </h1>
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={detecting}
                            className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition shadow-sm flex items-center gap-1.5"
                        >
                            <span>🎯</span>
                            <span>{detecting ? "Detecting..." : "Detect GPS Location"}</span>
                        </button>
                    </div>

                    {address.coordinates && (
                        <div className="p-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center justify-between">
                            <span>📍 GPS Location Captured: {address.coordinates.lat.toFixed(4)}, {address.coordinates.lng.toFixed(4)}</span>
                            <a
                                href={`https://www.google.com/maps?q=${address.coordinates.lat},${address.coordinates.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline font-extrabold text-emerald-700"
                            >
                                View on Map
                            </a>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Full Name *</label>
                            <input
                                className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                value={address.fullName}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Phone Number *</label>
                            <input
                                className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                type="text"
                                placeholder="e.g. +91 9876543210"
                                onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                                value={address.phoneNumber}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Pincode *</label>
                            <input
                                className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                type="text"
                                placeholder="e.g. 110001"
                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                value={address.pincode}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Street Address / House No. / Area *</label>
                            <textarea
                                className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition resize-none"
                                rows={3}
                                placeholder="e.g. House No. 42, Block B, Main Road"
                                onChange={(e) => setAddress({ ...address, area: e.target.value })}
                                value={address.area}
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">City / Town *</label>
                                <input
                                    className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                    type="text"
                                    placeholder="e.g. New Delhi"
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    value={address.city}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 block mb-1">State *</label>
                                <input
                                    className="px-3.5 py-2.5 bg-gray-50 border border-emerald-200 rounded-xl outline-none w-full text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                    type="text"
                                    placeholder="e.g. Delhi"
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                    value={address.state}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl shadow-md hover:bg-emerald-700 transition uppercase tracking-wider text-sm active:scale-95"
                    >
                        Save Shipping Address
                    </button>
                </form>

                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50/60 rounded-3xl border border-emerald-100 max-w-sm text-center">
                    <Image
                        className="w-48 h-auto mb-4"
                        src={assets.my_location_image}
                        alt="my_location_image"
                    />
                    <h3 className="font-extrabold text-gray-800 text-base">Fast & Accurate Delivery</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Use the <b>Detect GPS Location</b> button for one-click address completion and pin accuracy.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;
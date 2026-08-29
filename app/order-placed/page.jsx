'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useEffect, useRef } from 'react'

const OrderPlaced = () => {
  const { latestOrder, router } = useAppContext()
  const hasTriggeredRef = useRef(false);

  const storePhone = "918278776764"; // Primary store WhatsApp number

  const sendWhatsAppNotification = () => {
    if (!latestOrder) return;

    const itemsText = latestOrder.items?.map(
      (item) => `• ${item.product.name} (${item.weight}) x ${item.quantity} = ₹${item.total}`
    ).join("\n") || "";

    const gpsLink = latestOrder.address?.coordinates
      ? `https://www.google.com/maps?q=${latestOrder.address.coordinates.lat},${latestOrder.address.coordinates.lng}`
      : "No GPS captured";

    const messageText = `🛒 *NEW ORDER PLACED ON QUICKCART!*
----------------------------------
🆔 *Order ID:* #${latestOrder._id}
📅 *Date:* ${latestOrder.formattedDate || new Date().toLocaleString()}

👤 *Customer:* ${latestOrder.address?.fullName || latestOrder.customer?.name}
📞 *Phone:* ${latestOrder.address?.phoneNumber}
📍 *Address:* ${latestOrder.address?.area}, ${latestOrder.address?.city} - ${latestOrder.address?.pincode}
🗺️ *Google Maps Pin:* ${gpsLink}

📦 *ITEMS ORDERED:*
${itemsText}

----------------------------------
💰 *TOTAL AMOUNT (COD): ₹${latestOrder.amount}*
----------------------------------`;

    const encodedMsg = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  // Automatically open WhatsApp on page load when latestOrder is ready
  useEffect(() => {
    if (latestOrder && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      // Slight timeout to let user see confirmation screen before auto opening
      const timer = setTimeout(() => {
        sendWhatsAppNotification();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [latestOrder]);

  return (
    <>
      <Navbar />
      <div className='min-h-[80vh] flex flex-col justify-center items-center px-4 py-12'>
        <div className="bg-white border border-emerald-100 shadow-xl rounded-3xl p-8 max-w-lg w-full text-center space-y-6">
          <div className="flex justify-center items-center relative mx-auto">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-full shadow-inner text-4xl">
              ✅
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Order Placed Successfully!</h1>
            <p className="text-xs text-emerald-700 font-bold mt-1">Automatic WhatsApp notification sent to Store (+91 8278776764).</p>
          </div>

          {latestOrder && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 text-left text-xs space-y-3">
              <div className="flex justify-between font-bold text-gray-800 border-b border-emerald-200 pb-2">
                <span>Order ID: #{latestOrder._id}</span>
                <span className="text-emerald-700">{latestOrder.formattedDate}</span>
              </div>

              <div>
                <p className="font-extrabold text-gray-700 uppercase tracking-wider mb-1">Delivering To:</p>
                <p className="font-bold text-gray-800">{latestOrder.address?.fullName} ({latestOrder.address?.phoneNumber})</p>
                <p className="text-gray-600">{latestOrder.address?.area}, {latestOrder.address?.city} - {latestOrder.address?.pincode}</p>
                {latestOrder.address?.coordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${latestOrder.address.coordinates.lat},${latestOrder.address.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-emerald-700 font-extrabold underline"
                  >
                    📍 Open GPS Pin in Google Maps ↗
                  </a>
                )}
              </div>

              <div className="border-t border-emerald-200 pt-2">
                <p className="font-extrabold text-gray-700 uppercase tracking-wider mb-1">Items ({latestOrder.items?.length}):</p>
                <ul className="space-y-1 text-gray-700">
                  {latestOrder.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>• {item.product.name} ({item.weight}) x {item.quantity}</span>
                      <span className="font-bold">₹{item.total}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-emerald-200 pt-2 flex justify-between font-extrabold text-sm text-emerald-950">
                <span>Grand Total (COD):</span>
                <span className="text-emerald-700">₹{latestOrder.amount}</span>
              </div>
            </div>
          )}

          {/* WhatsApp Action Button */}
          <button
            onClick={sendWhatsAppNotification}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
          >
            <span>💬 Send Order Details to WhatsApp (+918278776764)</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => router.push('/my-orders')}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push('/all-products')}
              className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs rounded-xl transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderPlaced
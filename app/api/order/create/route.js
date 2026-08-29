import connectDB from "@/config/db";
import Order from "@/models/Order";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function sendCallMeBotWhatsAppAlert(order) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const phone = process.env.CALLMEBOT_PHONE || "918278776764";

  if (!apiKey) {
    console.log("CallMeBot API Key not set yet. Skipping background WhatsApp notification.");
    return;
  }

  const itemsText = order.items?.map(
    (item) => `• ${item.product?.name || 'Item'} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}`
  ).join("\n");

  const gpsLink = order.address?.coordinates
    ? `https://www.google.com/maps?q=${order.address.coordinates.lat},${order.address.coordinates.lng}`
    : "No GPS captured";

  const messageText = `🛒 *NEW ORDER PLACED ON QUICKCART!*
----------------------------------
🆔 *Order ID:* #${order._id}
👤 *Customer:* ${order.address?.fullName}
📞 *Phone:* ${order.address?.phoneNumber}
📍 *Address:* ${order.address?.area}, ${order.address?.city} - ${order.address?.pincode}
🗺️ *Google Maps Pin:* ${gpsLink}

📦 *ITEMS ORDERED:*
${itemsText}

----------------------------------
💰 *TOTAL AMOUNT (COD): ₹${order.amount}*
----------------------------------`;

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(messageText)}&apikey=${apiKey}`;
    await fetch(url);
    console.log("CallMeBot background WhatsApp alert sent successfully!");
  } catch (err) {
    console.error("CallMeBot WhatsApp notification error:", err);
  }
}

export async function POST(request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const body = await request.json();
        const { address, items, amount } = body;

        if (!address || !items || items.length === 0 || !amount) {
            return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
        }

        await connectDB();

        const newOrder = await Order.create({
            userId,
            customer: {
                name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : address.fullName,
                email: user?.emailAddresses?.[0]?.emailAddress || ""
            },
            items,
            amount,
            address,
            status: "Order Placed",
            date: Date.now()
        });

        // Trigger background CallMeBot WhatsApp alert to store manager
        sendCallMeBotWhatsAppAlert(newOrder).catch((err) => console.error(err));

        return NextResponse.json({ success: true, message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

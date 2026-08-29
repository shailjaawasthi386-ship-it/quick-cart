import connectDB from "@/config/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = await auth();
        await connectDB();

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const orders = await Order.find({ userId }).sort({ date: -1 });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

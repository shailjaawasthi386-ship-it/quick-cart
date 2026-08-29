import connectDB from "@/config/db";
import Address from "@/models/Address";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = await auth();
        await connectDB();

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const addresses = await Address.find({ userId });
        return NextResponse.json({ success: true, addresses });
    } catch (error) {
        console.error("List addresses error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

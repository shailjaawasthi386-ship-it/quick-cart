import connectDB from "@/config/db";
import Address from "@/models/Address";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, phoneNumber, pincode, area, city, state, coordinates } = body;

        if (!fullName || !phoneNumber || !area || !city || !pincode) {
            return NextResponse.json({ success: false, message: "Missing address fields" }, { status: 400 });
        }

        await connectDB();

        const newAddress = await Address.create({
            userId,
            fullName,
            phoneNumber,
            pincode,
            area,
            city,
            state,
            coordinates
        });

        return NextResponse.json({ success: true, message: "Address added successfully", address: newAddress });
    } catch (error) {
        console.error("Add address error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb"
import receipt from "@/app/models/receipt";

export async function POST(req: Request) {
    try {
        await connect()
        const data = await req.json();
        
        const Receipt = new receipt({
            ...data,
            createdAt: new Date(),
        });

        await Receipt.save();
        return NextResponse.json({
            success: true,
            Receipt
        })
    } catch (error) {
        console.error("{Receipt error}, error");
        return NextResponse.json({ success: false, error: "Failed to save Receipt" }, { status: 500 });
    }
}

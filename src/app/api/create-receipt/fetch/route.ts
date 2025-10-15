import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import receipt from "@/app/models/receipt";

export async function GET() {
    try {
        await connect();
        const Receipt = await receipt.find().sort({createdat: -1});
        return NextResponse.json({success: true, Receipt})
    } catch (error) {
        console.error("[Id fetching error]", error);
        return NextResponse.json({success: false, error: "failed to fetch Receipt"},
            {status: 500}
        );
    }
}
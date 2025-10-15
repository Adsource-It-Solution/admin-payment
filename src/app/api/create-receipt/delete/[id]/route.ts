import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import receipt from "@/app/models/receipt";

export async function DELETE(req: Request, {params}: {params: {id: string}} ){
    try {
        await connect();
        await receipt.findByIdAndDelete(params.id)
        return NextResponse.json({
            success: true,
            receipt
        })
    } catch (error) {
        console.log("[delete ID error", error)
        return NextResponse.json({
            success: false, receipt
        })
    }
}
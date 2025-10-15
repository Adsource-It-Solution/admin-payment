import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import receipt from "@/app/models/receipt";

export async function PUT(req: Request, {params}: {params: {receiptid:string}}){
    try {
        await connect();
        const data = req.json();
        const receiptid = await receipt.findByIdAndUpdate(params.receiptid, data, {new: true});
        return NextResponse.json({ success: true, Receipt: receiptid });
    } catch (error) {
        console.error("[update Receipt error]", error);
        return NextResponse.json({
            success: false,
            receipt
        })
    }
}
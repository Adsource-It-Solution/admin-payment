import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import createid from "@/app/models/createid";

export async function DELETE(req: Request, {params}: {params: {id: string}} ){
    try {
        await connect();
        await createid.findByIdAndDelete(params.id)
        return NextResponse.json({
            success: true,
            createid
        })
    } catch (error) {
        console.log("[delete ID error", error)
        return NextResponse.json({
            success: false, createid
        })
    }
}
import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import createid from "@/app/models/createid";

export async function PUT(req: Request, {params}: {params: {id:string}}){
    try {
        await connect();
        const data = req.json();
        const id = await createid.findByIdAndUpdate(params.id, data, {new: true});
        return NextResponse.json({ success: true, createId: id });
    } catch (error) {
        console.error("[update error]", error);
        return NextResponse.json({
            success: false,
            createid
        })
    }
}
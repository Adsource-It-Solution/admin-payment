import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb"
import createid from "@/app/models/createid";

export async function POST(req: Request) {
    try {
        await connect()
        const data = await req.json();
        
        const createId = new createid({
            ...data,
            createdAt: new Date(),
        });

        await createId.save();
        return NextResponse.json({
            success: true,
            createId
        })
    } catch (error) {
        console.error("{createId error}, error");
        return NextResponse.json({ success: false, error: "Failed to save ID card" }, { status: 500 });
    }
}

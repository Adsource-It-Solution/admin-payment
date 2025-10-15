import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import createid from "@/app/models/createid";

export async function GET() {
    try {
        await connect();
        const createId = await createid.find().sort({createdat: -1});
        return NextResponse.json({success: true, createId})
    } catch (error) {
        console.error("[Id fetching error]", error);
        return NextResponse.json({success: false, error: "failed to fetch CreateId"},
            {status: 500}
        );
    }
}
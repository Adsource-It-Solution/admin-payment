import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect();
    const data = await req.json();
    const cert = await Certificate.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json({ success: true, certificate: cert });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

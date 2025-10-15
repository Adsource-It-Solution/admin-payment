import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect();
    await Certificate.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}

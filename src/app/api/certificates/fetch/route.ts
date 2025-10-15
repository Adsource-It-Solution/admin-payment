import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

export async function GET() {
  try {
    await connect();
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, certificates });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

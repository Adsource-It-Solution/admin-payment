import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await connect();
    const certificates = await Certificate.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error("[fetchCertificates Error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

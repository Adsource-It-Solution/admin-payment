import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();

    const certificate = new Certificate({
      ...data,
      createdAt: new Date(),
    });

    await certificate.save();
    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("API save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save certificate" }, { status: 500 });
  }
}

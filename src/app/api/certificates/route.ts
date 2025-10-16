import { NextResponse, type NextRequest } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";

// 🧠 GET all certificates
export async function GET() {
  try {
    await connect();
    const certificates = await Certificate.find();
    return NextResponse.json({ success: true, data: certificates });
  } catch (error) {
    console.error("[GET all certificates error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// 🧠 POST new certificate
export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();

    const newCertificate = await Certificate.create(body);

    return NextResponse.json(
      { success: true, message: "Certificate created", data: newCertificate },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST certificate error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to create certificate" },
      { status: 500 }
    );
  }
}

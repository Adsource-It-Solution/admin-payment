import { NextResponse, type NextRequest } from "next/server";
import connect from "@/app/lib/mongodb";
import Certificate, { type ICertificate } from "@/app/models/certificate";

/* ----------------------------------------------
   🧩 Response type helper
---------------------------------------------- */
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/* ----------------------------------------------
   🧠 GET /api/certificates/[id]
---------------------------------------------- */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ correct new typing for Next.js 15
): Promise<NextResponse<ApiResponse<ICertificate>>> {
  const { id } = await params; // ✅ must await since params is now async in 15+

  try {
    await connect();
    const certificate = await Certificate.findById(id).lean<ICertificate | null>();

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: certificate });
  } catch (error) {
    console.error("[GET single certificate error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch certificate" },
      { status: 500 }
    );
  }
}

/* ----------------------------------------------
   🧠 PUT /api/certificates/[id]
---------------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ICertificate>>> {
  const { id } = await params;

  try {
    await connect();
    const body = (await req.json()) as Partial<ICertificate>;

    const updated = await Certificate.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean<ICertificate | null>();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Certificate updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[PUT certificate error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

/* ----------------------------------------------
   🧠 DELETE /api/certificates/[id]
---------------------------------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ICertificate>>> {
  const { id } = await params;

  try {
    await connect();
    const deleted = await Certificate.findByIdAndDelete(id).lean<ICertificate | null>();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("[DELETE certificate error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}

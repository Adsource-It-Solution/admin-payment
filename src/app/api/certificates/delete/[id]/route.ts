import connect from "@/app/lib/mongodb";
import Certificate from "@/app/models/certificate";
import { NextResponse, type NextRequest } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    const deleted = await Certificate.findByIdAndDelete(params.id);

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
      { success: false, message: "Server error while deleting certificate" },
      { status: 500 }
    );
  }
}

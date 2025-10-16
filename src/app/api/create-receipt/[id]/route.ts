import { NextResponse, type NextRequest } from "next/server";
import connect from "@/app/lib/mongodb";
import Receipt from "@/app/models/receipt";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connect();
    const certificate = await Receipt.findById(id);

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

// 🧠 PUT update certificate
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connect();
    const body = await req.json();

    const updated = await Receipt.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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

// 🧠 DELETE certificate
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await connect();
    const deleted = await Receipt.findByIdAndDelete(id);

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

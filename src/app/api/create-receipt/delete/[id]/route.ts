import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import Receipt from "@/app/models/receipt";

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    await connect();
    const deleted = await Receipt.findByIdAndDelete(context.params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Receipt deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("[DELETE receipt error]", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting receipt" },
      { status: 500 }
    );
  }
}

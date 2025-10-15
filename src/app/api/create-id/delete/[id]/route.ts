import { NextResponse } from "next/server";
import connect from "@/app/lib/mongodb";
import CreateID from "@/app/models/createid";

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    await connect();
    const deleted = await CreateID.findByIdAndDelete(context.params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ID deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("[DELETE createid error]", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting ID" },
      { status: 500 }
    );
  }
}

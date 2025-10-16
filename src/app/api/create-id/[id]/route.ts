import { NextResponse, type NextRequest } from "next/server";
import connect from "@/app/lib/mongodb";
import CreateId, { type ICreateId } from "@/app/models/createid";

/* ----------------------------------------------
   🧩 Response type helper
---------------------------------------------- */
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/* ----------------------------------------------
   🧠 GET /api/createid/[id]
---------------------------------------------- */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Next 15 signature
): Promise<NextResponse<ApiResponse<ICreateId>>> {
  const { id } = await params;

  try {
    await connect();
    const record = await CreateId.findById(id).lean<ICreateId | null>();

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("[GET single record error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

/* ----------------------------------------------
   🧠 PUT /api/createid/[id]
---------------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ICreateId>>> {
  const { id } = await params;

  try {
    await connect();
    const body = (await req.json()) as Partial<ICreateId>;

    const updated = await CreateId.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean<ICreateId | null>();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Record updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[PUT record error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update record" },
      { status: 500 }
    );
  }
}

/* ----------------------------------------------
   🧠 DELETE /api/createid/[id]
---------------------------------------------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ICreateId>>> {
  const { id } = await params;

  try {
    await connect();
    const deleted = await CreateId.findByIdAndDelete(id).lean<ICreateId | null>();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("[DELETE record error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete record" },
      { status: 500 }
    );
  }
}

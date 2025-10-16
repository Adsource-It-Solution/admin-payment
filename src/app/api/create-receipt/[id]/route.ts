import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import connect from "@/app/lib/mongodb";
import Receipt, { type IReceipt } from "@/app/models/receipt";

/**
 * GET /api/receipt/[id]
 * Fetch a single receipt by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    const receipt: IReceipt | null = await Receipt.findById(id);

    if (!receipt) {
      return NextResponse.json(
        { success: false, message: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: receipt });
  } catch (error) {
    console.error("[GET receipt error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch receipt" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/receipt/[id]
 * Update a receipt
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();
    const body: Partial<IReceipt> = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    const updated: IReceipt | null = await Receipt.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Receipt updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[PUT receipt error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update receipt" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/receipt/[id]
 * Delete a receipt
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid receipt ID" },
        { status: 400 }
      );
    }

    const deleted: IReceipt | null = await Receipt.findByIdAndDelete(id);

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
      { success: false, message: "Failed to delete receipt" },
      { status: 500 }
    );
  }
}

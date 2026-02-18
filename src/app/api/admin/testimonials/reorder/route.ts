import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

// PUT /api/admin/testimonials/reorder - Bulk update display order
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "items array is required" },
        { status: 400 }
      );
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; displayOrder: number }) =>
        prisma.testimonial.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering testimonials:", error);
    return NextResponse.json(
      { error: "Failed to reorder testimonials" },
      { status: 500 }
    );
  }
}

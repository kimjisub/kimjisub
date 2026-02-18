import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session?.value) return false;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const decoded = Buffer.from(session.value, "base64").toString();
    const [, storedPassword] = decoded.split(":");
    return storedPassword === adminPassword;
  } catch {
    return false;
  }
}

// GET /api/admin/testimonials - 모든 추천사 (관리자용)
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/testimonials - 추천사 상태 변경
export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, displayOrder } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/testimonials
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

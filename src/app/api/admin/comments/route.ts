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

// GET /api/admin/comments - 모든 댓글 (관리자용)
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { parentId: null },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/comments - 댓글 승인/숨김 토글
export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isApproved } = await request.json();

    if (!id || isApproved === undefined) {
      return NextResponse.json(
        { error: "id and isApproved are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/comments
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

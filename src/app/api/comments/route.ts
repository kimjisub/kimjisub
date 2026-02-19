import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/comments - 댓글 작성
export async function POST(request: NextRequest) {
  try {
    const { postSlug, parentId, authorName, authorEmail, content } =
      await request.json();

    if (!postSlug || !authorName || !content) {
      return NextResponse.json(
        { error: "postSlug, authorName, and content are required" },
        { status: 400 }
      );
    }

    // 대댓글인 경우 부모 댓글 존재 확인
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parent || parent.postSlug !== postSlug) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postSlug,
        parentId: parentId || null,
        authorName,
        authorEmail: authorEmail || null,
        content,
        isApproved: true, // 기본 공개
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// GET /api/comments?postSlug=xxx - 댓글 목록
export async function GET(request: NextRequest) {
  try {
    const postSlug = request.nextUrl.searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json(
        { error: "postSlug is required" },
        { status: 400 }
      );
    }

    // 최상위 댓글만 조회 (대댓글은 replies로 포함)
    const comments = await prisma.comment.findMany({
      where: {
        postSlug,
        parentId: null,
        isApproved: true,
      },
      include: {
        replies: {
          where: { isApproved: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // authorEmail 제거 (공개하지 않음)
    type CommentWithReplies = typeof comments[number];
    type Reply = CommentWithReplies['replies'][number];
    const sanitized = comments.map((c: CommentWithReplies) => ({
      ...c,
      authorEmail: undefined,
      replies: c.replies.map((r: Reply) => ({ ...r, authorEmail: undefined })),
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

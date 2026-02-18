import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/reactions - 좋아요 토글
export async function POST(request: NextRequest) {
  try {
    const { contentType, contentSlug, fingerprint } = await request.json();

    if (!contentType || !contentSlug || !fingerprint) {
      return NextResponse.json(
        { error: "contentType, contentSlug, and fingerprint are required" },
        { status: 400 }
      );
    }

    // 이미 좋아요 했는지 확인
    const existing = await prisma.reaction.findUnique({
      where: {
        contentType_contentSlug_fingerprint: {
          contentType,
          contentSlug,
          fingerprint,
        },
      },
    });

    let liked: boolean;

    if (existing) {
      // 이미 있으면 삭제 (좋아요 취소)
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      liked = false;
    } else {
      // 없으면 생성 (좋아요)
      await prisma.reaction.create({
        data: { contentType, contentSlug, fingerprint },
      });
      liked = true;
    }

    // 총 좋아요 수
    const count = await prisma.reaction.count({
      where: { contentType, contentSlug },
    });

    return NextResponse.json({ liked, count });
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

// GET /api/reactions?contentType=xxx&contentSlug=xxx&fingerprint=xxx
export async function GET(request: NextRequest) {
  try {
    const contentType = request.nextUrl.searchParams.get("contentType");
    const contentSlug = request.nextUrl.searchParams.get("contentSlug");
    const fingerprint = request.nextUrl.searchParams.get("fingerprint");

    if (!contentType || !contentSlug) {
      return NextResponse.json(
        { error: "contentType and contentSlug are required" },
        { status: 400 }
      );
    }

    // 총 좋아요 수
    const count = await prisma.reaction.count({
      where: { contentType, contentSlug },
    });

    // 내가 좋아요 했는지
    let liked = false;
    if (fingerprint) {
      const existing = await prisma.reaction.findUnique({
        where: {
          contentType_contentSlug_fingerprint: {
            contentType,
            contentSlug,
            fingerprint,
          },
        },
      });
      liked = !!existing;
    }

    return NextResponse.json({ count, liked });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

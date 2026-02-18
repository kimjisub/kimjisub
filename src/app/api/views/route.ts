import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/views - 조회수 기록
export async function POST(request: NextRequest) {
  try {
    const { slug, fingerprint } = await request.json();

    if (!slug || !fingerprint) {
      return NextResponse.json(
        { error: "slug and fingerprint are required" },
        { status: 400 }
      );
    }

    // upsert: 이미 있으면 무시, 없으면 생성
    await prisma.pageView.upsert({
      where: {
        slug_fingerprint: { slug, fingerprint },
      },
      update: {}, // 이미 존재하면 아무것도 안 함
      create: { slug, fingerprint },
    });

    // 해당 slug의 총 조회수 반환
    const count = await prisma.pageView.count({
      where: { slug },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error recording page view:", error);
    return NextResponse.json(
      { error: "Failed to record page view" },
      { status: 500 }
    );
  }
}

// GET /api/views?slug=xxx - 조회수 조회
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    const count = await prisma.pageView.count({
      where: { slug },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching page views:", error);
    return NextResponse.json(
      { error: "Failed to fetch page views" },
      { status: 500 }
    );
  }
}

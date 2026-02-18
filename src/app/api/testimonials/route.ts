import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/testimonials - 추천사 제출
export async function POST(request: NextRequest) {
  try {
    const {
      authorName,
      authorTitle,
      authorCompany,
      authorEmail,
      authorUrl,
      content,
      relationship,
    } = await request.json();

    if (!authorName || !content) {
      return NextResponse.json(
        { error: "authorName and content are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        authorName,
        authorTitle: authorTitle || null,
        authorCompany: authorCompany || null,
        authorEmail: authorEmail || null, // 비공개 저장
        authorUrl: authorUrl || null,
        content,
        relationship: relationship || null,
        status: "PENDING", // 검토 대기
      },
    });

    return NextResponse.json(
      { id: testimonial.id, message: "Testimonial submitted for review" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}

// GET /api/testimonials - 승인된 추천사 목록
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        authorName: true,
        authorTitle: true,
        authorCompany: true,
        authorUrl: true,
        content: true,
        relationship: true,
        displayOrder: true,
        createdAt: true,
        // authorEmail 제외 (비공개)
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
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

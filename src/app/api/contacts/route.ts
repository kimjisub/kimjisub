import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/contacts - 컨택 폼 제출
export async function POST(request: NextRequest) {
  try {
    const { name, email, company, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    // 간단한 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 메타데이터 수집
    const userAgent = request.headers.get("user-agent") || null;
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || null;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        company: company || null,
        subject: subject || null,
        message,
        userAgent,
        ipAddress,
      },
    });

    return NextResponse.json(
      { id: contact.id, message: "Contact submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to submit contact" },
      { status: 500 }
    );
  }
}

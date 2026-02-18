import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // 이메일 검증
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 메타데이터
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0].trim() || undefined;

    // 이미 구독 중인지 확인
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return NextResponse.json(
          { message: '이미 구독 중입니다! 🎉', alreadySubscribed: true },
          { status: 200 }
        );
      }
      
      // 구독 취소했던 사용자가 다시 구독
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          status: 'ACTIVE',
          unsubscribedAt: null,
          source: source || existing.source,
          userAgent,
          ipAddress,
        },
      });

      return NextResponse.json(
        { message: '다시 구독해주셔서 감사합니다! 🙌', resubscribed: true },
        { status: 200 }
      );
    }

    // 새 구독자 생성
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        source: source || 'footer',
        userAgent,
        ipAddress,
      },
    });

    return NextResponse.json(
      { message: '구독 완료! 새 소식을 전해드릴게요 ✨', subscribed: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Newsletter Subscribe Error]', error);
    return NextResponse.json(
      { error: '구독 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

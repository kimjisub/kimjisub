import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '유효하지 않은 링크입니다.' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: '구독 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'UNSUBSCRIBED') {
      return NextResponse.json(
        { message: '이미 구독 취소되었습니다.' },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    });

    // HTML 응답으로 친절한 페이지 표시
    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>구독 취소 완료</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0F172A;
      color: #E2E8F0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 { color: #22C55E; margin-bottom: 1rem; }
    p { color: #94A3B8; }
    a {
      color: #22C55E;
      text-decoration: none;
      margin-top: 2rem;
      display: inline-block;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>구독 취소 완료 👋</h1>
    <p>더 이상 뉴스레터를 받지 않습니다.</p>
    <p>마음이 바뀌시면 언제든 다시 구독해주세요!</p>
    <a href="/">← 홈으로 돌아가기</a>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('[Newsletter Unsubscribe Error]', error);
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

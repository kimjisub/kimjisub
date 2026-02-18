import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/admin-auth';

// GET: List all newsletter subscribers
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  return NextResponse.json(subscribers);
}

// PATCH: Update subscriber status
export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const subscriber = await prisma.newsletterSubscriber.update({
    where: { id },
    data: {
      status,
      unsubscribedAt: status === 'UNSUBSCRIBED' ? new Date() : null,
    },
  });

  return NextResponse.json(subscriber);
}

// DELETE: Remove subscriber
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await prisma.newsletterSubscriber.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

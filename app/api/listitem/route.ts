import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const items = await prisma.listItem.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.listItem.count();

  return NextResponse.json({ items }, {
    headers: {
      'X-Total-Count': total.toString(),
    },
  });
}

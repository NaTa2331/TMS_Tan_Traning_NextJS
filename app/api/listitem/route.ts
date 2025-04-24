import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
  return NextResponse.json({ error: 'Invalid page or limit' }, { status: 400 });
}

  const search = searchParams.get('search') || '';

  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }
    : {};

  try {
    console.log('Fetching items with params:', { page, limit, search });
    
    const [items, total] = await Promise.all([
      prisma.listItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.listItem.count({ where }),
    ]);

    console.log('Fetched items:', items);
    console.log('Total items:', total);

    return NextResponse.json(
      { items },
      {
        headers: {
          'X-Total-Count': total.toString(),
        },
      }
    );
  } catch (error:any) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error.message },
      { status: 500 }
    );
  }
}

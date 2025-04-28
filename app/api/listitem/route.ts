import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const whereClause = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, userId } = body;

    const newItem = await prisma.listItem.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') || '');

  if (!id) {
    return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
  }

  try {
    await prisma.listItem.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

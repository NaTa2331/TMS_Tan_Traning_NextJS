import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: get List items (inclue search and pagination)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '9', 10);
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;
  const [items, totalItems] = await Promise.all([
    prisma.listItem.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.listItem.count({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    }),
  ]);

  const response = NextResponse.json({ items });
  response.headers.set('X-Total-Count', totalItems.toString());

  return response;
}

// POST: Tạo mới 1 item
export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, userId } = body;

  if (!title || !description || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const newItem = await prisma.listItem.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return NextResponse.json(newItem);
}

// DELETE: Xóa 1 item
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await prisma.listItem.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: 'Item deleted' });
}

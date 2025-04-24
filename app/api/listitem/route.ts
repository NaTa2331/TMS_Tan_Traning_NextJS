import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all items with optional pagination and search
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search') || '';
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '9');
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.listItem.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listItem.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    const response = NextResponse.json(items);
    response.headers.set('X-Total-Count', total.toString());
    return response;
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST - Add new item
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    const newItem = await prisma.listItem.create({
      data: { title, description },
    });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

// PUT - Update item
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description } = await request.json();
    const updated = await prisma.listItem.update({
      where: { id },
      data: { title, description },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE - Remove item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    await prisma.listItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

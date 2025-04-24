import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '9');
    const offset = (page - 1) * limit;
    const search = request.nextUrl.searchParams.get('search') || '';

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
        orderBy: { id: 'desc' }
      }),
      prisma.listItem.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      })
    ]);

    const response = NextResponse.json(items);
    response.headers.set('X-Total-Count', total.toString());
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newItem = await prisma.listItem.create({
      data: {
        title: body.title,
        description: body.description
      }
    });
    return NextResponse.json(newItem);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description } = await request.json();

    const updatedItem = await prisma.listItem.update({
      where: { id },
      data: { title, description }
    });

    return NextResponse.json(updatedItem);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(new URL(request.url).searchParams.get('id') || '0');

    await prisma.listItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

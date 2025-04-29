import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: get List items (include search and pagination)
export async function GET(req: Request) {
  try {
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

    const response = NextResponse.json({ 
      success: true,
      data: items
    });
    response.headers.set('X-Total-Count', totalItems.toString());
    return response;
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items', success: false },
      { status: 500 }
    );
  }
}

// POST: create new item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, userId } = body;

    if (!title || !description || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const newItem = await prisma.listItem.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json({ data: newItem, success: true });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item', success: false },
      { status: 500 }
    );
  }
}

// DELETE: delete 1 item
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id', success: false },
        { status: 400 }
      );
    }

    const itemExists = await prisma.listItem.findUnique({
      where: { id: Number(id) },
    });

    if (!itemExists) {
      return NextResponse.json(
        { error: 'Item not found', success: false },
        { status: 404 }
      );
    }

    await prisma.listItem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Item deleted successfully', success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item', success: false },
      { status: 500 }
    );
  }
}

// PUT: Update item
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, userId } = body;

    if (!id || !title || !description || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const existingItem = await prisma.listItem.findUnique({
      where: { id: Number(id) }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found', success: false },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        userId
      }
    });

    return NextResponse.json({ data: updatedItem, success: true });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update item', success: false },
      { status: 500 }
    );
  }
}
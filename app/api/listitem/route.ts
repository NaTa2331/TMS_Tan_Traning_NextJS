import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET: list items with search + pagination
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
          title: { contains: search, mode: 'insensitive' },
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: { user: true }, // để lấy cả tên người tạo
      }),
      prisma.listItem.count({
        where: {
          title: { contains: search, mode: 'insensitive' },
        },
      }),
    ]);

    const response = NextResponse.json({ success: true, data: items });
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

// POST: create item
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required', success: false },
        { status: 400 }
      );
    }

    const item = await prisma.listItem.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
      include: { user: true },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item', success: false },
      { status: 500 }
    );
  }
}

// DELETE: delete item by id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id', success: false }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    const item = await prisma.listItem.findUnique({ 
      where: { id: Number(id) },
      include: { user: true }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found', success: false }, { status: 404 });
    }

    // Check authentication
    if (item.userId !== session.user.id) {
      return NextResponse.json({ error: 'You do not have permission to delete this item', success: false }, { status: 403 });
    }

    // Delete item
    await prisma.listItem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Item deleted', success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete item', success: false }, { status: 500 });
  }
}

// PUT: update item
export async function PUT(req: Request) {
  try {
    const { id, title, description } = await req.json();
    if (!id || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const existingItem = await prisma.listItem.findUnique({ where: { id: Number(id) } });
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found', success: false }, { status: 404 });
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: Number(id) },
      data: { title, description },
    });

    return NextResponse.json({ data: updatedItem, success: true });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update item', success: false }, { status: 500 });
  }
}

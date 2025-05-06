import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Get user profile
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    // First try to get user from database
    const user = await prisma.user_account.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // If user not found in database, create new user with session data
    if (!user) {
      const newUser = await prisma.user_account.create({
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image || null, // Set to null if image is not provided
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
      return NextResponse.json({ success: true, data: newUser });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('GET User Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data', success: false },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { name, image } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', success: false },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user_account.update({
      where: { id: session.user.id },
      data: {
        name,
        image: image || null, // Set to null if image is not provided
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('PUT User Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user data', success: false },
      { status: 500 }
    );
  }
}
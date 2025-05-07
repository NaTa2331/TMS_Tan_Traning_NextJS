import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (await prisma.user_account.findUnique({
      where: {
        email_provider: {
          email,
          provider: "credentials"
        }
      }
    })) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user_account.create({
      data: {
        name,
        email,
        hashedPassword,
        provider: "credentials"
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công'
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return NextResponse.json(
      { message: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
}
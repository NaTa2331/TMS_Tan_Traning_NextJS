import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await prisma.user_account.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await prisma.user_account.create({
      data: {
        name,
        email,
        hashedPassword
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
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    console.log('Email from request:', email);

    // Kiểm tra email tồn tại
    const user = await prisma.user_account.findUnique({
      where: { email },
    });

    console.log('User found:', user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email không tồn tại'
        },
        { status: 401 }
      );
    }

    // So sánh mật khẩu đã hash
    const isValidPassword = await compare(password, user.hashedPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu không chính xác'
        },
        { status: 401 }
      );
    }

    // Tạo token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng nhập'
      },
      { status: 500 }
    );
  }
}

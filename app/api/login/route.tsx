import { NextResponse } from 'next/server';
import { z } from 'zod';
import LoginForm from '@/components/LoginForm';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Validation thành công, nhưng vì chưa có database
    // nên chúng ta sẽ trả về lỗi demo
    return NextResponse.json(
      {
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      },
      { status: 401 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false,
          message: 'Đã xảy ra lỗi'
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export default function Page() {
  return <LoginForm />;
}

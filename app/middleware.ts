import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.includes('/logout')) {
      return NextResponse.redirect(new URL('/api/auth/signout', req.url));
    }
    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard',
    '/images',
    '/listitem',
  ],
  public: [
    '/register',
    '/login',
    '/'
  ],
};
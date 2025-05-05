import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
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
    '/register',
    '/login',
  ],
  public: [
    '/register',
    '/login',
  ],
};
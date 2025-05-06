import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user_account.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.hashedPassword) {
            throw new Error("Invalid email or password");
          }

          const isCorrectPassword = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("An error occurred during authentication");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent" },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { prompt: "consent" },
      },
    }),
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        if (!token.email) {
          throw new Error('Email is required for Google login');
        }

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await prisma.user_account.findUnique({
          where: { email: token.email }
        });

        if (!existingUser) {
          // Tạo tài khoản mới nếu chưa tồn tại
          const newUser = await prisma.user_account.create({
            data: {
              name: token.name || 'User',
              email: token.email,
              // Không cần hashedPassword vì đây là tài khoản Google
            }
          });
          token.id = newUser.id;
        } else {
          // Cập nhật thông tin nếu người dùng đã tồn tại
          token.id = existingUser.id;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      try {
        const targetUrl = new URL(url, baseUrl);
        return targetUrl.toString();
      } catch (err) {
        return baseUrl;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
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
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
          allow_signup: "true"
        }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent"
        }
      }
    }),
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
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        console.log('Account:', account);
        console.log('User:', user);
        console.log('Token:', token);

        // Sử dụng ID GitHub làm email nếu không có email
        const email = account.provider === 'github' && !user?.email 
          ? `github_${account.providerAccountId}` 
          : user?.email || token.email;

        console.log('Determined email:', email);

        // Nếu là GitHub và email đã tồn tại, tạo ID duy nhất
        if (account.provider === 'github') {
          const existingUser = await prisma.user_account.findUnique({
            where: { 
              email: email 
            }
          });

          if (existingUser) {
            // Nếu email đã tồn tại, tạo ID duy nhất cho GitHub
            const githubId = `github_${user.id}`;
            const existingGithubUser = await prisma.user_account.findUnique({
              where: { 
                email: githubId 
              }
            });

            if (!existingGithubUser) {
              const newUser = await prisma.user_account.create({
                data: {
                  name: user?.name || token.name || 'User',
                  email: githubId,
                  hashedPassword: null
                }
              });
              token.id = newUser.id;
              return token;
            } else {
              token.id = existingGithubUser.id;
              return token;
            }
          }
        }

        if (!email) {
          throw new Error('Email is required for OAuth login');
        }

        const existingUser = await prisma.user_account.findUnique({
          where: { 
            email: email 
          }
        });

        if (!existingUser) {
          console.log('Creating new user...');
          const newUser = await prisma.user_account.create({
            data: {
              name: user?.name || token.name || 'User',
              email: email,
              hashedPassword: null
            }
          });
          console.log('New user created:', newUser);
          token.id = newUser.id;
        } else {
          console.log('Using existing user:', existingUser);
          token.id = existingUser.id;
        }
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const targetUrl = new URL(url, baseUrl);
        return targetUrl.toString();
      } catch {
        return baseUrl;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
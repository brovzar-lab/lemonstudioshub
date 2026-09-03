import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: { hd: "lemonfilms.com" },
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.hd || profile.hd !== "lemonfilms.com") return false;
      return true;
    },
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      session.user.id = user.id;
      session.user.role = (dbUser?.role ?? "DEV_TEAM") as Role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

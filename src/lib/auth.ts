import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/index";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      // If the callback is relative, add it to the baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If the callback is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default redirect to /app
      return `${baseUrl}/app`;
    },
  },
};

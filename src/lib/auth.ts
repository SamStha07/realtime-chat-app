import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import upstashRedisClient from '@upstash/redis';
import { db } from './db';

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  console.log(
    '🚀 ~ file: auth.ts:10 ~ getGoogleCredentials ~ clientId:',
    clientId
  );
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // if (clientId || clientId?.length === 0) {
  //   throw new Error('Missing GOOGLE_CLIENT_ID');
  // }
  // if (clientSecret || clientSecret?.length === 0) {
  //   throw new Error('Missing GOOGLE_CLIENT_SECRET');
  // }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId!,
      clientSecret: getGoogleCredentials().clientSecret!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null; // User type is defined in file db.d.ts
      // const dbUser = await db.get(`user:${token.email}`);

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // ts errors are gone because we added ts in file next.auth.d.ts
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
};

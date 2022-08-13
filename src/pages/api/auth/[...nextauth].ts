import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    debug: true,
    session: {
        strategy: 'database',
        maxAge: 60 * 60 * 24, // 24 hours
    },
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        EmailProvider({
            server: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                // auth: {
                //     user: process.env.SMTP_USER,
                //     pass: process.env.SMTP_PASS,
                // },
            },
            from: process.env.SMTP_FROM,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile, isNewUser }) {
            // console.log(`token:${JSON.stringify(token)}`);
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            if (token) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    theme: {
        colorScheme: 'auto', // "auto" | "dark" | "light"
        brandColor: '#d14655', // Hex color code
        logo: '/vercel.svg', // Absolute URL to image
        buttonText: '#d14655', // Hex color code
    },
};

export default NextAuth(authOptions);

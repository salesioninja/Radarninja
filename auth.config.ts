import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      phone?: string | null
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    id?: string
    role?: string
    phone?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    id?: string
    phone?: string | null
  }
}

// Esse arquivo contém APENAS a configuração que funciona na "Edge" (Vercel Middleware)
// Ele NÃO pode importar o banco de dados diretamente.
export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // No Middleware, essa função não é chamada diretamente para validar o login,
        // mas o CredentialsProvider precisa estar definido aqui para a tipagem do NextAuth.
        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig

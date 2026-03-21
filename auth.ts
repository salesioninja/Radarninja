import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./src/db"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "./src/db/schema"
import { eq } from "drizzle-orm"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    id?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    id?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Conta Ninja",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "mestre@ninja.com" },
        role: { label: "Tipo de Conta (USER ou BUSINESS)", type: "text", placeholder: "BUSINESS" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const email = credentials.email as string;
        const role = (credentials.role as "USER" | "BUSINESS") || "USER";

        const existingUsers = await db.select().from(users).where(eq(users.email, email));
        let user = existingUsers[0];

        if (!user) {
          const [newUser] = await db.insert(users).values({
            email,
            role,
            name: email.split("@")[0],
          }).returning();
          user = newUser;
        } else if (user.role !== role) {
           const [updated] = await db.update(users).set({ role }).where(eq(users.id, user.id)).returning();
           user = updated;
        }

        return { id: user.id!, email: user.email, name: user.name, role: user.role! };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})

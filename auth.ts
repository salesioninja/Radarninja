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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Conta Ninja",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "mestre@ninja.com" },
        password: { label: "Senha", type: "password", placeholder: "Sua senha secreta" },
        role: { label: "Tipo de Conta (USER, BUSINESS ou ADMIN)", type: "text", placeholder: "BUSINESS" },
        phone: { label: "Telefone/WhatsApp", type: "text", placeholder: "4699999999" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const email = credentials.email as string;
        const password = credentials.password as string;

        const existingUsers = await db.select().from(users).where(eq(users.email, email));

        const user = existingUsers[0];

        if (!user) {
          throw new Error("Usuário não encontrado. Por favor, cadastre-se primeiro.");
        }

        // Se o usuário tem senha no banco, verifica. Se não tem (usuários antigos), 
        // permite o login sem senha por enquanto, mas num cenário real exigiria resetar/definir senha.
        if (user.password && password) {
          const bcrypt = require('bcryptjs'); // Usando require para não afetar o build edge se não usado
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Senha incorreta.");
          }
        } else if (user.password && !password) {
          throw new Error("Senha obrigatória para esta conta.");
        }

        // O Mestre Ninja: Auto-promoção no Login Exclusiva
        let finalRole = user.role!;
        const isAdminEmail = email.toLowerCase() === 'admin@acessaronline.com.br';

        if (isAdminEmail && finalRole !== 'ADMIN') {
          // Promove a conta específica para ADMIN
          await db.update(users).set({ role: 'ADMIN' }).where(eq(users.id, user.id!));
          finalRole = 'ADMIN';
        } else if (!isAdminEmail && finalRole === 'ADMIN') {
          // Garante que NENHUM outro email tenha acesso de ADMIN
          // Rebaixa para USER caso algum outro email tenha ganho a role indevidamente
          await db.update(users).set({ role: 'USER' }).where(eq(users.id, user.id!));
          finalRole = 'USER';
        }

        return { 
          id: user.id!, 
          email: user.email, 
          name: user.name, 
          role: finalRole, 
          phone: user.phone 
        };
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
})


/**
 * Padrão: Authorized Action Wrapper
 * Encapsula a lógica de segurança e tipagem para as Server Actions.
 */
export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code: number };

export function authenticatedAction<TArgs, TResult>(
  options: { requiredRole?: "USER" | "BUSINESS" | "ADMIN" },
  action: (args: TArgs, user: { id: string; role: string }) => Promise<TResult>
) {
  return async (args: TArgs): Promise<ActionResponse<TResult>> => {
    try {
      const session = await auth();

      if (!session?.user) {
        return { success: false, error: "Unauthorized", code: 401 };
      }

      if (options.requiredRole && session.user.role !== options.requiredRole) {
        return { success: false, error: "Forbidden: Acesso Ninja negado.", code: 403 };
      }

      const result = await action(args, session.user as { id: string; role: string });
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Action Error:", error);
      return { success: false, error: error.message || "Internal Server Error", code: 500 };
    }
  };
}


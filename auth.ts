import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./src/db"
import { users } from "./src/db/schema"
import { eq } from "drizzle-orm"
import { authConfig } from "./auth.config"
import CredentialsProvider from "next-auth/providers/credentials"
import "next-auth/jwt"

// Re-adicionando o CredentialsProvider com a lógica de Banco de Dados (SÓ PARA NODE.JS)
const providersWithDb = [
  CredentialsProvider({
    name: "Conta Ninja",
    credentials: {
      email: { label: "E-mail", type: "email", placeholder: "mestre@ninja.com" },
      password: { label: "Senha", type: "password", placeholder: "Sua senha secreta" },
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

      if (user.password && password) {
        const bcrypt = require('bcryptjs');
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Senha incorreta.");
        }
      } else if (user.password && !password) {
        throw new Error("Senha obrigatória para esta conta.");
      }

      let finalRole = user.role!;
      const isAdminEmail = email.toLowerCase() === 'admin@acessaronline.com.br';

      if (isAdminEmail && finalRole !== 'ADMIN') {
        await db.update(users).set({ role: 'ADMIN' }).where(eq(users.id, user.id!));
        finalRole = 'ADMIN';
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
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: providersWithDb,
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


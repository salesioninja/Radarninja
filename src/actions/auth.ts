'use server';

import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export type RegisterResponse = 
  | { success: true; user: any }
  | { success: false; error: string };

export async function registerAction({ name, email, phone, role, password }: { name: string; email: string; phone: string; role: string; password?: string }): Promise<RegisterResponse> {
  try {
    // Verificar se já existe
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { success: false, error: 'E-mail já cadastrado.' };
    }

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    let userRole = role;
    // O Mestre Ninja: Superuser Check
    if (email.toLowerCase() === 'admin@acessaronline.com.br') {
      userRole = 'ADMIN';
    } else if (userRole === 'ADMIN') {
      // Impede tentativas forjadas de se cadastrar como ADMIN
      userRole = 'USER';
    }

    const [newUser] = await db.insert(users).values({
      name,
      email,
      phone,
      role: userRole as "USER" | "BUSINESS" | "ADMIN",
      password: hashedPassword,
    }).returning();

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: 'Erro ao realizar cadastro.' };
  }
}

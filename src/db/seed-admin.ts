import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const email = 'admin@acessaronline.com.br';
  const plainPassword = 'admin'; // Senha pedida / temporária

  console.log(`[SEED] Criando ou atualizando admin: ${email}...`);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length > 0) {
      await db.update(users).set({
        role: 'ADMIN',
        password: hashedPassword,
      }).where(eq(users.email, email));
      console.log('[SEED] Administrador existente atualizado com sucesso.');
    } else {
      await db.insert(users).values({
        name: 'Mestre Ninja',
        email,
        phone: '00000000000',
        role: 'ADMIN',
        password: hashedPassword,
      });
      console.log('[SEED] Novo administrador criado com sucesso.');
    }
  } catch (error) {
    console.error('[SEED] Erro ao criar administrador:', error);
  }
}

seedAdmin();

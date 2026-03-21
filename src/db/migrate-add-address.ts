/**
 * Migration script: adds address and phone columns to businesses table.
 * Safe to run even if columns already exist (checks first).
 */
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const client = createClient({ url: process.env.DB_URL || 'file:./local.db' });

async function migrate() {
  console.log('⚙️  Adicionando colunas address e phone...');

  // SQLite does not support ADD COLUMN IF NOT EXISTS – we check first
  const cols = await client.execute(`PRAGMA table_info(businesses)`);
  const existing = cols.rows.map((r: any) => r[1] as string);

  if (!existing.includes('address')) {
    await client.execute(`ALTER TABLE businesses ADD COLUMN address TEXT`);
    console.log('✅ Coluna address adicionada.');
  } else {
    console.log('ℹ️  Coluna address já existe.');
  }

  if (!existing.includes('phone')) {
    await client.execute(`ALTER TABLE businesses ADD COLUMN phone TEXT`);
    console.log('✅ Coluna phone adicionada.');
  } else {
    console.log('ℹ️  Coluna phone já existe.');
  }

  console.log('🎉 Migração concluída!\n');
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });

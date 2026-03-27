/**
 * LÓGICA DE BANCO DE DADOS: drizzle.config.ts
 * 
 * Define de onde o Drizzle-Kit vai ler nossos schemas para criar as Migrations.
 */
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite', // Em dev, usamos SQLite (via libSQL). Em prod, trocaremos para `mysql`
  dbCredentials: {
    url: process.env.DB_URL || 'file:./local.db',
  },
});

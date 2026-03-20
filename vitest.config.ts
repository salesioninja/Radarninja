/**
 * LÓGICA DE CONFIGURAÇÃO: vitest.config.ts
 * 
 * Por que Vitest e não Jest?
 * R: Vitest é extremamente rápido em watch mode, traz suporte nativo ao TypeScript e ESM para Next.js 15, 
 * eliminando a necessidade de transpilação extra (Babel/SWC) apenas para compilar testes base do core.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

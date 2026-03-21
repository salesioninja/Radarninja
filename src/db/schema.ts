/**
 * LÓGICA DE DADOS: schema.ts
 * 
 * Por que Drizzle ORM?
 * R: Ele oferece tipagem end-to-end, sintaxe SQL-like transparente (o que facilita
 * migrar de SQLite local para MySQL no Hostinger depois) e zero overhead arquitetural.
 * O TypeScript nos protegerá de queries incorretas.
 */

import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccountType } from "next-auth/adapters";

// Identidades Auth.js
export const users = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text("role", { enum: ["USER", "BUSINESS"] }).default("USER"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// Entidade (Antiga): Estabelecimentos locais que o BUSINESS pode possuir
export const businesses = sqliteTable('businesses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Entidade: Missões Ocultas espalhadas geograficamente
export const offers = sqliteTable('offers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').notNull().references(() => businesses.id),
  title: text('title').notNull(),
  description: text('description'),
  rewardPoints: integer('reward_points').default(100), // Poder Ninja ganho
  expiresAt: text('expires_at'), // Quando a missão some do radar
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

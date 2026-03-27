import { mysqlTable, varchar, int, timestamp, text, primaryKey, real, json } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccountType } from "next-auth/adapters";

// Identidades Auth.js
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { enum: ["USER", "BUSINESS", "ADMIN"], length: 50 }).default("USER"),
  phone: varchar("phone", { length: 50 }),
  password: varchar("password", { length: 255 }),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<AdapterAccountType>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// Entidade: Estabelecimentos locais que o BUSINESS pode possuir
export const businesses = mysqlTable('businesses', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }),
  longDescription: text('long_description'),
  n8nEndpointUrl: varchar('n8n_endpoint_url', { length: 1024 }),
  logoUrl: varchar('logo_url', { length: 1024 }),
  address: varchar('address', { length: 512 }),
  phone: varchar('phone', { length: 50 }),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Entidade: Missões Ocultas espalhadas geograficamente
export const offers = mysqlTable('offers', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: varchar('business_id', { length: 255 }).notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 1024 }),
  products: json('products').$type<{ name: string; price: number; image?: string; link?: string; buttonText?: string }[]>(),
  rewardPoints: int('reward_points').default(100),
  expiresAt: varchar('expires_at', { length: 50 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Inscrições Web Push
export const pushSubscriptions = mysqlTable('push_subscriptions', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  endpoint: varchar('endpoint', { length: 1024 }).notNull(),
  p256dh: varchar('p256dh', { length: 255 }).notNull(),
  auth: varchar('auth', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

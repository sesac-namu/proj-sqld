import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const verificationsTable = pgTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type Verification = typeof verificationsTable.$inferSelect;
export type VerificationCreate = typeof verificationsTable.$inferInsert;

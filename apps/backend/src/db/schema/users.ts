import { integer, pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
});

export type User = typeof usersTable.$inferSelect;
export type UserCreate = typeof usersTable.$inferInsert;

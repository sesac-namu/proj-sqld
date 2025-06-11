import { sql } from "drizzle-orm";
import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "./users";

export const test = mysqlTable("test", {
  id: int("id").primaryKey().autoincrement(),
  score: int("score"),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  finishedAt: datetime("finished_at"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

export type Test = typeof test.$inferSelect;
export type TestInsert = typeof test.$inferInsert;

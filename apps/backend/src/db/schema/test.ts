import { sql } from "drizzle-orm";
import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { user } from "./users";

export const test = mysqlTable("test", {
  id: int().primaryKey().autoincrement(),
  score: int(),
  createdAt: datetime()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  finishedAt: datetime(),
  userId: varchar({ length: 36 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

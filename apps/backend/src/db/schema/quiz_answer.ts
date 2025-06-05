import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";

export const quizAnswer = mysqlTable("quiz_answer", {
  quizId: int()
    .notNull()
    .primaryKey()
    .references(() => quiz.id),
  answer: int().notNull().primaryKey(),
});

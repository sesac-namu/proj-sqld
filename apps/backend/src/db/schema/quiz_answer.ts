import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";

export const quizAnswer = mysqlTable("quiz_answer", {
  quizId: int("quiz_id")
    .notNull()
    .primaryKey()
    .references(() => quiz.id),
  answer: int("answer").notNull().primaryKey(),
});

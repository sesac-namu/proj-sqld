import { boolean, datetime, int, mysqlTable } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";
import { test } from "./test";

export const testQuiz = mysqlTable("test_quiz", {
  id: int("id").primaryKey().autoincrement(),
  testId: int("test_id")
    .notNull()
    .references(() => test.id, {
      onDelete: "cascade",
    }),
  quizId: int("quiz_id")
    .notNull()
    .references(() => quiz.id, {
      onDelete: "cascade",
    }),
  quizNumber: int("quiz_number"),
  solvedAt: datetime("solved_at"),
  correct: boolean("correct"),
});

export type TestQuiz = typeof testQuiz.$inferSelect;
export type TestQuizInsert = typeof testQuiz.$inferInsert;

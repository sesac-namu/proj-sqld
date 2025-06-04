import { datetime, int, mysqlTable } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";
import { test } from "./test";

export const testQuiz = mysqlTable("test_quiz", {
  testId: int()
    .primaryKey()
    .notNull()
    .references(() => test.id, {
      onDelete: "cascade",
    }),
  quizId: int()
    .primaryKey()
    .notNull()
    .references(() => quiz.id, {
      onDelete: "cascade",
    }),
  userChoice: int(),
  solvedAt: datetime(),
});

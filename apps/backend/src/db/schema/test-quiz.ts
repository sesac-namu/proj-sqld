import { datetime, int, mysqlTable } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";
import { test } from "./test";

export const testQuiz = mysqlTable("test_quiz", {
  testId: int("test_id")
    .primaryKey()
    .notNull()
    .references(() => test.id, {
      onDelete: "cascade",
    }),
  quizId: int("quiz_id")
    .primaryKey()
    .notNull()
    .references(() => quiz.id, {
      onDelete: "cascade",
    }),
  userChoice: int("user_choice"),
  solvedAt: datetime("solved_at"),
});

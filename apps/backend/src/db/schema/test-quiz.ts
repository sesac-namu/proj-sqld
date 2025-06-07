import { datetime, int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";
import { test } from "./test";

export const testQuiz = mysqlTable(
  "test_quiz",
  {
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
    userChoice: int("user_choice"),
    solvedAt: datetime("solved_at"),
  },
  (table) => [primaryKey({ columns: [table.testId, table.quizId] })],
);

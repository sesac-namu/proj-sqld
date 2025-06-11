import { int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { testQuiz } from "./test-quiz";

export const testQuizChoice = mysqlTable(
  "test_quiz_answer",
  {
    testQuizId: int("test_quiz_id")
      .notNull()
      .references(() => testQuiz.id),
    userChoice: int("user_choice").notNull(),
  },
  (table) => [primaryKey({ columns: [table.testQuizId, table.userChoice] })],
);

export type TestQuizChoice = typeof testQuizChoice.$inferSelect;
export type TestQuizChoiceInsert = typeof testQuizChoice.$inferInsert;

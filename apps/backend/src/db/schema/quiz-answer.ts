import { int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core";
import { quiz } from "./quiz";

export const quizAnswer = mysqlTable(
  "quiz_answer",
  {
    quizId: int("quiz_id")
      .notNull()
      .references(() => quiz.id),
    answer: int("answer").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.quizId, table.answer],
    }),
  ],
);

export type QuizAnswer = typeof quizAnswer.$inferSelect;
export type QuizAnswerInsert = typeof quizAnswer.$inferInsert;

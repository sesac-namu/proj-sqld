import { boolean, int, mysqlTable, text } from "drizzle-orm/mysql-core";

export const quiz = mysqlTable("quiz", {
  id: int().primaryKey().autoincrement(),
  category: int().notNull(),
  tags: text(),
  title: text().notNull(),
  content_img: text(),
  content_text: text(),
  choices1: text("choices_1").notNull(),
  choices2: text("choices_2").notNull(),
  choices3: text("choices_3").notNull(),
  choices4: text("choices_4").notNull(),
  multiple: boolean().notNull().default(false),
  answer_explanation: text().notNull().default(""),
});

export type Quiz = typeof quiz.$inferSelect;
export type QuizCreate = typeof quiz.$inferInsert;

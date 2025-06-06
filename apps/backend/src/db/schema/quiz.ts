import { boolean, int, mysqlTable, text } from "drizzle-orm/mysql-core";

export const quiz = mysqlTable("quiz", {
  id: int("id").primaryKey().autoincrement(),
  category: int("category").notNull(),
  tags: text("tags"),
  title: text("title").notNull(),
  content_img: text("content_img"),
  content_text: text("content_text"),
  choices1: text("choices_1").notNull(),
  choices2: text("choices_2").notNull(),
  choices3: text("choices_3").notNull(),
  choices4: text("choices_4").notNull(),
  multiple: boolean("multiple").notNull().default(false),
  answer_explanation: text("answer_explanation").notNull().default(""),
});

export type Quiz = typeof quiz.$inferSelect;
export type QuizCreate = typeof quiz.$inferInsert;

import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "~/db";
import { test, testQuiz } from "~/db/schema";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const userId = event.context.auth.user.id;

    const t = db
      .select()
      .from(test)
      .where(and(eq(test.userId, userId), isNotNull(test.finishedAt)))
      .as("t");

    const answers = await db
      .select({
        correct: testQuiz.correct,
      })
      .from(t)
      .innerJoin(testQuiz, eq(t.id, testQuiz.testId))
      .where(isNotNull(testQuiz.correct));

    const count = answers.length;
    const correctCount = answers.filter((a) => a.correct).length;

    return Math.round((correctCount / count) * 1000) / 10 || 0;
  },
});

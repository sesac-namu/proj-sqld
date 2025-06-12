import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { testQuiz } from "~/db/schema/test-quiz";
import { testQuizChoice } from "~/db/schema/test-quiz-choice";

export default defineEventHandler({
  // onRequest: [requireAuth],
  handler: async (event) => {
    const testId = Number.parseInt(getRouterParam(event, "testId"));
    const quizNumber = Number.parseInt(getRouterParam(event, "quizNumber"));

    if (isNaN(testId) || isNaN(quizNumber)) {
      throw createError({
        status: 400,
        statusMessage: "Invalid parameters",
        message: "Test ID and Quiz Number must be valid numbers.",
      });
    }

    const { answers } = await readBody<{ answers: number[] }>(event);

    await db.transaction(async (tx) => {
      const { testQuizId, solvedAt } = (
        await tx
          .select({
            testQuizId: testQuiz.id,
            quizId: testQuiz.quizId,
            solvedAt: testQuiz.solvedAt,
          })
          .from(testQuiz)
          .where(
            and(
              eq(testQuiz.testId, testId),
              eq(testQuiz.quizNumber, quizNumber),
            ),
          )
      )[0];

      if (solvedAt !== null) {
        await tx
          .delete(testQuizChoice)
          .where(eq(testQuizChoice.testQuizId, testQuizId));
      }

      for (const answer of answers) {
        await tx.insert(testQuizChoice).values({
          testQuizId: testQuizId,
          userChoice: answer,
        });
      }

      await tx
        .update(testQuiz)
        .set({
          solvedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(testQuiz.id, testQuizId));
    });

    return {
      ok: true,
      answers,
    };
  },
});

import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "~/db";
import { quiz, quizAnswer, test, testQuiz, testQuizChoice } from "~/db/schema";

export default defineEventHandler({
  // onRequest: [requireAuth],
  handler: async (event) => {
    const testId = Number.parseInt(getRouterParam(event, "testId"));

    if (Number.isNaN(testId)) {
      throw createError({
        status: 400,
        statusMessage: "Invalid Test ID",
        message: "Test ID must be a valid number.",
      });
    }

    const notFinishedList = await db
      .select({
        solvedAt: testQuiz.solvedAt,
      })
      .from(testQuiz)
      .where(and(eq(testQuiz.testId, testId), eq(testQuiz.solvedAt, null)));

    if (notFinishedList.length !== 0) {
      throw createError({
        status: 400,
        statusMessage: "Test in progress",
        message: "You cannot finish the test while there are unsolved quizzes.",
      });
    }

    const tq = db
      .select()
      .from(testQuiz)
      .where(eq(testQuiz.testId, testId))
      .as("tq");

    const quizList = await db
      .select()
      .from(tq)
      .leftJoin(quiz, eq(tq.quizId, quiz.id));

    const quizAnswers = await db
      .select()
      .from(quizAnswer)
      .where(
        inArray(
          quizAnswer.quizId,
          quizList.map((v) => v.quiz.id),
        ),
      );

    const userChoices = await db
      .select()
      .from(testQuizChoice)
      .where(
        inArray(
          testQuizChoice.testQuizId,
          quizList.map((q) => q.tq.id),
        ),
      );

    const quizListWithAnswers = quizList
      .map((tq) => ({
        id: tq.tq.id,
        quizId: tq.quiz.id,
        quizNumber: tq.tq.quizNumber,
        answers: quizAnswers
          .filter((a) => a.quizId === tq.quiz.id)
          .map((a) => a.answer),
        userChoices: userChoices
          .filter((c) => c.testQuizId === tq.tq.id)
          .map((c) => c.userChoice),
      }))
      .map((q) => ({
        ...q,
        correct: q.answers.every((a, i) => a === q.userChoices[i]),
      }));

    await db.transaction(async (tx) => {
      await tx.update(test).set({
        updatedAt: sql`CURRENT_TIMESTAMP`,
        finishedAt: sql`CURRENT_TIMESTAMP`,
        score: quizListWithAnswers.filter((q) => q.correct).length * 2,
      });

      for (const q of quizListWithAnswers) {
        await tx
          .update(testQuiz)
          .set({
            correct: q.correct,
          })
          .where(eq(testQuiz.id, q.id));
      }
    });

    const score = quizListWithAnswers.filter((q) => q.correct).length * 2;

    return {
      ok: true,
      score,
    };
  },
});

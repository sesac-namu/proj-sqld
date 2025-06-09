import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "~/db";
import { quiz, quizAnswer, test, testQuiz, testQuizChoice } from "~/db/schema";

export default defineEventHandler({
  onRequest: [requireAuth],
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

    const testQuizList = db
      .select()
      .from(testQuiz)
      .where(eq(testQuiz.testId, testId))
      .as("test_quiz_list");

    const res = await db
      .select({
        testQuizId: testQuizList.id,
        quizId: quiz.id,
      })
      .from(testQuizList)
      .innerJoin(quiz, eq(testQuizList.quizId, quiz.id));

    const quizAnswers = await db
      .select()
      .from(quizAnswer)
      .where(
        inArray(
          quizAnswer.quizId,
          res.map((q) => q.quizId),
        ),
      );

    const userChoices = await db
      .select()
      .from(testQuizChoice)
      .where(
        inArray(
          testQuizChoice.testQuizId,
          res.map((q) => q.testQuizId),
        ),
      );

    const quizList = res
      .map((tq) => ({
        ...tq,
        answers: quizAnswers
          .filter((a) => a.quizId === tq.quizId)
          .map((a) => a.answer),
        userChoices: userChoices
          .filter((c) => c.testQuizId === tq.testQuizId)
          .map((c) => c.userChoice),
      }))
      .map((q) => ({
        id: q.testQuizId,
        correct: q.answers.every((a, i) => a === q.userChoices[i]),
      }));

    await db.update(test).set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      finishedAt: sql`CURRENT_TIMESTAMP`,
      score: quizList.filter((q) => q.correct).length * 2,
    });

    return {
      ok: true,
    };
  },
});

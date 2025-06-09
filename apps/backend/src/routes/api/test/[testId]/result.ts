import { eq, inArray } from "drizzle-orm";
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

    const testRes = await db.select().from(test).where(eq(test.id, testId));

    if (testRes.length === 0) {
      throw createError({
        status: 404,
        statusMessage: "Test not found",
        message: "The requested test does not exist.",
      });
    }

    const currentTest = testRes[0];

    if (currentTest.finishedAt === null) {
      throw createError({
        status: 400,
        statusMessage: "Test not finished",
        message: "You cannot view results of a test that is not finished.",
      });
    }

    const tq = db
      .select({
        testQuizId: testQuiz.id,
        quizId: testQuiz.quizId,
        quizNumber: testQuiz.quizNumber,
      })
      .from(testQuiz)
      .where(eq(testQuiz.testId, testId))
      .as("tq");

    const quizList = await db
      .select()
      .from(quiz)
      .innerJoin(tq, eq(quiz.id, tq.quizId));

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
          db
            .select({
              id: testQuiz.id,
            })
            .from(testQuiz)
            .where(eq(testQuiz.testId, testId)),
        ),
      );

    const quizListTransformed = quizList.map((q) => ({
      quiz: q.quiz,
      answers: quizAnswers
        .filter((a) => a.quizId === q.quiz.id)
        .map((a) => a.answer),
      userChoices: userChoices
        .filter((c) => c.testQuizId === q.tq.testQuizId)
        .map((c) => c.userChoice),
    }));

    return {
      data: {
        test: currentTest,
        quizList: quizListTransformed,
      },
    };
  },
});

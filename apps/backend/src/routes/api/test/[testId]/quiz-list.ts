import { eq, inArray } from "drizzle-orm";
import { db } from "~/db";
import { testQuiz, testQuizChoice } from "~/db/schema";

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

    const quizListRes = await db
      .select()
      .from(testQuiz)
      .where(eq(testQuiz.testId, testId));

    if (quizListRes.length === 0) {
      throw createError({
        status: 404,
        statusMessage: "Test not found",
        message: "The requested test does not exist or has no quizzes.",
      });
    }

    const userChoices = await db
      .select()
      .from(testQuizChoice)
      .where(
        inArray(
          testQuizChoice.testQuizId,
          quizListRes.map((q) => q.id),
        ),
      );

    const quizList = quizListRes.map((quiz) => ({
      ...quiz,
      solved: quiz.solvedAt !== null,
      userChoices:
        userChoices
          .filter((choice) => choice.testQuizId === quiz.id)
          .map((choice) => choice.userChoice) || null,
    }));

    return {
      data: {
        quizList,
      },
    };
  },
});

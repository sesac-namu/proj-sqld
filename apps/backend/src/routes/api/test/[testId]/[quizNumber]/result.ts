import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { quizAnswer } from "~/db/schema";
import { quiz } from "~/db/schema/quiz";
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

    const testQuizRes = await db
      .select()
      .from(testQuiz)
      .where(
        and(eq(testQuiz.testId, testId), eq(testQuiz.quizNumber, quizNumber)),
      );

    if (testQuizRes.length === 0) {
      throw createError({
        status: 404,
        statusMessage: "Test Quiz not found",
        message: "The requested test quiz does not exist.",
      });
    }

    const tq = testQuizRes[0];

    const q = await db.select().from(quiz).where(eq(quiz.id, tq.quizId));

    const userChoices = await db
      .select()
      .from(testQuizChoice)
      .where(eq(testQuizChoice.testQuizId, tq.id));

    const answers = await db
      .select()
      .from(quizAnswer)
      .where(eq(quizAnswer.quizId, tq.quizId));

    return {
      data: {
        quiz: q,
        testQuiz: tq,
        userChoices: userChoices.map((choice) => choice.userChoice),
        answers: answers.map((answer) => answer.answer),
      },
    };
  },
});

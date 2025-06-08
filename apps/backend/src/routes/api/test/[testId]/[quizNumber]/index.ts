import { and, eq } from "drizzle-orm";
import { db } from "~/db";
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

    const sub = db
      .select({
        quizId: testQuiz.quizId,
        solvedAt: testQuiz.solvedAt,
      })
      .from(testQuiz)
      .where(
        and(eq(testQuiz.testId, testId), eq(testQuiz.quizNumber, quizNumber)),
      )
      .as("sub");

    const res = await db
      .select({
        quizId: quiz.id,
        solvedAt: sub.solvedAt,
        category: quiz.category,
        tags: quiz.tags,
        title: quiz.title,
        contentImg: quiz.content_img,
        contentText: quiz.content_text,
        choices1: quiz.choices1,
        choices2: quiz.choices2,
        choices3: quiz.choices3,
        choices4: quiz.choices4,
        multiple: quiz.multiple,
      })
      .from(sub)
      .leftJoin(quiz, eq(sub.quizId, quiz.id));

    if (res.length === 0) {
      throw createError({
        status: 404,
        statusMessage: "Test Quiz not found",
        message: "The requested test quiz does not exist.",
      });
    }

    const q = res[0];

    const choices = await db
      .select({
        choice: testQuizChoice.userChoice,
      })
      .from(testQuizChoice)
      .where(eq(testQuizChoice.testQuizId, q.quizId));

    return {
      data: {
        quiz: q,
        choices: choices.map((c) => c.choice),
      },
    };
  },
});

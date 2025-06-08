import { eq } from "drizzle-orm";
import { db } from "~/db";
import { test } from "~/db/schema";

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

    const testRes = await db.select().from(test).where(eq(test.id, testId));

    if (testRes.length === 0) {
      throw createError({
        status: 404,
        statusMessage: "Test not found",
        message: "The requested test does not exist.",
      });
    }

    return {
      data: {
        test: testRes[0],
      },
    };
  },
});

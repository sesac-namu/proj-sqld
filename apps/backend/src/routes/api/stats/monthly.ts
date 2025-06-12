import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "~/db";
import { test } from "~/db/schema";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const userId = event.context.auth.user.id;

    const res = await db
      .select()
      .from(test)
      .where(
        and(
          eq(test.userId, userId),
          isNotNull(test.finishedAt),
          eq(sql`year(finished_at)`, sql`year(now())`),
          eq(sql`month(finished_at)`, sql`month(now())`),
        ),
      );

    return {
      data: {
        items: res,
      },
    };
  },
});

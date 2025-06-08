import { eq } from "drizzle-orm";
import { db } from "~/db";
import { test } from "~/db/schema";

export default defineEventHandler({
  // onRequest: [requireAuth],
  handler: async (event) => {
    // const userId = event.context.auth.user.id;
    const userId = "OjRUvpvqr5z4SaybLhUiS1eLAnyzuW58";

    const res = await db.select().from(test).where(eq(test.userId, userId));

    return {
      data: res,
    };
  },
});

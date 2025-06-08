import { eq } from "drizzle-orm";
import { db } from "~/db";
import { user } from "~/db/schema/users";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.id, event.context.auth.user.id));

    return {
      data: result[0],
    };
  },
});

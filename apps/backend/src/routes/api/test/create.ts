import { desc, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { test } from "~/db/schema/test";

export default defineEventHandler({
  // onRequest: [requireAuth],
  handler: async (event) => {
    // const userId = event.context.auth.user.id;
    const userId = "OjRUvpvqr5z4SaybLhUiS1eLAnyzuW58";

    const res = await db.transaction(async (tx) => {
      await tx.insert(test).values({
        userId,
      });
      await tx.execute(
        sql`insert into test_quiz (test_id, quiz_id, quiz_number) select t.test_id, q.quiz_id, @ROWNUM:=@ROWNUM+1 quiz_number from ((select id quiz_id from quiz where category = 1 order by rand() limit 10) union all (select id quiz_id from quiz where category = 2 order by rand() limit 40)) q, (select id test_id from test where user_id = ${userId} order by id desc limit 1) t, (SELECT @ROWNUM:=0) R;`,
      );

      return (
        await tx
          .select({
            testId: test.id,
            createdAt: test.createdAt,
          })
          .from(test)
          .where(eq(test.userId, userId))
          .orderBy(desc(test.id))
          .limit(1)
      )[0];
    });

    return {
      data: {
        test: res,
      },
    };
  },
});

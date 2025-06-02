import type { User } from "~/db/schema/users";

type Return =
  | {
      ok: false;
      error: string;
    }
  | {
      ok: true;
      data: User;
    };

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event): Promise<Return> => {
    if (event.context.auth === undefined) {
      return {
        ok: false,
        error: "Not logged in",
      };
    }

    return {
      ok: true,
      // @ts-ignore
      data: event.context.auth.user,
    };
  },
});

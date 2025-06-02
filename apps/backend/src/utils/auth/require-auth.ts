import type { EventHandler, H3Event } from "h3";

declare module "h3" {
  interface H3EventContext {
    auth?: Awaited<ReturnType<typeof auth.api.getSession>>; // Adjust the type as needed based on your auth session structure
  }
}

export const requireAuth: EventHandler = async (event: H3Event) => {
  const headers = event.headers;

  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  event.context.auth = session;
};

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    return {
      data: event.context.auth.user,
    };
  },
});

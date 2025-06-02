import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/db";
import schema from "~/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  emailAndPassword: { enabled: true },
  user: {
    modelName: "users",
  },
  session: {
    modelName: "sessions",
  },
  accounts: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
});

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db, schema } from "~/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  emailAndPassword: { enabled: true },
  plugins: [openAPI({ path: "/docs" })],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  advanced: {
    defaultCookieAttributes: {
      secure: false, // development에서는 false
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  },
});

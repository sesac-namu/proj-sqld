import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/backend/src/db/schema",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

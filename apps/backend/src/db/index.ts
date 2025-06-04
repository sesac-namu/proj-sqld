import { drizzle } from "drizzle-orm/mysql2";
import { env } from "~/env";
import { account } from "./schema/accounts";
import { session } from "./schema/sessions";
import { user } from "./schema/users";
import { verification } from "./schema/verifications";

const schema = {
  account,
  session,
  user,
  verification,
};

const db = drizzle(env.DATABASE_URL, {
  casing: "snake_case",
});

export { schema, db };

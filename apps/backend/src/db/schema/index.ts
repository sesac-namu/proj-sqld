import { accountsTable } from "./accounts";
import { sessionsTable } from "./sessions";
import { usersTable } from "./users";
import { verificationsTable } from "./verifications";

const schema = {
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
};

export default schema;

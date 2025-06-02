import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/fetch";

export default async function Home() {
  const res = await serverFetch("/api/user/me");
  const session = await authClient.getSession();

  return (
    <div>
      <div>{JSON.stringify(res)}</div>
      <div>{JSON.stringify(session)}</div>
    </div>
  );
}

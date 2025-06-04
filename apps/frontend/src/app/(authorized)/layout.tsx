import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { authClient } from "@/lib/auth-client";

export default async function AuthorizedLayout({
  children,
}: PropsWithChildren) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.error !== null || session.data === null) {
    redirect("/signin");
  }

  return children;
}

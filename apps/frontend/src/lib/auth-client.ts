"use client";

import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { useClientEnv } from "@/components/config/global-provider/client-env";

export function useAuthClient() {
  const clientEnv = useClientEnv();

  const authClient = createAuthClient({
    baseURL: clientEnv.NEXT_PUBLIC_SITE_URL,
    plugins: [nextCookies()],
  });

  return authClient;
}

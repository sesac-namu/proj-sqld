import { createFetch } from "@better-fetch/fetch";
import { env } from "@/env";

const backendApiFetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

const serverFetch = createFetch({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
});

export { backendApiFetch, serverFetch };

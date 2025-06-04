import { createFetch } from "@better-fetch/fetch";
import { cookies } from "next/headers";
import { env } from "@/env";

const backendApiFetch = createFetch({
  baseURL: env.NEXT_PUBLIC_API_URL,
  onResponse: async (ctx) => {
    if (ctx.response.headers.get("set-cookie")) {
      const cookiesStore = await cookies();
      const cookieList = ctx.response.headers.get("set-cookie")!.split("; ");
      for (const cookie of cookieList) {
        const [name, value] = cookie.split("=");

        cookiesStore.set(name!, value!);
      }
    }
  },
});

const serverFetch = createFetch({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
});

export { backendApiFetch, serverFetch };

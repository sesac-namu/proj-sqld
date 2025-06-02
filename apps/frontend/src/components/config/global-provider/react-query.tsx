"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import { env } from "@/env";

export default function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 3, // 3분
          gcTime: 1000 * 60 * 5, // 5분
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          retry: 3,
          retryDelay: 1000 * 5, //5초
          meta: {},
        },
        mutations: {
          gcTime: 0,
          retry: false,
        },
      },
      queryCache: new QueryCache({
        onError: (error) => {
          console.log("[Query]", error);
          toast.error("통실에 실패하였습니다");
        },
      }),
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

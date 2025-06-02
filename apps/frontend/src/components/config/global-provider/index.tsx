import { PropsWithChildren } from "react";
import QueryProvider from "@/components/config/global-provider/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

export default function GlobalProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}

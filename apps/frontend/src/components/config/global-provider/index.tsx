import { PropsWithChildren } from "react";
import QueryProvider from "@/components/config/global-provider/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientEnvProvider, ClientEnvType } from "./client-env";

export default function GlobalProviders({
  children,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL,
}: PropsWithChildren<ClientEnvType>) {
  return (
    <ClientEnvProvider
      NEXT_PUBLIC_API_URL={NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_SITE_URL={NEXT_PUBLIC_SITE_URL}
    >
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ClientEnvProvider>
  );
}

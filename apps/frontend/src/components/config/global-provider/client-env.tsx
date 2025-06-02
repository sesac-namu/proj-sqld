"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

export type ClientEnvType = {
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_API_URL: string;
};

const ClientEnvContext = createContext<ClientEnvType | null>(null);

export function useClientEnv() {
  const context = useContext(ClientEnvContext);

  if (!context) {
    throw new Error("useClientEnv must be used inside ClientEnvProvider");
  }

  return context;
}

export function ClientEnvProvider({
  children,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL,
}: PropsWithChildren<ClientEnvType>) {
  const [clientEnv] = useState<ClientEnvType>({
    NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL,
  });

  return (
    <ClientEnvContext.Provider value={clientEnv}>
      {children}
    </ClientEnvContext.Provider>
  );
}

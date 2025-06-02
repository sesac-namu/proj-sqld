import type { PropsWithChildren } from "react";
import GlobalComponents from "./global-components";
import GlobalProviders from "./global-provider";
import { ClientEnvType } from "./global-provider/client-env";

export default function Config({
  children,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL,
}: PropsWithChildren<ClientEnvType>) {
  return (
    <GlobalProviders
      NEXT_PUBLIC_API_URL={NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_SITE_URL={NEXT_PUBLIC_SITE_URL}
    >
      {children}
      <GlobalComponents />
    </GlobalProviders>
  );
}

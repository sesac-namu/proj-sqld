import type { PropsWithChildren } from "react";
import GlobalComponents from "./global-components";
import GlobalProviders from "./global-provider";

export default function Config({ children }: PropsWithChildren) {
  return (
    <GlobalProviders>
      {children}
      <GlobalComponents />
    </GlobalProviders>
  );
}

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

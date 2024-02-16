"use client";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";

const queryClient = getQueryClient();

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

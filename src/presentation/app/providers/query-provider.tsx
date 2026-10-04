"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { ApiError, ContractError } from "@presentation/shared/api";

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps): React.ReactNode {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: (failureCount, error) => {
              if (error instanceof ContractError) return false;
              if (error instanceof ApiError && error.status < 500) return false;
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

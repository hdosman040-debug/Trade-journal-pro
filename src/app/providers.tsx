import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JournalProvider } from "../store/JournalContext";
import { TelegramProvider } from "./TelegramProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 3,
            gcTime: 1000 * 60 * 15,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <JournalProvider>
          {children}
        </JournalProvider>
      </TelegramProvider>
    </QueryClientProvider>
  );
}
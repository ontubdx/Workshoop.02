import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * App-wide client provider mounted once near the top of the document shell.
 * Better Auth's React client needs no context — this hosts Query, tooltips, toasts.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 20_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            className: "font-sans",
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

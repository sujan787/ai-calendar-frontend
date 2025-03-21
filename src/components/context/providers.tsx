"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function Provider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      {children}
    </QueryClientProvider>
  );
}

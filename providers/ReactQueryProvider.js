'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'react-toastify';

// react-query v5 dropped per-query onError callbacks, so the app's failure
// toasts were dead code. One cache-level handler covers every query instead.
const queryCache = new QueryCache({
  onError: (error) => {
    if (error?.message?.includes('Unauthorized')) return; // middleware handles this
    toast.error(error?.message || 'Something went wrong. Please try again.', {
      position: 'top-right',
      autoClose: 3000,
      toastId: error?.message,
    });
  },
});

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ReactQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

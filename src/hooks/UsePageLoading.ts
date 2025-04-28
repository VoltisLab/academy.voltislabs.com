// hooks/usePageLoading.ts
'use client'; // Mark as client hook

import { useLoading } from '@/context/LoadingContext';

export function usePageLoading() {
  const { setIsLoading } = useLoading();
  
  const showLoading = () => {
    setIsLoading(true);
  };
  
  const hideLoading = () => {
    setIsLoading(false);
  };
  
  // Helper for async operations
  const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
    showLoading();
    try {
      const result = await promise;
      return result;
    } finally {
      // Add a small delay to make the transition smoother
      setTimeout(() => hideLoading(), 300);
    }
  };
  
  return { showLoading, hideLoading, withLoading };
}
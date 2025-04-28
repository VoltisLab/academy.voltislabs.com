'use client'; // Mark as client component

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useLoading } from '@/context/LoadingContext';
import VoltisLoader from '@/components/loader/loader';

// Create a separate component to use the search params
function LoaderLogic({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    // Show loading when URL changes
    setIsLoading(true);
    
    // Hide loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);

  return (
    <>
      {isLoading && <VoltisLoader />}
      {children}
    </>
  );
}

export default function ClientLoaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Suspense fallback={<VoltisLoader />}>
      <LoaderLogic>
        {children}
      </LoaderLogic>
    </Suspense>
  );
}
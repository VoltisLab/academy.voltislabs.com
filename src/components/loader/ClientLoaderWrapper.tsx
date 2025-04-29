'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useLoading } from '@/context/LoadingContext';
import VoltisLoader from '@/components/loader/loader';
import Header from '@/components/Header';
import Footer from '@/app/sections/Footer';

// Logic component for managing loading state
function LoaderLogic({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    // Only run effect when pathname is available
    if (!pathname) return;

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);

  // Guard against null pathname
  if (!pathname) return null;

  const hideLayout =
    pathname.startsWith('/dashboard') || pathname.startsWith('/instructor');

  return (
    <>
      {isLoading && <VoltisLoader />}
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function ClientLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<VoltisLoader />}>
      <LoaderLogic>{children}</LoaderLogic>
    </Suspense>
  );
}

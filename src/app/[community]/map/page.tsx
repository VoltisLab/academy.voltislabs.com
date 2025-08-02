// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the map component to avoid SSR issues with Leaflet
const GlobalDataMap = dynamic(() => import('@/components/skool/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="h-screen w-full bg-red-500">
      <div className="h-full w-full bg-white">
        <div className="h-full w-full bg-white">
          <Suspense
            fallback={
              <div className="w-full h-screen bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            }
          >
            <GlobalDataMap className="w-full h-full" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
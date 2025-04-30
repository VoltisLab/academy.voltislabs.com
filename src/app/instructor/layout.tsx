"use client";

import DashboardNavbar from "@/components/instructor/DashboardNav";
import Sidebar from "@/components/instructor/Sidebar";
import { ReactNode, Suspense } from "react";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full max-w-full">
       <Toaster position="top-center" reverseOrder={false} />
      {/* Sidebar - fixed width, no overflow */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0 shadow-lg">
        <Sidebar />
      </aside>

      {/* Main Content - takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <div className="sticky top-0 z-40 w-full md:block hidden">
          <DashboardNavbar />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <Suspense fallback={<p>Loading module...</p>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
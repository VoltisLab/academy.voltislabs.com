"use client";

import DashboardNavbar from "@/components/instructor/DashboardNav";
import Sidebar from "@/components/instructor/Sidebar";
import { ReactNode, Suspense } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[264px] shadow-2xl">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<p>Loading module...</p>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
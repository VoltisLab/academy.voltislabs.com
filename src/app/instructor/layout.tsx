"use client";

import DashboardNavbar from "@/components/instructor/layout/DashboardNav";
import Sidebar from "@/components/instructor/layout/Sidebar";
import { LoadingProvider } from "@/context/LoadingContext";
import { AsideProvider } from "@/context/showAsideContext";
import { ReactNode } from "react";
import { Toaster } from 'react-hot-toast';



export default function RootLayout({ children }: { children: ReactNode }) {

  

  return (
    <AsideProvider>
     <LoadingProvider>
       <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Sidebar component is self-contained with both mobile and desktop versions */}
        <Sidebar />
        
        {/* Main Content with proper margin to account for sidebar */}
        <div className="md:ml-64 min-h-screen flex flex-col">
          {/* Navbar - only visible on desktop */}
          <div className="sticky top-0 z-100 w-full hidden md:block">
            <DashboardNavbar />
          </div>
          
          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden md:m-6 shadow-lg shadow-gray-400 bg-[#EFEFF2] overflow-y-auto rounded-2xl">
  {children}
</main>
        </div>
      </div>
     </LoadingProvider>
    </AsideProvider>
  );
}
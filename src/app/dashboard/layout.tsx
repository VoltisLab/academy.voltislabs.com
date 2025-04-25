"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { AsideProvider } from "@/context/showAsideContext";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AsideProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="md:max-w-[185px] lg:max-w-[220] xl:max-w-[264px] w-full shadow-xl">
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </AsideProvider>
  );
}

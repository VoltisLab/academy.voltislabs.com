"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="max-w-[264px] w-full shadow-2xl hidden md:flex flex-col text-xl">
        <Sidebar />
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}

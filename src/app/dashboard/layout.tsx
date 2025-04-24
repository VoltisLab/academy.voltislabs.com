"use client";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-h-screen pt-18.5">
      <div className="max-w-[264px] w-full shadow-2xl">Sidebar</div>
      <div className="flex-1 md:px-10">{children}</div>
    </div>
  );
}

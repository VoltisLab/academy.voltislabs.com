"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="max-w-[264px] w-full shadow-2xl flex flex-col text-xl">
        <Link href={"/dashboard/overview"}>Overview</Link>
        <Link href={"/dashboard/explore-courses"}>Explore courses</Link>
        <Link href={"/dashboard/my-courses"}>My courses</Link>
        <Link href={"/dashboard/message"}>Message</Link>
      </div>
      <div className="flex-1 md:px-10">{children}</div>
    </div>
  );
}

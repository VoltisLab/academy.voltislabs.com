"use client";

import {
  BarChart2,
  PlusCircle,
  Layers,
  CreditCard,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#11131A] text-white h-screen flex flex-col justify-between">
      {/* Logo */}
      <div>
        <Link href={"/"} className="items-center py-6 px-4 flex gap-2 mb-12">
          <div className="size-10 relative">
            <Image
              src={"/logo.svg"}
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 128px"
              className="object-contain"
              priority
            />
          </div>
          <p className="font-medium leading-[92%] text-white text-2xl">
            Voltis Labs
            <br />
            Academy
          </p>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-4">
          <Link
            href="/instructor"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg ${
              pathname === "/instructor" ? "bg-[#4F46E5]" : "hover:bg-[#1C1E29]"
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Dashboard
          </Link>

          <Link
            href="/instructor/create-new-course"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg ${
              pathname === "/instructor/create-new-course"
                ? "bg-[#4F46E5]"
                : "hover:bg-[#1C1E29]"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Create New Course
          </Link>

          <Link
            href="/instructor/my-courses"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg ${
              pathname === "/instructor/my-courses"
                ? "bg-[#4F46E5]"
                : "hover:bg-[#1C1E29]"
            }`}
          >
            <Layers className="w-4 h-4" /> My Courses
          </Link>

          <Link
            href="/instructor/earning"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg ${
              pathname === "/instructor/earning"
                ? "bg-[#4F46E5]"
                : "hover:bg-[#1C1E29]"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Earning
          </Link>

          <Link
            href="/instructor/messages"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg relative ${
              pathname === "/instructor/messages"
                ? "bg-[#4F46E5]"
                : "hover:bg-[#1C1E29]"
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Message
            <span className="absolute right-4 top-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-full px-2 py-[2px]">
              3
            </span>
          </Link>

          <Link
            href="/instructor/settings"
            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg ${
              pathname === "/instructor/settings"
                ? "bg-[#4F46E5]"
                : "hover:bg-[#1C1E29]"
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </div>

      {/* Sign Out */}
      <div className="px-4 pb-6">
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <LogOut className="w-4 h-4" /> Sign-out
        </button>
      </div>
    </aside>
  );
}

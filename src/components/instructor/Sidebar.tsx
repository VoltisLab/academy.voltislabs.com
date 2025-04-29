"use client";

import {
  BarChart2,
  PlusCircle,
  Layers,
  CreditCard,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Add custom styles for mobile sidebar transitions
const customStyles = `
  @media (max-width: 768px) {
    .mobile-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    .mobile-sidebar.open {
      transform: translateX(0);
    }
  }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      {/* Add the custom style tag */}
      <style jsx global>
        {customStyles}
      </style>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-[#11131A] text-white sticky z-20">
        <div className="flex items-center gap-3">
          {/* Logo for Mobile */}
          <Link href={"/"} className="items-center flex gap-2">
            <div className="size-8 relative">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain"
                priority
              />
            </div>
            <p className="font-medium leading-[92%] text-white text-xl">
              Voltis Labs
              <br />
              Academy
            </p>
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileSidebar}
          className="flex items-center justify-center p-2 rounded-lg bg-[#1C1E29] hover:bg-[#252736]"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-6 text-white" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-[#11131A] text-white h-screen flex flex-col justify-between fixed left-0 top-0 z-50 md:z-30
          md:transform-none mobile-sidebar ${isMobileSidebarOpen ? "open" : ""}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div>
            {/* Close button for mobile sidebar */}
            <div className="md:hidden flex justify-end p-4">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-full hover:bg-[#1C1E29]"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

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
            <nav className="space-y-4 overflow-y-auto">
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
          <div className="px-4 pb-6 mt-auto">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" /> Sign-out
            </button>
          </div>
        </div>
      </aside>

      {/* Content offset for desktop - this pushes main content to the right of sidebar */}
      <div className="md:ml-64"></div>
    </>
  );
}
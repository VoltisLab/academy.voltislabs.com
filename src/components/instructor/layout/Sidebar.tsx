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
import { useRouter } from "next/navigation";
import LogoutModal from "../../modals/LogoutModal";
import { logout } from "@/api/auth/auth";
import toast from "react-hot-toast";
// Add custom styles for mobile sidebar transitions with enhanced modern styling
const customStyles = `
  @media (max-width: 767px) {
    .mobile-sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      position: fixed;
      width: 280px;
      z-index: 50;
    }
    
    .mobile-sidebar.open {
      transform: translateX(0);
    }
    
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    
    .mobile-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
  }
  
  .sidebar-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-nav {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
`;

interface UserData {
  firstName?: string;
  lastName?: string;
  // Add other user properties as needed
}

export default function InstructorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Get user data (similar to student sidebar)
  useEffect(() => {
    // Client-side only code
    try {
      // Replace with your actual auth logic
      const userData = getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Logout handler (similar to student sidebar)
  const handleLogout = () => {
    // Replace with your actual logout logic
    logout();
    toast.success("Logging out... Please wait while we redirect you...")
    setIsLogoutModalOpen(false);
    router.push("/");
  };

  // Mock functions for auth - replace with your actual implementations
  const getCurrentUser = (): UserData | null => {
    // This is a placeholder - replace with your actual auth implementation
    // For example, you might use a token from localStorage
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  };

  return (
    <>
      {/* Add the custom style tag */}
      <style jsx global>
        {customStyles}
      </style>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-[#11131A] text-white sticky top-0 z-30">
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

        {/* User Profile + Hamburger Menu Button */}
        <div className="flex items-center space-x-3">
          {/* User Profile */}
          <div
            className="cursor-pointer bg-[#1C1E29] size-[42px] rounded-full justify-center items-center relative overflow-hidden shadow flex"
          >
            <div className="size-[42px] rounded-full absolute -top-[20%] -right-[20%] z-10 bg-[#4F46E5]"></div>
            <div className="bg-[#11131A] flex justify-center items-center rounded-full size-9 relative z-20">
              <div className="size-7 relative">
                <Image
                  src={"/guy.jpg"}
                  alt="User"
                  fill
                  sizes="(max-width: 768px) 100vw, 128px"
                  className="object-cover rounded-full"
                />
              </div>
            </div>
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
      </div>

      {/* Mobile Sidebar Overlay - with improved transition */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-overlay open"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-[#11131A] text-white h-screen sidebar-container fixed left-0 top-0 z-50 md:z-30
          md:transform-none mobile-sidebar ${isMobileSidebarOpen ? "open" : ""}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button Container */}
          <div className="p-4">
            {/* Close button for mobile sidebar */}
            <div className="md:hidden flex justify-end mb-2">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-full hover:bg-[#1C1E29]"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Logo */}
            <Link href={"/"} className="items-center py-4 flex gap-2 mb-10">
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
          </div>

          {/* Nav Links - Main Content */}
          <div className="sidebar-content px-4">
            <nav className="sidebar-nav space-y-4">
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

          {/* Sign Out - fixed at bottom */}
          <div className="px-4 pb-6 mt-auto border-t border-gray-700 pt-4">
            <button 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-4 py-2"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <LogOut className="w-4 h-4" /> Sign-out
            </button>
          </div>
        </div>
      </aside>

      {/* Content offset for desktop - this pushes main content to the right of sidebar */}
      <div className="md:ml-64"></div>
      
      {/* Logout Modal would go here - uncomment and implement if needed */}
      
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
      />
     
    </>
  );
}
"use client";

import Image from "next/image";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useUserService } from "@/services/userService";
import { logout } from "@/api/auth/auth";

export default function DashboardNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const { getUserProfile } = useUserService();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setUserError(null);
        const data = await getUserProfile();
        setUserData(data);
        console.log(data);
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        setUserError(error?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    toast.success("Logging out... Please wait while we redirect you...");
    signOut({ callbackUrl: "/" });

    try {
      toast.loading("Logging out...");
      logout();
      await signOut({ callbackUrl: "/" });
      toast.dismiss();
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
      toast.dismiss();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-500">Good Morning</p>
        <h1 className="text-lg font-semibold text-gray-900">
          Create a new course
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Notification */}
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-gray-800" />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Profile menu"
            aria-expanded={isProfileOpen}
          >
            <Image
              src={userData?.avatarUrl || "/mycourse/avatar.png"}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isProfileOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200 animate-fadeIn">
              {/* Arrow pointing to profile image */}
              <div className="absolute -top-2 right-3 w-4 h-4 transform rotate-45 bg-white border-t border-l border-gray-200"></div>

              {/* Dropdown content */}
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : userError ? (
                    <p className="text-sm text-red-500">
                      Error loading user data
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData?.email || "email@example.com"}
                      </p>
                    </>
                  )}
                </div>

                <Link
                  href="/instructor/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  Your Profile
                </Link>

                <Link
                  href="/instructor/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3 text-gray-500" />
                  Settings
                </Link>

                <Link
                  href="/help-center"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 mr-3 text-gray-500" />
                  Help Center
                </Link>

                <div className="border-t border-gray-100"></div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

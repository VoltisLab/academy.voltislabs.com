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
  Dot,
  CheckCheck,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useUserService } from "@/services/userService";
import { logout } from "@/api/auth/auth";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";

export default function DashboardNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const currentPath = window?.location?.pathname
    const parentPath = currentPath?.split('/')
    const coursePath = parentPath[2]?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

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
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        setUserError(error?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notification data (could be fetched from API in real app)
  type Notification = {
    title: string;
    message: string;
    time: string;
    read: boolean;
    date: Date;
  };

  // Filter options
  const FILTERS = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last Week", value: "lastWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last 3 Months", value: "last3Months" },
    { label: "All", value: "all" },
  ] as const;
  type FilterType = typeof FILTERS[number]["value"];
  const [notificationFilter, setNotificationFilter] = useState<FilterType>("all");

  // Notification state (for deletion)
  const [notificationState, setNotificationState] = useState({
    today: [
      {
        title: "Video Call Appointment",
        message: "We’ll send you a link to join the call at the booking details.",
        time: "5m ago",
        read: false,
        date: new Date(2024, 5, 10, 9, 0), // June 10, 2024, 9:00 AM
      },
      {
        title: "Appointment with Dr. Robert",
        message: "Your appointment is confirmed.",
        time: "21m ago",
        read: false,
        date: new Date(2024, 5, 10, 8, 45), // June 10, 2024, 8:45 AM
      },
      {
        title: "Schedule Changed",
        message: "You have successfully changed your appointment with Dr. Joshua Doe.",
        time: "8h ago",
        read: true,
        date: new Date(2024, 5, 9, 10, 0), // June 9, 2024, 10:00 AM
      },
      {
        title: "Appointment with Dr. Lector",
        message: "Your appointment is 30min from now.",
        time: "1w ago",
        read: true,
        date: new Date(2024, 5, 5, 10, 0), // June 5, 2024, 10:00 AM
      },
    ],
    past: [
      {
        title: "Appointment Cancelled",
        message: "You cancelled your appointment with Dr. Floyd Miles. No funds will be returned to your account.",
        time: "1d ago",
        read: true,
        date: new Date(2024, 5, 9, 10, 0), // June 9, 2024, 10:00 AM
      },
      {
        title: "New Paypal Added",
        message: "Your Paypal has been successfully linked with your account.",
        time: "23w ago",
        read: true,
        date: new Date(2024, 4, 10, 10, 0), // May 10, 2024, 10:00 AM
      },
    ],
  });

  // Filtering logic (for demo, only 'today' and 'all' are implemented)
  function filterNotifications(list: Notification[]): Notification[] {
    const now = new Date();
    switch (notificationFilter) {
      case "today":
        return list.filter(n => {
          const isToday = n.date.toDateString() === now.toDateString();
          return isToday;
        });
      case "yesterday":
        return list.filter(n => {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return n.date.toDateString() === yesterday.toDateString();
        });
      case "last7":
        return list.filter(n => {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return n.date >= sevenDaysAgo;
        });
      case "lastWeek":
        // Last week (previous calendar week)
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - now.getDay() - 6);
        const lastWeekEnd = new Date(now);
        lastWeekEnd.setDate(now.getDate() - now.getDay());
        return list.filter(n => n.date >= lastWeekStart && n.date < lastWeekEnd);
      case "thisMonth":
        return list.filter(n => n.date.getMonth() === now.getMonth() && n.date.getFullYear() === now.getFullYear());
      case "last3Months":
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return list.filter(n => n.date >= threeMonthsAgo);
      case "all":
      default:
        return list;
    }
  }

  // Helper to delete notification
  function handleDeleteNotification(section: "today" | "past", idx: number) {
    setNotificationState(prev => {
      const updated = { ...prev };
      updated[section] = [...updated[section]];
      updated[section].splice(idx, 1);
      return updated;
    });
  }

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
const searchParams = useSearchParams()

    const title = searchParams!.get("edit");

const [greeting, setGreeting] = useState('')

  const getGreeting = () => {
    const hour = new Date().getHours()
    
    if (hour < 12) {
      return "Good Morning"
    } else if (hour < 17) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  useEffect(() => {
    setGreeting(getGreeting())
    
    // Optional: Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-500">{greeting}</p>
        <h1 className="text-lg font-semibold text-gray-900">

          { title ? "Edit Course" :coursePath}
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
        <div className="relative" ref={notificationDropdownRef}>
          <button
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center relative focus:outline-none"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <Bell className="w-5 h-5 text-gray-800" />
            {/* Notification dot */}
            {notificationState.today.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></span>
            )}
          </button>
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-96 max-w-[95vw] bg-white rounded-xl shadow-2xl z-50 border border-gray-200 animate-fadeIn overflow-hidden"
              >
                {/* Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 transform rotate-45 bg-white border-t border-l border-gray-200"></div>
                <div className="py-4 px-4 max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
                    <div className="relative">
                      <select
                        className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-[#313273] focus:outline-none focus:ring-2 focus:ring-[#313273] focus:border-[#313273] transition"
                        value={notificationFilter}
                        onChange={e => setNotificationFilter(e.target.value as FilterType)}
                      >
                        {FILTERS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">Today ({filterNotifications(notificationState.today).length})</h3>
                    <div className="space-y-2">
                      {filterNotifications(notificationState.today).length === 0 ? (
                        <div className="text-gray-400 text-sm py-4 text-center">No new notifications</div>
                      ) : (
                        filterNotifications(notificationState.today).map((note: Notification, idx: number) => (
                          <div
                            key={idx}
                            className={
                              note.read
                                ? "group bg-white text-sm p-2 rounded-lg flex justify-between items-start gap-4 hover:bg-[#F3F4F6] transition border border-gray-100 relative"
                                : "group bg-[#F0F2FA] text-sm p-2 rounded-lg flex justify-between items-start gap-4 hover:bg-[#E5E7EB] transition border border-[#E0E3F5] relative"
                            }
                          >
                            <div className="flex items-center gap-2 flex-1">
                          
                              <div className="flex-1">
                                <p className={
                                  note.read
                                    ? "font-semibold text-[#313273] mb-2"
                                    : "font-bold text-[#313273] mb-2"
                                }>
                                  {note.title}
                                </p>
                                <p className={
                                  note.read
                                    ? "text-gray-600 text-xs font-normal leading-tight"
                                    : "text-gray-800 text-xs font-bold leading-tight"
                                }>
                                  {note.message}
                                </p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1 pt-1">
                              <span className="text-xs text-gray-400 whitespace-nowrap">{note.time}</span>
                              {note.read && (
                                <CheckCheck size={15} className="text-[#313273] ml-2" />
                              )}
                            </span>
                            {/* X button, only on hover */}
                            <button
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                              title="Delete notification"
                              onClick={() => handleDeleteNotification("today", idx)}
                            >
                              <X size={16} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">Past ({filterNotifications(notificationState.past).length})</h3>
                    <div className="space-y-2">
                      {filterNotifications(notificationState.past).length === 0 ? (
                        <div className="text-gray-400 text-sm py-4 text-center">No past notifications</div>
                      ) : (
                        filterNotifications(notificationState.past).map((note: Notification, idx: number) => (
                          <div
                            key={idx}
                            className={
                              note.read
                                ? "group bg-white text-sm p-2 rounded-lg flex justify-between items-start gap-4 hover:bg-[#F3F4F6] transition border border-gray-100 relative"
                                : "group bg-[#F0F2FA] text-sm p-2 rounded-lg flex justify-between items-start gap-4 hover:bg-[#E5E7EB] transition border border-[#E0E3F5] relative"
                            }
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {!note.read ? (
                                <Dot size={30} className="text-[#313273] animate-ping shrink-0" />
                              ) : null}
                              <div className="flex-1">
                                <p className={
                                  note.read
                                    ? "font-semibold text-[#313273] mb-2"
                                    : "font-bold text-[#313273] mb-2"
                                }>
                                  {note.title}
                                </p>
                                <p className={
                                  note.read
                                    ? "text-gray-600 text-xs leading-tight"
                                    : "text-gray-800 text-xs leading-tight"
                                }>
                                  {note.message}
                                </p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1 pt-1">
                              <span className="text-xs text-gray-400 whitespace-nowrap">{note.time}</span>
                              {note.read && (
                                <CheckCheck size={20} className="text-[#313273] ml-2" />
                              )}
                            </span>
                            {/* X button, only on hover */}
                            <button
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                              title="Delete notification"
                              onClick={() => handleDeleteNotification("past", idx)}
                            >
                              <X size={16} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
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

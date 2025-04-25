"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  PiChatCircleTextLight,
  PiGridFourLight,
  PiMagnifyingGlassLight,
  PiSignOutLight,
  PiVideoLight,
  PiNotification,
} from "react-icons/pi";
import LogoutModal from "../modals/LogoutModal";

const links = [
  { href: "/dashboard/overview", label: "Overview", icon: PiGridFourLight },
  {
    href: "/dashboard/explore",
    label: "Explore Courses",
    icon: PiMagnifyingGlassLight,
  },
  { href: "/dashboard/my-courses", label: "My Courses", icon: PiVideoLight },
  {
    href: "/dashboard/messages",
    label: "Message",
    icon: PiChatCircleTextLight,
  },
  {
    href: "/dashboard/notifications",
    label: "Notification",
    icon: PiNotification,
  },
];
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  verified: boolean;
  isVerified: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Client-side only code
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logout();
    console.log("User logged out");
    setIsLogoutModalOpen(false);
    router.push("/");
  };

  return (
    <div className="h-screen">
      <aside className="fixed h-full p-6 overflow-y-auto flex flex-col w-[280px]">
        {/* Logo */}
        <Link href={"/"} className="items-center flex gap-2 mb-12">
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
          <p className="font-medium leading-[92%] text-[#313273] text-[23px]">
            Voltis Labs
            <br />
            Academy
          </p>
        </Link>

        <nav className="flex flex-col gap-2.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (pathname === "/dashboard" && href === "/dashboard/overview");

            return (
              <Link
                key={href}
                href={href}
                className={`px-2.5 py-2.5 rounded-md hover:bg-[#ECEBFF] transition group ${
                  isActive
                    ? "bg-[#ECEBFF] text-[#313273] font-semibold"
                    : "font-medium"
                }`}
              >
                <div className="flex items-center gap-2 transition group-hover:text-[#313273]">
                  <Icon className={`size-5 ${isActive ? "" : ""}`} />
                  <span className={`${isActive ? "" : ""} text-sm`}>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Settings logout - This will stick to the bottom with mt-auto */}
        <div className="mt-auto pt-6 space-y-2.5">
          <h3 className="text-[#A7A7AA]">Settings</h3>

          <Link
            href={"/dashboard/settings"}
            className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#525255] "
          >
            <IoSettingsOutline />
            <span>Settings</span>
          </Link>
          <button
            className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#F43F5E] cursor-pointer"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <PiSignOutLight />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
      />
    </div>
  );
}
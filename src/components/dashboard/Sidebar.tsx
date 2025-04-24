"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import {
  PiChatCircleTextLight,
  PiGridFourLight,
  PiMagnifyingGlassLight,
  PiSignOutLight,
  PiVideoLight,
} from "react-icons/pi";

const links = [
  { href: "/dashboard/overview", label: "Overview", icon: PiGridFourLight },
  {
    href: "/dashboard/explore-courses",
    label: "Explore Courses",
    icon: PiMagnifyingGlassLight,
  },
  { href: "/dashboard/my-courses", label: "My Courses", icon: PiVideoLight },
  { href: "/dashboard/message", label: "Message", icon: PiChatCircleTextLight },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex p-6 flex-col size-full text-base">
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
        <p className="font-medium leading-[92%] text-[#313273] text-2xl">
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
              className={`px-3.5 py-2.5 rounded-md hover:bg-[#ECEBFF] transition group ${
                isActive
                  ? "bg-[#ECEBFF] text-[#313273] font-semibold"
                  : "font-medium"
              }`}
            >
              <div className="flex items-center gap-2 transition group-hover:text-[#313273]">
                <Icon className={`size-5 ${isActive ? "" : ""}`} />
                <span className={`${isActive ? "" : ""}`}>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings logout */}
      <div className="mt-auto space-y-2.5">
        <h3 className="text-[#A7A7AA]">Settings</h3>

        <Link
          href={"/settings"}
          className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#525255] "
        >
          <IoSettingsOutline />
          <span>Settings</span>
        </Link>
        <button className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#F43F5E] cursor-pointer">
          <PiSignOutLight />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

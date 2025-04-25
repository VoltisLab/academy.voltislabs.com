"use client";

import { useAside } from "@/context/showAsideContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHamburger } from "react-icons/fa";
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
  const { toggleAside } = useAside();
  const pathname = usePathname();

  return (
    <aside className="flex p-4 px-4 md:px-2 xl:p-6 flex-col w-full md:w-[185px] lg:w-[220px] xl:w-[264px] text-base md:fixed md:h-screen left-0 top-0">
      {/* Logo */}
      <div className="mb-4 md:mb-12 flex items-center justify-between">
        {" "}
        <Link href={"/"} className="items-center flex gap-2">
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
        {/* User / open aside */}
        <div
          className="flex md:hidden cursor-pointer bg-[#CCCCCC]/30 size-[42px] rounded-full  justify-center items-center relative overflow-hidden shadow "
          onClick={() => toggleAside()}
        >
          <div className="size-[42px] rounded-full absolute -top-[20%] -right-[20%] z-10 bg-[#313273]"></div>

          <div className="bg-white flex justify-center items-center rounded-full size-9.5 relative z-20 ">
            <div className="size-7.5 relative">
              <Image
                src={"/guy.jpg"}
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-row md:flex-col gap-1 md:gap-2.5 flex justify-between md:justify-normal">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (pathname === "/dashboard" && href === "/dashboard/overview");

          return (
            <Link
              key={href}
              href={href}
              className={`px-1.5 py-1 md:px-3.5 md:py-2.5 rounded-md hover:bg-[#ECEBFF] transition group ${
                isActive
                  ? "bg-[#ECEBFF] text-[#313273] font-semibold"
                  : "font-medium"
              }`}
            >
              <div className="flex items-center text-center justify-center md:justify-normal md:text-start flex-col md:flex-row gap-2 transition group-hover:text-[#313273]">
                <Icon className={`size-4 md:size-5 ${isActive ? "" : ""}`} />
                <span className={`text-xs md:text-base ${isActive ? "" : ""}`}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Settings logout */}
      <div className="mt-auto space-y-2.5 hidden md:block">
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

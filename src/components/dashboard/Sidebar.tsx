"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsStars } from "react-icons/bs";
import { LuHistory, LuUserRound } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";

const links = [
  { href: "/dashboard/overview", label: "Overview", icon: LuHistory },
  {
    href: "/dashboard/explore-courses",
    label: "Explore Courses",
    icon: LuUserRound,
  },
  { href: "/dashboard/my-courses", label: "My Courses", icon: MdLocationOn },
  { href: "/dashboard/message", label: "Message", icon: BsStars },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className=" flex divide-y-2 divide-gray-100 shrink-0 rounded-md flex-col w-full md:w-52  lg:w-80">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (pathname === "/overview" && href === "/overview/order-history");

        return (
          <div>
            {/* Logo */}
            <div></div>

            {/* NAV  */}
            <Link
              key={href}
              href={href}
              className={`flex md:block items-center justify-between gap-2 px-2 md:px-4 py-4 rounded group ${
                isActive
                  ? "md:bg-gray-100 md:border-l-4 md:border-l-zinc-800 md:font-bold"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`size-6 ${isActive ? "" : ""}`} />
                <span
                  className={`group-hover:font-[700] font-[400] duration-200 ${
                    isActive ? "" : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

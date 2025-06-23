"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";

const tabs = [
  {
    name: "Basic Information",
    shortName: "Basic",
    key: "basic",
    icon: "/icons/Stack.svg",
    progress: "7/12",
  },
  {
    name: "Advanced Information",
    shortName: "Advanced",
    key: "advanced",
    icon: "/icons/ClipboardText.svg",
  },
  {
    name: "Curriculum",
    key: "curriculum",
    icon: "/icons/MonitorPlay.svg",
  },
  {
    name: "Publish Course",
    shortName: "Publish",
    key: "publish",
    icon: "/icons/PlayCircle.svg",
  },
];

export default function CourseCreationTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const courseId = searchParams?.get("courseId");

  // Determine current step from pathname
  const currentStep = pathname?.split("/").pop();

  return (
    <>
      {/* Mobile Tabs - Horizontally Scrollable */}
      <div className="md:hidden border-b border-gray-200 pb-2">
        <div className="flex items-center overflow-x-auto scrollbar-hide gap-8 px-1">
          {tabs.map((tab) => {
            const isActive = currentStep === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/instructor/create-new-course/${tab.key}${courseId ? `?courseId=${courseId}` : ""}`}
                className={`py-3 flex-shrink-0 flex items-center gap-1 whitespace-nowrap transition-all relative ${
                  isActive
                    ? "text-[#313273] font-bold border-b-2 border-pink-600"
                    : "text-gray-500 font-normal text-sm hover:text-[#313273]"
                }`}
              >
                <div className="relative">
                  <Image src={tab.icon} alt={tab.name} width={18} height={18} className="object-contain" />
                </div>
                <span>{tab.shortName || tab.name}</span>
                {tab.progress && isActive && (
                  <span className="text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-full">
                    {tab.progress}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Desktop Tabs - Full width */}
      <div className="hidden md:flex items-center border-b border-gray-200 px-2">
        {tabs.map((tab) => {
          const isActive = currentStep === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/instructor/create-new-course/${tab.key}${courseId ? `?courseId=${courseId}` : ""}`}
              className={`relative py-4 px-2 lg:px-4 text-sm font-medium border-b-2 border-transparent transition flex items-center gap-1 lg:gap-2 ${
                isActive
                  ? "text-[#313273] font-bold border-b-pink-600"
                  : "text-gray-500 hover:text-[#313273]"
              }`}
            >
              <div className="relative">
                <Image src={tab.icon} alt={tab.name} width={20} height={20} className="object-contain flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="hidden lg:inline">{tab.name}</span>
                <span className="lg:hidden">{tab.shortName || tab.name}</span>
                {tab.progress && isActive && (
                  <span className="text-green-600 text-xs">{tab.progress}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
} 
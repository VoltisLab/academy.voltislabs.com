import React, { useRef, useState, useEffect } from "react";
import { ProgressRing } from "./ProgrssRing";
import Image from "next/image";
import { useProgress } from "@/context/ProgressContext";

// Hook for closing dropdown on outside click
function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  handler: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler]);
}

interface UdemyHeaderProps {
  title: string;
}

const PreviewHeader: React.FC<UdemyHeaderProps> = ({ title }) => {
  const { progress: progressData } = useProgress();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<any>(null);

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  return (
    <header className="flex items-center w-full bg-[#18181b] h-fit py-4 px-4 md:px-8 border-b border-[#232336] relative z-50">
      {/* Logo + Course title */}
      <div className="flex items-center gap-2">
        {/* Udemy Logo (SVG) */}
        <Image
          src="/logo.svg"
          alt="voltis"
          width={36}
          height={36}
          className="mt-1"
        />
        <span className="border-l border-gray-600 h-6 mx-3" />
        <span className="text-white text-lg font-medium">
          {title?.replace(/\b\w/g, (char) => char?.toUpperCase())}
        </span>
      </div>
      <div className="flex-1" />
      {/* Progress + Dropdown + Actions */}
      <div className="flex items-center gap-4 " ref={dropdownRef}>
        {/* Progress & Dropdown */}
        <div
          className="flex items-center gap-2 relative cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <ProgressRing progress={progressData.percentage} />
          <button
            className="text-gray-400 hover:text-gray-500 text-sm ml-1 focus:outline-none flex items-center"
            type="button"
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            Your progress
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown menu with pointer */}
          {showDropdown && (
            <div
              // ref={dropdownRef}
              className="absolute left-1/2 top-[120%] transform -translate-x-1/2 mt-2"
            >
              {/* Pointer/arrow */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white filter drop-shadow-[0_-2px_2px_rgba(0,0,0,0.1)]" />

              {/* Dropdown content */}
              <div className="bg-white rounded-md shadow-lg min-w-[220px] overflow-hidden py-3 px-5">
                <span className="text-[15px] font-bold text-black block">
                  {progressData.completedItems} of {progressData.totalItems}{" "}
                  complete
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Dots action button */}
      <button className="ml-4 p-2 border border-gray-600 rounded-md">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
};

export default PreviewHeader;

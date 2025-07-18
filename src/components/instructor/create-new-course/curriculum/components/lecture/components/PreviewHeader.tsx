import React, { useRef, useState, useEffect } from "react";
import { ProgressRing } from "./ProgrssRing";
import Image from "next/image";

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
  progress?: number;
  completedText?: string;
  title: string;
}

const PreviewHeader: React.FC<UdemyHeaderProps> = ({
  progress = 100,
  completedText = "1 of 1 complete.",
  title
}) => {
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
      <div className="flex items-center gap-4">
        {/* Progress & Dropdown */}
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <ProgressRing progress={progress} />
          <button
            className="text-gray-300 text-sm ml-1 focus:outline-none flex items-center"
            onClick={() => setShowDropdown((prev) => !prev)}
            type="button"
          >
            Your progress
            <svg className="inline w-4 h-4 ml-1" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Tooltip Dropdown */}
          {showDropdown && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-3 min-w-[220px] bg-white shadow-xl border border-gray-200 rounded-lg py-3 px-5 z-50"
              style={{ top: "calc(100% + 8px)" }}
            >
              {/* Arrow */}
              <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-5 h-5 overflow-hidden pointer-events-none">
                <div className="w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 mx-auto" />
              </div>
              <span className="text-[15px] font-bold text-black">{completedText}</span>
            </div>
          )}
        </div>
        {/* Dots action button */}
        <button className="ml-4 p-2 border border-gray-600 rounded-md">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default PreviewHeader;

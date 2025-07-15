import { usePreviewContext } from "@/context/PreviewContext";
import { useState, useEffect, useRef } from "react";
import { MdOutlineSettings } from "react-icons/md";
import {
  RiCollapseDiagonalLine,
  RiExpandDiagonalLine,
  RiExpandHorizontalLine,
  RiCollapseHorizontalLine,
  RiFullscreenFill,
  RiFullscreenExitFill,
} from "react-icons/ri";

type ControlButtonsProps = {
  componentRef?: React.RefObject<HTMLDivElement | null>;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  settingsContent?: React.ReactNode;
  className?: string;
  expandedView?: boolean;
  toggleExpandedView?: () => void;
};

export const ControlButtons = ({
  // onToggleSidebar,
  // sidebarOpen = false,
  componentRef,
  settingsContent,
  className = "",
}: ControlButtonsProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const { expandedView, toggleExpandedView, parentRef } = usePreviewContext();

  // const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const toggleSettings = () => setSettingsOpen(!settingsOpen);
  // const toggleFullScreen = () => {
  //   if (!fullScreen && parentRef.current?.requestFullscreen) {
  //     parentRef.current.requestFullscreen();
  //   } else if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   }
  // };

  const toggleFullScreen = () => {
    if (!fullScreen) {
      if (componentRef?.current?.requestFullscreen) {
        componentRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };
  // const toggleExpandedView = () => setExpandedView(!expandedView);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`h-full pr-4 flex items-center ${className}`}>
      {/* Settings Button */}
      <div className="relative h-full">
        <button
          onClick={toggleSettings}
          className={`h-full rounded px-2 settings-button hover:bg-[rgba(108,40,210,0.125)]`}
          onMouseEnter={(e) => {
            if (!settingsOpen) {
              // Show tooltip logic here or use a tooltip library
              const tooltip = e.currentTarget.querySelector(".tooltip");
              if (tooltip) tooltip.classList.remove("hidden");
            }
          }}
          onMouseLeave={(e) => {
            const tooltip = e.currentTarget.querySelector(".tooltip");
            if (tooltip) tooltip.classList.add("hidden");
          }}
        >
          <MdOutlineSettings size={20} />
          <div className="tooltip absolute hidden bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Settings
          </div>
        </button>

        {/* Settings Dropup - Empty by default, content passed via props */}
        {settingsOpen && (
          <div
            ref={settingsRef}
            className="absolute bottom-full right-0 mb-2 min-w-[150px] bg-white shadow-lg rounded-md z-10 p-2"
          >
            {settingsContent || (
              <button className="w-full text-left px-2 py-1 hover:bg-[rgba(108,40,210,0.125)] rounded text-sm">
                Report Abuse
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Button */}
      <div className="relative h-full">
        <button
          onClick={toggleFullScreen}
          className={`h-full rounded px-2 ${
            fullScreen
              ? "bg-[rgba(108,40,210,0.125)]"
              : "hover:bg-[rgba(108,40,210,0.125)]"
          }`}
          onMouseEnter={(e) => {
            const tooltip = e.currentTarget.querySelector(".tooltip");
            if (tooltip) tooltip.classList.remove("hidden");
          }}
          onMouseLeave={(e) => {
            const tooltip = e.currentTarget.querySelector(".tooltip");
            if (tooltip) tooltip.classList.add("hidden");
          }}
        >
          {fullScreen ? (
            <RiFullscreenExitFill size={20} />
          ) : (
            <RiFullscreenFill size={20} />
          )}
          <div className="tooltip absolute z-30 hidden bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </div>
        </button>
      </div>

      {/* Expand/Collapse Button (hidden in fullscreen) */}
      {/* {!fullScreen && onToggleSidebar && (
        <div className="relative h-full ml-1">
          <button
            onClick={onToggleSidebar}
            className={`h-full rounded px-2 ${
              sidebarOpen
                ? "bg-[rgba(108,40,210,0.125)]"
                : "hover:bg-[rgba(108,40,210,0.125)]"
            }`}
          >
            {sidebarOpen ? (
              <RiCollapseDiagonalLine size={20} />
            ) : (
              <RiExpandDiagonalLine size={20} />
            )}
            <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {sidebarOpen ? "Collapse" : "Expand"}
            </div>
          </button>
        </div>
      )} */}

      {/* Expand Horizontal Button */}
      {!fullScreen && (
        <div className="relative h-full">
          <button
            onClick={toggleExpandedView}
            className={`h-full rounded px-2 ${
              expandedView
                ? "bg-[rgba(108,40,210,0.125)]"
                : "hover:bg-[rgba(108,40,210,0.125)]"
            }`}
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.querySelector(".tooltip");
              if (tooltip) tooltip.classList.remove("hidden");
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.querySelector(".tooltip");
              if (tooltip) tooltip.classList.add("hidden");
            }}
          >
            {expandedView ? (
              <RiCollapseHorizontalLine size={20} className="text-gray-600" />
            ) : (
              <RiExpandHorizontalLine size={20} className="text-gray-600" />
            )}
            <div className="tooltip absolute z-30 hidden bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {expandedView ? "Exit Expanded View" : "Expanded View"}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

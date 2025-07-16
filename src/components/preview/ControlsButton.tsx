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
import ReportAbuseModal from "../instructor/create-new-course/curriculum/components/lecture/modals/ReportAbuseModal";

type ControlButtonsProps = {
  componentRef?: React.RefObject<HTMLDivElement | null>;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  settingsContent?: React.ReactNode;
  className?: string;
  expandedView?: boolean;
  toggleExpandedView?: () => void;
  showShortcutButton?: boolean;
  contentType?: "quiz" | "video" | "article" | "assignment" | "coding-exercise";
};

type TooltipProps = {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
};

const Tooltip = ({
  text,
  position = "top",
  children,
  className = "",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-12 left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(false)}
        className="h-full"
      >
        {children}
      </div>
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} z-30 bg-black text-white text-sm px-2.5 py-2 rounded-sm whitespace-nowrap ${className}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export const ControlButtons = ({
  componentRef,
  className = "",
  contentType,
}: ControlButtonsProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [activeSettingsButton, setActiveSettingsButton] = useState<
    string | null
  >(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    expandedView,
    toggleExpandedView,
    setShowQuizShortcut,
    setShowVideoShortcut,
  } = usePreviewContext();

  const toggleSettings = () => {
    const newState = !settingsOpen;
    setSettingsOpen(newState);

    // Hide tooltip when settings is clicked
    if (newState) {
      // Set the first available button as active when opening
      const firstButton =
        contentType === "quiz" || contentType === "coding-exercise"
          ? "shortcut"
          : "abuse";

      setActiveSettingsButton(firstButton);
    } else {
      setActiveSettingsButton(null);
    }
  };

  const handleShortcutClick = () => {
    if (contentType === "quiz") {
      setShowQuizShortcut(true);
    } else if (contentType === "video") {
      setShowVideoShortcut(true);
    }
    setSettingsOpen(false);
  };

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
        setActiveSettingsButton(null);
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
      <div className="relative h-full flex">
        <Tooltip text="Settings">
          <button
            onClick={toggleSettings}
            className={`h-full rounded px-2 settings-button  hover:bg-[rgba(108,40,210,0.125)]`}
          >
            <MdOutlineSettings size={20} />
          </button>
        </Tooltip>

        {/* Settings Dropup - Empty by default, content passed via props */}
        {settingsOpen && (
          <div
            ref={settingsRef}
            className="absolute bottom-full right-0 mb-2 pr-2 min-w-[150px] border border-black/10 bg-white shadow-lg z-10 py-2"
          >
            {(contentType === "quiz" || contentType === "coding-exercise") && (
              <button
                className={`${
                  activeSettingsButton === "shortcut"
                    ? "bg-[rgba(108,40,210,0.125)]"
                    : ""
                } w-full rounded-r-sm text-left px-2 py-2 hover:bg-[rgba(108,40,210,0.125)] text-sm`}
                onClick={() => {
                  setActiveSettingsButton("shortcut"), handleShortcutClick();
                }}
              >
                Keyboard shortcut
              </button>
            )}
            <button
              onClick={() => {
                setActiveSettingsButton("abuse");
                setShowReportModal(true);
              }}
              className={`${
                activeSettingsButton === "abuse"
                  ? "bg-[rgba(108,40,210,0.125)]"
                  : ""
              } w-full rounded-r-sm text-left px-2 py-2 hover:bg-[rgba(108,40,210,0.125)] text-sm`}
            >
              Report Abuse
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Button */}
      <div className="relative h-full flex">
        <Tooltip text={fullScreen ? "Exit Fullscreen" : "Fullscreen"}>
          <button
            onClick={toggleFullScreen}
            className={`h-full rounded px-2 ${
              fullScreen
                ? "bg-[rgba(108,40,210,0.125)]"
                : "hover:bg-[rgba(108,40,210,0.125)]"
            }`}
          >
            {fullScreen ? (
              <RiFullscreenExitFill size={20} />
            ) : (
              <RiFullscreenFill size={20} />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Expand Horizontal Button */}
      {!fullScreen && (
        <div className="relative h-full flex">
          <Tooltip text={expandedView ? "Exit Expanded View" : "Expanded View"}>
            <button
              onClick={toggleExpandedView}
              className={`h-full rounded px-2 ${
                expandedView
                  ? "bg-[rgba(108,40,210,0.125)]"
                  : "hover:bg-[rgba(108,40,210,0.125)]"
              }`}
            >
              {expandedView ? (
                <RiCollapseHorizontalLine size={20} className="text-gray-600" />
              ) : (
                <RiExpandHorizontalLine size={20} className="text-gray-600" />
              )}
            </button>
          </Tooltip>
        </div>
      )}

      <ReportAbuseModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};

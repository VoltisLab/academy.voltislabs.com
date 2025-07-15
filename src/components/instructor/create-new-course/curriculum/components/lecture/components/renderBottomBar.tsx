import React from "react";
import {
  FiSettings,
  FiInfo,
  FiMaximize,
  FiMinimize,
  FiCheckCircle,
  FiCircle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

interface BottomBarProps {
  isContentFullscreen: boolean;
  activeItemType: string;
  isExpanded: boolean;
  progressPercent: number;
  isCompleted: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  handleContentInformation: () => void;
  handleContentFullscreen: () => void;
  handleExpand: () => void;
  handleMarkComplete: () => void;
  handleSettings: () => void;
  handlePrev?: () => void;
  handleNext?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isContentFullscreen,
  activeItemType,
  isExpanded,
  progressPercent,
  isCompleted,
  handleContentInformation,
  handleContentFullscreen,
  handleExpand,
  handleMarkComplete,
  handleSettings,
  handlePrev,
  handleNext,
  canGoPrev = true,
  canGoNext = true,
}) => {
  if (isContentFullscreen) return null;
  if (activeItemType === "video") return null;

  return (
    <div
      className="fixed bottom-0 left-0 z-30 w-full flex justify-center pointer-events-none"
      style={{ transition: "max-width 0.3s", background: "none" }}
    >
      <div
        className="bg-red-500 shadow-xl border-t border-gray-200 rounded-t-2xl flex items-center px-6 py-4 w-full max-w-screen-lg pointer-events-auto"
        style={{
          maxWidth: isExpanded ? "100%" : "75.5vw",
          transition: "max-width 0.3s",
        }}
      >
        {/* LEFT SECTION */}
        <div className="flex items-center space-x-4 flex-shrink-0 min-w-fit">
          <span className="text-gray-800 font-semibold capitalize text-lg">
            {activeItemType.replace("-", " ")}
                            <FiCircle className="w-4 h-4 mr-1" /> Mark as complete

          </span>
          <button
            className={`ml-2 flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${isCompleted
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-800"}
              focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            onClick={handleMarkComplete}
            aria-label={isCompleted ? "Completed" : "Mark as complete"}
            type="button"
          >
            {isCompleted ? (
              <>
                <FiCheckCircle className="w-4 h-4 mr-1" /> Completed
              </>
            ) : (
              <>
                <FiCircle className="w-4 h-4 mr-1" /> Mark as complete
              </>
            )}
          </button>
        </div>

        {/* CENTER: PROGRESS BAR */}
        <div className="flex-1 flex flex-col mx-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
          <span className="text-xs text-gray-500 mt-1 text-center">
            {progressPercent}% completed
          </span>
        </div>

        {/* RIGHT SECTION: CONTROLS */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Settings */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={handleSettings}
            type="button"
            aria-label="Settings"
          >
            <FiSettings className="w-5 h-5" />
          </button>
          {/* Info */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={handleContentInformation}
            type="button"
            aria-label="Content Information"
          >
            <FiInfo className="w-5 h-5" />
          </button>
          {/* Fullscreen */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={handleContentFullscreen}
            type="button"
            aria-label={isContentFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isContentFullscreen ? (
              <FiMinimize color="black" size={26} className="w-5 h-5" />
            ) : (
              <FiMaximize color="black" size={26} className="w-5 h-5" />
            )}
          </button>
          {/* Expand/Shrink */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={handleExpand}
            type="button"
            aria-label={isExpanded ? "Show sidebar" : "Hide sidebar"}
          >
            {isExpanded ? (
              // Collapse (double left arrow)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              // Expand (double right arrow)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
          {/* Navigation: Prev */}
          <button
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
              canGoPrev
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-30 pointer-events-none"
            }`}
            onClick={handlePrev}
            type="button"
            aria-label="Previous"
            disabled={!canGoPrev}
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          {/* Navigation: Next */}
          <button
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
              canGoNext
                ? "hover:bg-gray-100 text-gray-700"
                : "opacity-30 pointer-events-none"
            }`}
            onClick={handleNext}
            type="button"
            aria-label="Next"
            disabled={!canGoNext}
          >
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;

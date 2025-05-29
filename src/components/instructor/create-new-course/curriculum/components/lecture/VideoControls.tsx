import React, { useState } from 'react';
import { Play, Settings, Maximize, Volume2, X, Download, Keyboard, Info, AlertTriangle } from 'lucide-react';

interface VideoControlsProps {
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  playbackRate: number;
  videoQuality: string;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onVideoQualityChange: (quality: string) => void;
  onFullscreen: () => void;
  onExpand: () => void;
  formatTime: (seconds: number) => string;
  currentVideoDetails?: {
    duration?: string;
  };
  onReportAbuse?: () => void;
  onShowKeyboardShortcuts?: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  playing,
  progress,
  duration,
  volume,
  playbackRate,
  videoQuality,
  onPlayPause,
  onRewind,
  onForward,
  onVolumeChange,
  onPlaybackRateChange,
  onVideoQualityChange,
  onFullscreen,
  onExpand,
  formatTime,
  currentVideoDetails,
  onReportAbuse,
  onShowKeyboardShortcuts,
}) => {
  const [rewindLabel, setRewindLabel] = useState<boolean>(false);
  const [forwardLabel, setForwardLabel] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  // Close settings dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showSettingsDropdown) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSettingsDropdown]);

  const handleRewind = () => {
    onRewind();
    setRewindLabel(true);
    setTimeout(() => setRewindLabel(false), 800);
  };

  const handleForward = () => {
    onForward();
    setForwardLabel(true);
    setTimeout(() => setForwardLabel(false), 800);
  };

  const handlePlaybackRateClick = () => {
    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    onPlaybackRateChange(rates[nextIndex]);
  };

  const handleVideoQualityChange = (quality: string) => {
    onVideoQualityChange(quality);
    console.log('Video quality changed to:', quality);
  };

  const handleShowKeyboardShortcuts = () => {
    setShowSettingsDropdown(false);
    if (onShowKeyboardShortcuts) {
      onShowKeyboardShortcuts();
    }
  };

  const handleReportAbuse = () => {
    console.log("Report abuse clicked in VideoControls");
    setShowSettingsDropdown(false);
    if (onReportAbuse) {
      onReportAbuse();
    }
  };

  const handleDownloadLecture = () => {
    console.log('Download lecture clicked');
    setShowSettingsDropdown(false);
  };

  const handleContentInformation = () => {
    console.log('Content information clicked');
    setShowSettingsDropdown(false);
  };

  return (
    <>
      <div className="h-12 bg-black w-full flex items-center px-4 text-white relative">
        {/* Progress bar at the very top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
            style={{
              width: `${(progress / duration) * 100}%`,
            }}
          ></div>
        </div>

        {/* Left controls */}
        <div className="flex items-center space-x-3">
          <button
            className="hover:text-gray-300 focus:outline-none"
            aria-label="Play/Pause"
            onClick={onPlayPause}
          >
            {playing ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 4H6V20H10V4Z" fill="white" />
                <path d="M18 4H14V20H18V4Z" fill="white" />
              </svg>
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Rewind button with label */}
          <div className="relative">
            <button
              className="hover:text-gray-300 focus:outline-none"
              aria-label="Rewind 5s"
              onClick={handleRewind}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.5 8V16L6.5 12L12.5 8Z" fill="white" />
                <path d="M18.5 8V16L12.5 12L18.5 8Z" fill="white" />
              </svg>
            </button>
            {rewindLabel && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-2 py-0.5 rounded text-xs">
                Rewind 5s
              </div>
            )}
          </div>

          {/* Forward button with label */}
          <div className="relative">
            <button
              className="hover:text-gray-300 focus:outline-none"
              aria-label="Forward 5s"
              onClick={handleForward}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 8V16L11.5 12L5.5 8Z" fill="white" />
                <path d="M11.5 8V16L17.5 12L11.5 8Z" fill="white" />
              </svg>
            </button>
            {forwardLabel && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                Forward 5s
              </div>
            )}
          </div>

          <div className="text-xs mx-2 flex items-center space-x-1 font-medium">
            <span>{formatTime(progress)}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">
              {currentVideoDetails?.duration || formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Center - empty space */}
        <div className="flex-1"></div>

        {/* Right controls */}
        <div className="flex items-center space-x-3">
          <button
            className="text-xs border border-gray-700 px-2 py-0.5 rounded hover:bg-gray-900 focus:outline-none"
            onClick={handlePlaybackRateClick}
            type="button"
          >
            {playbackRate}x
          </button>

          {/* Volume control with hover slider */}
          <div className="relative">
            <button
              className="hover:text-gray-300 focus:outline-none"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              type="button"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {showVolumeSlider && (
              <div
                className="absolute bottom-8 -left-1 bg-gray-900 p-2 rounded shadow-lg z-10"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <div
                  className="h-20 w-1 bg-gray-700 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const newVolume = 1 - (e.clientY - rect.top) / rect.height;
                    onVolumeChange(Math.max(0, Math.min(1, newVolume)));
                  }}
                >
                  <div
                    className="bg-white rounded-full absolute bottom-0 left-0 right-0"
                    style={{ height: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="hover:text-gray-300 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettingsDropdown(!showSettingsDropdown);
              }}
              type="button"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Dropdown */}
            {showSettingsDropdown && (
              <div 
                className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white rounded shadow-xl border border-gray-700 z-50 min-w-[190px] h-70 overflow-y-auto text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Quality Options */}
                <div className="p-2 border-b border-gray-700">
                  <div className="space-y-2">
                    {['1080p', '720p', '576p', '432p', '360p', 'Auto'].map((quality) => (
                      <div key={quality} className="flex items-center justify-between">
                        <button
                          onClick={() => handleVideoQualityChange(quality)}
                          className={`flex-1 text-left px-3 py-1 rounded hover:bg-gray-800 transition-colors`}
                        >
                          {quality}
                        </button>
                        {videoQuality === quality && (
                          <div className="w-2 h-2 rounded-full bg-purple-500 ml-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Autoplay Toggle */}
                <div className="px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Autoplay</span>
                    <button
                      onClick={() => setAutoplay(!autoplay)}
                      className={`relative inline-flex items-center h-5 rounded-full w-10 transition-colors focus:outline-none ${
                        autoplay ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          autoplay ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="p-2">
                  <button
                    onClick={handleDownloadLecture}
                    className="w-full flex items-center px-3 py-1 text-left hover:bg-gray-800 rounded transition-colors"
                  >
                    <Download className="w-4 h-4 mr-3" />
                    Download lecture
                  </button>
                  
                  <button
                    onClick={handleShowKeyboardShortcuts}
                    className="w-full flex items-center px-3 py-1 text-left hover:bg-gray-800 rounded transition-colors"
                  >
                    <Keyboard className="w-4 h-4 mr-3" />
                    Keyboard shortcuts
                  </button>
                  
                  <button
                    onClick={handleContentInformation}
                    className="w-full flex items-center px-3 py-1 text-left hover:bg-gray-800 rounded transition-colors"
                  >
                    <Info className="w-4 h-4 mr-3" />
                    Content information
                  </button>
                  
                  <button
                    onClick={handleReportAbuse}
                    className="w-full flex items-center px-3 py-1 text-left hover:bg-gray-800 rounded transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mr-3" />
                    Report abuse
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="hover:text-gray-300 focus:outline-none"
            onClick={onFullscreen}
            type="button"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Expand button - added to video controls */}
          <div className="border-l border-gray-700 pl-3 ml-3">
            <button
              className="hover:text-gray-300 focus:outline-none"
              onClick={onExpand}
              type="button"
              aria-label="Expand"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoControls;
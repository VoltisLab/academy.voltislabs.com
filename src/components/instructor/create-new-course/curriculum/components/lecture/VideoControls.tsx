import React, { useState } from 'react';
import { Play, Settings, Maximize, Volume2, X, Download, Keyboard, Info, AlertTriangle } from 'lucide-react';

interface VideoControlsProps {
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  playbackRate: number;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onFullscreen: () => void;
  onExpand: () => void;
  formatTime: (seconds: number) => string;
  currentVideoDetails?: {
    duration?: string;
  };
  onReportAbuse?: () => void;
  onShowKeyboardShortcuts?: () => void;
}

// VideoSettingsModal Component
interface VideoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowKeyboardShortcuts: () => void;
  onReportAbuse: () => void;
  videoQuality: string;
  onVideoQualityChange: (quality: string) => void;
  autoplay: boolean;
  onAutoplayToggle: () => void;
}

const VideoSettingsModal: React.FC<VideoSettingsModalProps> = ({
  isOpen,
  onClose,
  onShowKeyboardShortcuts,
  onReportAbuse,
  videoQuality,
  onVideoQualityChange,
  autoplay,
  onAutoplayToggle,
}) => {
  if (!isOpen) return null;

  const qualityOptions = ['1080p', '720p', '576p', '430p', '360p', 'Auto'];

  const handleQualitySelect = (quality: string) => {
    onVideoQualityChange(quality);
  };

  const handleDownloadLecture = () => {
    console.log('Download lecture clicked');
    onClose();
  };

  const handleContentInformation = () => {
    console.log('Content information clicked');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-0 w-80 max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium">Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="space-y-2">
            {qualityOptions.map((quality) => (
              <div key={quality} className="flex items-center justify-between">
                <button
                  onClick={() => handleQualitySelect(quality)}
                  className={`flex-1 text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors ${
                    videoQuality === quality ? 'bg-purple-600' : ''
                  }`}
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

        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <span>Autoplay</span>
            <button
              onClick={onAutoplayToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
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

        <div className="p-2">
          <button
            onClick={handleDownloadLecture}
            className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-800 rounded transition-colors"
          >
            <Download className="w-4 h-4 mr-3" />
            Download lecture
          </button>
          
          <button
            onClick={onShowKeyboardShortcuts}
            className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-800 rounded transition-colors"
          >
            <Keyboard className="w-4 h-4 mr-3" />
            Keyboard shortcuts
          </button>
          
          <button
            onClick={handleContentInformation}
            className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-800 rounded transition-colors"
          >
            <Info className="w-4 h-4 mr-3" />
            Content information
          </button>
          
          <button
            onClick={onReportAbuse}
            className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-800 rounded transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-3" />
            Report abuse
          </button>
        </div>
      </div>
    </div>
  );
};

// VideoKeyboardShortcuts Component
interface VideoKeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoKeyboardShortcuts: React.FC<VideoKeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { action: 'Play / pause', key: 'Space' },
    { action: 'Go back 5s', key: '←' },
    { action: 'Go forward 5s', key: '→' },
    { action: 'Speed slower', key: 'Shift + ←' },
    { action: 'Speed faster', key: 'Shift + →' },
    { action: 'Volume up', key: '↑' },
    { action: 'Volume down', key: '↓' },
    { action: 'Mute', key: 'M' },
    { action: 'Fullscreen', key: 'F' },
    { action: 'Exit fullscreen', key: 'ESC' },
    { action: 'Add note', key: 'B' },
    { action: 'Toggle captions', key: 'C' },
    { action: 'Content information', key: 'I' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-black text-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold">Keyboard shortcuts</h2>
          <span className="ml-2 text-gray-400">?</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{shortcut.action}</span>
              <kbd className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono min-w-[60px] text-center">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoControls: React.FC<VideoControlsProps> = ({
  playing,
  progress,
  duration,
  volume,
  playbackRate,
  onPlayPause,
  onRewind,
  onForward,
  onVolumeChange,
  onPlaybackRateChange,
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
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [videoQuality, setVideoQuality] = useState<string>('Auto');
  const [autoplay, setAutoplay] = useState<boolean>(false);

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
    setVideoQuality(quality);
    // Here you would implement the actual video quality change logic
    console.log('Video quality changed to:', quality);
  };

  const handleShowKeyboardShortcuts = () => {
    setShowSettingsModal(false);
    if (onShowKeyboardShortcuts) {
      onShowKeyboardShortcuts();
    }
  };

  const handleReportAbuse = () => {
    console.log("Report abuse clicked in VideoControls"); // Debug log
    setShowSettingsModal(false);
    if (onReportAbuse) {
      onReportAbuse();
    }
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

          <button
            className="hover:text-gray-300 focus:outline-none"
            onClick={() => setShowSettingsModal(true)}
            type="button"
          >
            <Settings className="w-4 h-4" />
          </button>

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

      {/* Video Settings Modal */}
      <VideoSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onShowKeyboardShortcuts={handleShowKeyboardShortcuts}
        onReportAbuse={handleReportAbuse}
        videoQuality={videoQuality}
        onVideoQualityChange={handleVideoQualityChange}
        autoplay={autoplay}
        onAutoplayToggle={() => setAutoplay(!autoplay)}
      />
    </>
  );
};

export default VideoControls;
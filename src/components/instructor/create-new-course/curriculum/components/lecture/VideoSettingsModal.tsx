import React, { useState } from 'react';
import { X, Download, Keyboard, Info, AlertTriangle } from 'lucide-react';

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
    // Implement download functionality
    console.log('Download lecture clicked');
    onClose();
  };

  const handleContentInformation = () => {
    // Implement content information functionality
    console.log('Content information clicked');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-0 w-80 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quality Options */}
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

        {/* Autoplay Toggle */}
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

        {/* Menu Options */}
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

export default VideoSettingsModal;
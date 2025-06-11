import React from 'react';
import { X } from 'lucide-react';

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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold">Keyboard shortcuts</h2>
          <span className="ml-2 text-gray-400">?</span>
        </div>

        {/* Shortcuts grid */}
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

export default VideoKeyboardShortcuts;
import React from 'react';
import { X } from 'lucide-react';

interface QuizKeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizKeyboardShortcuts: React.FC<QuizKeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
          <span className="ml-2 text-gray-400">?</span>
        </div>

        {/* Shortcuts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Select answer 1-9</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <kbd key={num} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-mono min-w-[24px] text-center">
                  {num}
                </kbd>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Check answer / Next question</span>
            <kbd className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-mono">
              →
            </kbd>
          </div>

          <div className="flex items-center justify-between">
            <span>Skip question</span>
            <div className="flex items-center space-x-1">
              <kbd className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-mono">
                Shift
              </kbd>
              <span className="text-gray-400">+</span>
              <kbd className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-mono">
                →
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizKeyboardShortcuts;
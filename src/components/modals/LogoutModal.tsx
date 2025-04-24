import { useEffect, useRef } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName: string | null;
}

export default function LogoutModal({ isOpen, onClose, onLogout, userName }: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 md:mx-0"
      >
        <div className="flex flex-col items-center">
          {/* Error icon */}
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <svg 
              className="w-6 h-6 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Logout From Account
          </h2>
          
          {/* Description */}
          <p className="text-gray-500 text-center mb-6">
            Are you sure you want to logout from {userName}'s Account?
          </p>
          
          {/* Dotted line */}
          <div className="w-full flex justify-center items-center mb-6">
            <div className="border-t border-gray-200 border-dashed w-12"></div>
          </div>
          
          {/* Buttons */}
          <div className="flex w-full space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onLogout}
              className="flex-1 py-2 px-4 bg-indigo-800 text-white rounded-md hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
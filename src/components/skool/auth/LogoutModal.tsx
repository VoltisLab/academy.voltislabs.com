'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-sm shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-2">Log out</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="bg-yellow-300 text-black text-sm font-semibold py-2 px-4 rounded hover:bg-yellow-400"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}

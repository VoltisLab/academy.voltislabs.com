'use client'
import { useEffect, useState } from 'react'

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, courseTitle }: DeleteModalProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) setInputValue('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = inputValue.trim() === courseTitle;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Confirm Delete</h2>
        <p className="text-sm text-gray-600 mb-2">
          This action cannot be undone.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Please type <strong>{courseTitle}</strong> to confirm deletion.
        </p>

        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          placeholder="Type course title here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch}
            className={`px-4 py-1 text-sm text-white rounded 
              ${isMatch ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed'}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

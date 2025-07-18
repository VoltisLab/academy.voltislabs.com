'use client'
import { useEffect, useState } from 'react'
<<<<<<< HEAD
=======
import ReactDOM from 'react-dom'
import { AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
  id: number;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, courseTitle, id }: DeleteModalProps) {
  const [inputValue, setInputValue] = useState('');
<<<<<<< HEAD

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
=======
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

<<<<<<< HEAD
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
=======
  useEffect(() => { if (!isOpen) setInputValue(''); }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const isMatch = inputValue.trim() === courseTitle;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ y: 60, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="relative bg-white rounded-2xl p-7 w-[95%] max-w-md shadow-xl border border-gray-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Icon and title */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="bg-red-100 rounded-full p-2 mb-1">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Delete Course</h2>
            <span className="inline-block text-xs font-semibold bg-red-50 text-red-500 px-2 py-0.5 rounded-full mb-1">
              Danger Zone
            </span>
          </div>

          <div className="text-sm text-gray-700 mb-3 text-center">
            Are you sure you want to delete <b>{courseTitle}</b>? This action <b>cannot</b> be undone.
          </div>

          <div className="mb-5 text-xs text-gray-500 text-center">
            To confirm, type <b>{courseTitle}</b> below:
          </div>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            placeholder="Type course title here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />

          {/* Divider */}
          <div className="w-full h-px bg-gray-100 my-6" />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isMatch}
              className={`px-4 py-2 text-sm font-semibold rounded-lg shadow 
                ${isMatch
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                  : 'bg-red-200 text-white cursor-not-allowed'
                } transition`}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
}

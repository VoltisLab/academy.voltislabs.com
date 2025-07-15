// components/ConfirmationModal.tsx
import { useEffect } from "react";
import { Loader2, Trash2, X } from "lucide-react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) => {
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isLoading]);

  // Disable scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={!isLoading ? onClose : undefined}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black disabled:opacity-40"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white transition ${
              isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 size={15} className="animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConfirmQuizDeleteModalProps {
  closeModal: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmQuizDeleteModal: React.FC<ConfirmQuizDeleteModalProps> = ({
  closeModal,
  onConfirm,
  isLoading,
}) => {
  // Disable scroll on open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={closeModal}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Confirm Deletion</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this quiz? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white transition ${
              isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 size={15} className="animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

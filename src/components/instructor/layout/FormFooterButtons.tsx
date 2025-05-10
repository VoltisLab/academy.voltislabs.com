"use client";

interface FormFooterButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  saveText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;
}

const FormFooterButtons = ({
  onSave,
  onCancel,
  isLoading = false,
  saveText = "Save & Next",
  cancelText = "Cancel",
  hideCancelButton = false,
}: FormFooterButtonsProps) => {
  // Note: This component doesn't control tab navigation itself.
  // It merely sends signals to the parent component.
  
  return (
    <div className="flex items-center justify-between">
      {!hideCancelButton && (
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100"
        >
          {cancelText}
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="bg-[#2E2C6F] text-white font-medium text-sm px-6 py-2 rounded-md hover:bg-[#25235a] disabled:opacity-50 ml-auto"
      >
        {isLoading ? "Saving..." : saveText}
      </button>
    </div>
  );
};

export default FormFooterButtons;
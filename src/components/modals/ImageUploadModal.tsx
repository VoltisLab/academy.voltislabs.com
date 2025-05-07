import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Image } from "lucide-react";

interface ModalProps {
  closeModal: () => void;
  onDrop?: (acceptedFiles: File[]) => void;
}

const ImageUploadModal: React.FC<ModalProps> = ({ closeModal, onDrop }) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true, // disables opening file dialog on dropzone click
  });

  // Disable scrolling while modal is open
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
        className="bg-white w-full max-w-xl p-4 rounded-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Upload an image</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* This is the dropzone only area */}
        <div
          {...getRootProps()}
          className="h-53 flex justify-center items-center"
        >
          <input {...getInputProps()} />
          <Image size={140} className="text-gray-600" />
        </div>

        {/* This is the manual file picker trigger */}
        <div className="text-center mt-2">
          <p className="text-gray-600">
            Drag and drop an image or{" "}
            <span
              onClick={open}
              className="underline text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              select a file
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;

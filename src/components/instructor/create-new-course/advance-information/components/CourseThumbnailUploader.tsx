"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

interface CourseThumbnailUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  imageUrl?: string; // Add prop to receive image URL from parent
}

export default function CourseThumbnailUploader({ 
  onFileSelect,
  isUploading = false,
  imageUrl = "" // Default to empty string
}: CourseThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [localUploading, setLocalUploading] = useState<boolean>(false);

  // Update preview when imageUrl changes from parent
  useEffect(() => {
    if (imageUrl) {
      setPreview(imageUrl);
      setLocalUploading(false); // Ensure upload state is reset when URL is received
    }
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set local preview
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      // Show uploading state immediately
      setLocalUploading(true);
      
      // Call the parent component's upload function
      onFileSelect(file);
    }
  };

  // Update local uploading state when parent's isUploading changes
  useEffect(() => {
    if (!isUploading && localUploading) {
      setLocalUploading(false);
    }
  }, [isUploading, localUploading]);

  return (
    <div className="flex items-start gap-8">
      {/* Left - Image Placeholder or Preview */}
      <div className="w-[340px] h-[150px] bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
        {preview ? (
          <>
            <img src={preview} alt="Thumbnail Preview" className="object-cover w-full h-full" />
            {(isUploading || localUploading) && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white">Uploading...</div>
              </div>
            )}
          </>
        ) : (
          <Image
            src="/icons/thumbnail-placeholder.svg"
            alt="Thumbnail Placeholder"
            width={60}
            height={60}
          />
        )}
      </div>

      {/* Right - Text and Button */}
      <div className="space-y-4 max-w-md">
        <p className="text-sm text-gray-900">
          Upload your course Thumbnail here.{" "}
          <span className="text-gray-500">
            Important guidelines: 1200×800 pixels or 12:8 Ratio. Supported format:{" "}
            <span className="text-gray-400">.jpg, .jpeg, or .png</span>
          </span>
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          className="bg-[#D9D6FB] text-[#2E2C6F] font-semibold px-6 py-2 text-sm flex items-center gap-2"
          disabled={isUploading || localUploading}
        >
          {(isUploading || localUploading) ? "Uploading..." : "Upload Image"} <Upload className="w-4 h-4" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

interface CourseThumbnailUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  imageUrl?: string;
  required?: boolean;
}

export default function CourseThumbnailUploader({
  onFileSelect,
  isUploading = false,
  imageUrl = "",
  required = false,
}: CourseThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const localPreviewUrlRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [localUploading, setLocalUploading] = useState(false);

  // Handle parent imageUrl updates
  useEffect(() => {
    // Use only when we don’t already have a local preview
    if (imageUrl && !localPreviewUrlRef.current) {
      setPreview(imageUrl);
    }
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Store it in a ref so it survives re-renders
      localPreviewUrlRef.current = url;
      setPreview(url);
      setLocalUploading(true);
      onFileSelect(file);
    }
  };

  useEffect(() => {
    if (!isUploading && localUploading) {
      setLocalUploading(false);
    }
  }, [isUploading, localUploading]);

  return (
    <div className="flex items-start gap-8">
      {/* Image Preview */}
      <div className="w-[340px] h-[150px] bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
        {preview ? (
          <>
            <Image
              fill
              src={preview}
              alt="Thumbnail Preview"
              className="object-cover w-full h-full"
            />
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

      {/* Upload Button and Info */}
      <div className="space-y-4 max-w-md">
        <p className="text-sm text-gray-900">
          Upload your course Thumbnail here.{" "}
          <span className="text-gray-500">
            Guidelines: 1200×800 or 12:8 Ratio. Format:{" "}
            <span className="text-gray-400">.jpg, .jpeg, .png</span>
          </span>
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          className="bg-[#D9D6FB] text-[#2E2C6F] font-semibold px-6 py-2 text-sm flex items-center gap-2"
          disabled={isUploading || localUploading}
        >
          {isUploading || localUploading ? "Uploading..." : preview ? "Change Image":  "Upload Image"}
          <Upload className="w-4 h-4" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />
      </div>
    </div>
  );
}

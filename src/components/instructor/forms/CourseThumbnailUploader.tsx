"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function CourseThumbnailUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="flex items-start gap-8">
      {/* Left - Image Placeholder or Preview */}
      <div className="w-[340px] h-[150px] bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="Thumbnail Preview" className="object-cover w-full h-full" />
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
        >
          Upload Image <Upload className="w-4 h-4" />
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

"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
  type: "video" | "caption" | "notes" | "description" | "attach";
  title: string;
}

export default function UploadModal({ onClose, type, title }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [noteDesc, setNoteDesc] = useState<string>("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderBody = () => {
    if (type === "video") {
      return !file ? (
        <>
          <div className="flex border border-gray-300 rounded overflow-hidden mb-4">
            <input
              type="text"
              placeholder="Upload Files"
              className="flex-1 px-4 py-2 text-sm bg-white text-gray-600 outline-none"
              disabled
            />
            <label className="bg-gray-100 text-sm px-4 py-2 cursor-pointer">
              Upload File
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            <strong>Note:</strong> All files should be at least 720p and less than 4.0 GB.
          </p>
          <div className="flex justify-between">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md font-semibold">Cancel</button>
            <button className="px-6 py-2 bg-indigo-100 text-indigo-900 rounded-md font-semibold cursor-not-allowed">Upload Video</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-4 mb-4">
            <video
              src={previewUrl}
              controls
              className="w-32 h-20 rounded object-cover"
            />
            <div>
              <p className="text-xs text-green-600 font-semibold">FILE UPLOADED • 1:55</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {file.name}
              </p>
              <button
                className="text-sm text-indigo-600 mt-1"
                onClick={() => setFile(null)}
              >
                Replace Video
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md font-semibold">Cancel</button>
            <button className="px-6 py-2 bg-indigo-900 text-white rounded-md font-semibold">Upload Video</button>
          </div>
        </>
      );
    }

    if (type === "attach") {
      return (
        <div className="text-center py-12 border border-gray-300 rounded-md">
          <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
          <label className="text-sm text-gray-500 cursor-pointer">
            Drag and drop a file or <span className="text-indigo-600">browse file</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      );
    }

    if (type === "notes") {
      return (
        <div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Note Description</label>
            <input
              value={noteDesc}
              onChange={(e) => setNoteDesc(e.target.value)}
              type="text"
              placeholder="Enter note description"
              className="w-full border border-gray-300 p-2 rounded-md text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <div className="text-center py-12 border border-gray-300 rounded-md">
            <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
            <label className="text-sm text-gray-500 cursor-pointer">
              Drag and drop a file or <span className="text-indigo-600">browse file</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={`Write your lecture ${type} here...`}
          className="w-full border border-gray-300 p-3 rounded-md text-sm text-gray-700 placeholder:text-gray-400 resize-none"
        />
      </div>
    );
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
  <div className="bg-white shadow-md w-full max-w-xl rounded-md p-6 relative">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button onClick={onClose}>
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
    {renderBody()}
  </div>
</div>

  );
}
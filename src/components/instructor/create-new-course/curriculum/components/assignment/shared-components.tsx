// shared-components.tsx
import { motion } from "framer-motion";
import { ChevronDown, Search, Trash2, XIcon } from "lucide-react";
import { FiDownload } from "react-icons/fi";
import { HLSVideoPlayer } from "./HLSVideoPlayer";

// Shared types
export interface UploadState {
  isUploading: boolean;
  progress: number;
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
}

export interface Video {
  filename: string;
  type: string;
  status: string;
  date?: string;
  url?: string;
}

// Video Upload Progress Component
export const UploadProgress = ({
  uploadState,
  type = "Video",
  onCancel,
}: {
  uploadState: UploadState;
  type?: string;
  onCancel?: () => void;
}) => (
  <div className="overflow-hidden">
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] space-y-4">
        <div className="border-b border-gray-300 py-2">
          <div
            className="grid font-bold text-gray-800"
            style={{ gridTemplateColumns: "30% 15% 25% 20% 10%" }}
          >
            <div>Filename</div>
            <div>Type</div>
            <div>Status</div>
            <div>Date</div>
            <div></div>
          </div>
          <div
            className="grid text-sm text-zinc-700 mt-2 items-center"
            style={{ gridTemplateColumns: "30% 15% 25% 20% 10%" }}
          >
            <div className="truncate">
              {uploadState.file?.name || "Uploading..."}
            </div>
            <div>{type}</div>
            <div className="flex items-center">
              <div className="w-full flex items-center">
                <div className="w-30 bg-gray-200 h-2 overflow-hidden rounded">
                  <motion.div
                    className="bg-[#6D28D2] h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadState.progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <span className="ml-2 text-xs">
                  {Math.trunc(uploadState.progress)}%
                  {uploadState.progress >= 95 &&
                    uploadState.status === "uploading" &&
                    " (Processing...)"}
                </span>
              </div>
            </div>
            <div>{new Date().toLocaleDateString()}</div>
            <div className="flex">
              {onCancel && (
                <XIcon
                  className="text-[#6D28D9] hover:bg-[rgba(108,40,210,0.125)] font-semibold ml-auto cursor-pointer text-sm"
                  onClick={onCancel}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {uploadState.status === "error" && (
      <div className="text-red-500 text-sm mt-2">{uploadState.error}</div>
    )}
  </div>
);

// Video Library Table Component
export const VideoLibraryTable = ({
  videos,
  searchQuery,
  onSelectVideo,
  onDeleteVideo,
  onSearchChange,
}: {
  videos: Video[];
  searchQuery: string;
  onSelectVideo: (video: Video) => void;
  onDeleteVideo: (filename: string) => void;
  onSearchChange: (query: string) => void;
}) => (
  <div>
    <div className="mb-4 flex">
      <div className="relative flex w-2/3 gap-2 ml-auto">
        <input
          type="text"
          placeholder="Search files by name"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-2 px-3 border border-gray-400 rounded focus:outline-none focus:border-[#6D28D9]"
        />
        <button className="p-2 bg-[#6D28D9] text-white rounded hover:bg-indigo-700">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>

    <div className="overflow-hidden">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="px-4 py-3 border-b border-gray-200">
            <div
              className="grid font-bold text-sm text-zinc-700"
              style={{ gridTemplateColumns: "35% 11.67% 16.67% 16.66% 20%" }}
            >
              <div>Filename</div>
              <div>Type</div>
              <div>Status</div>
              <div className="flex items-center gap-1">
                <span>Date</span>
                <ChevronDown size={15} />
              </div>
              <div></div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {videos.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No result found
              </div>
            ) : (
              videos.map((video, index) => (
                <div key={index} className="px-4 py-3 hover:bg-gray-50">
                  <div
                    className="grid font-medium text-sm text-zinc-700"
                    style={{
                      gridTemplateColumns: "35% 11.67% 16.67% 16.66% 20%",
                    }}
                  >
                    <div className="text-gray-900">{video.filename}</div>
                    <div className="text-gray-600">{video.type}</div>
                    <div
                      className={`capitalize ${
                        video.status === "failed"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {video.status}
                    </div>
                    <div className="text-gray-600">{video.date}</div>
                    <div className="flex items-center gap-2">
                      {video.status === "success" && (
                        <button
                          onClick={() => {
                            onSelectVideo(video);
                            onDeleteVideo(video.filename);
                          }}
                          className="text-[#6D28D9] hover:text-purple-800 hover:bg-purple-100 font-semibold ml-auto cursor-pointer text-sm"
                        >
                          Select
                        </button>
                      )}
                      <Trash2
                        className={`text-[#6D28D9] hover:text-purple-800 hover:bg-purple-100 cursor-pointer ${
                          video.status !== "success" && "ml-auto"
                        }`}
                        size={15}
                        onClick={() => onDeleteVideo(video.filename)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// File Upload Section Component
export const FileUploadSection = ({
  file,
  onSelectFile,
  onChange,
  onCancel,
  showCancel,
  type = "Video",
  note,
}: {
  file: File | null;
  onSelectFile: () => void;
  onChange?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  type?: string;
  note?: string;
}) => (
  <>
    <div className="flex items-center gap-2">
      <span className="text-zinc-700 max-w-lg font-semibold text-sm w-full border border-zinc-700 py-3 px-4 rounded">
        {file?.name || "No file selected"}
      </span>
      <button
        onClick={onSelectFile}
        className="px-3 py-3 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
      >
        Select {type}
      </button>
    </div>
    {showCancel && onCancel && (
      <button
        onClick={onCancel}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
      >
        Cancel
      </button>
    )}
    {note && (
      <p className="text-xs text-gray-500 mt-2">
        <span className="font-bold">Note:</span> {note}
      </p>
    )}
  </>
);

// Uploaded File Display Component
export const UploadedFileDisplay = ({
  file,
  url,
  type = "Video",
  onChange,
  onDelete,
}: {
  file: File | null;
  url?: string;
  type?: string;
  onChange: () => void;
  onDelete: () => void;
}) => (
  <div className="space-y-4">
    <div className="border border-gray-300 rounded p-4 bg-gray-100">
      <div className="flex justify-between items-center font-semibold">
        <span className="text-zinc-700">
          {file?.name || "No file selected"}
        </span>
      </div>
    </div>

    {type === "Video" ? (
      <div className="h-80">
        {url ? (
          file ? (
            <video
              controls
              src={file ? URL.createObjectURL(file) : url}
              className="w-full h-full rounded object-contain"
            />
          ) : (
            <HLSVideoPlayer src={url} />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p>No video preview available.</p>
          </div>
        )}
      </div>
    ) : (
      <div className="flex items-center gap-4 p-3">
        <FiDownload />
        <span className="text-sm font-medium text-gray-900 truncate">
          {file?.name}
        </span>
      </div>
    )}

    <div className="flex space-x-2 mb-20">
      <button
        onClick={onChange}
        className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
      >
        Change
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-3 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
      >
        Delete
      </button>
    </div>
  </div>
);

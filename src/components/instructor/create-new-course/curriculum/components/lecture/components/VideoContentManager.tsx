import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, X } from "lucide-react";
import { VideoContent, TabInterface, StoredVideo, SelectedVideoDetails } from "@/lib/types";
import { useUserService } from "@/services/userMediaService";
import { UserMediaItem } from "@/api/usermedia/query";

interface VideoContentManagerProps {
  videoContent: VideoContent;
  setVideoContent: React.Dispatch<React.SetStateAction<VideoContent>>;
  isVideoUploading: boolean;
  videoUploadProgress: number;
  videoUploadComplete: boolean;
  setVideoUploadComplete: (complete: boolean) => void;
  onVideoFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onVideoSelect: (videoId: UserMediaItem) => void;
  onDeleteVideo: (videoId: string) => void;
  videoUploading?: boolean;
  onClose: () => void;
  uploadedVideoUrl?: string;
  setUploadedVideoUrl?: (url: string) => void;
}

const VideoContentManager: React.FC<VideoContentManagerProps> = ({
  videoContent,
  setVideoContent,
  isVideoUploading,
  videoUploadProgress,
  videoUploadComplete,
  setVideoUploadComplete,
  onVideoFileUpload,
  onVideoSelect,
  onDeleteVideo,
  videoUploading = false,
  onClose,
  uploadedVideoUrl: propUploadedVideoUrl,
  setUploadedVideoUrl: propSetUploadedVideoUrl
}) => {
  // Video tab options
  const [videoData, setVideoData] = useState<UserMediaItem[] >([])
  const videoTabs: TabInterface[] = [
    { label: "Upload Video", key: "uploadVideo" },
    { label: "Add from library", key: "addFromLibrary" },
  ];

  const handleSearchLibrary = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Searching for:", videoContent.libraryTab.searchQuery);
  };
const { getUserMedia, loading, error } = useUserService();

useEffect(() => {
  (async () => {
    try {
      const media = await getUserMedia({ mediaType: "VIDEO" });
      setVideoData(media)
      console.log("my video oeee",media);
    } catch (err) {
      // handled in the service
    }
  })();
}, []);





  const renderUploadTab = () => {
    return (
      <div className="py-4">
        {videoUploadComplete ? (
          <div className="space-y-4">
            <div className="border-b border-gray-300 py-2 overflow-x-auto">
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300 min-w-max">
                <div>Filename</div>
                <div>Type</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center text-gray-700 font-semibold min-w-max">
                <div className="truncate">
                  {videoContent.uploadTab.selectedFile?.name || "2025-05-01-025523.webm"}
                </div>
                <div>Video</div>
                <div>Success</div>
                <div className="flex justify-between items-center">
                  {new Date().toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  <button
                    className="text-[#D28D2] hover:text-[#7D28D2] text-xs font-bold"
                    onClick={() => {
                      setVideoUploadComplete(false);
                      setVideoContent({
                        ...videoContent,
                        uploadTab: { selectedFile: null },
                        // Clear selectedVideoDetails if replacing
                        selectedVideoDetails: null,
                      });
                    }}
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (isVideoUploading || videoUploading) ? (
          <div className="space-y-4">
            <div className="border-b border-gray-300 py-2">
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                <div>Filename</div>
                <div>Type</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center">
                <div className="truncate">
                  {videoContent.uploadTab.selectedFile?.name || "2025-05-01-025523.webm"}
                </div>
                <div>Video</div>
                <div className="flex items-center">
                  <div className="w-full flex items-center">
                    <div className="w-20 bg-gray-200 h-2 overflow-hidden rounded">
                      <div
                        className="bg-[#6D28D9] h-2"
                        style={{ width: `${videoUploading ? videoUploadProgress : videoUploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">
                      {Math.round(videoUploading ? videoUploadProgress : videoUploadProgress)}%
                    </span>
                  </div>
                </div>
                <div>
                  {new Date().toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800 font-semibold truncate py-3 border border-gray-400 w-[85%] px-4">
                {videoContent.uploadTab.selectedFile
                  ? videoContent.uploadTab.selectedFile.name
                  : "No file selected"}
              </span>
              <label className="ml-4 px-2 py-3 border border-[#6D28D2] text-sm font-bold text-[#6D28D2] rounded hover:bg-[#6D28D2]/10 cursor-pointer transition">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                  disabled={videoUploading || isVideoUploading}
                />
                {videoUploading || isVideoUploading ? 'Uploading...' : 'Select Video'}
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              <strong className="font-bold">Note:</strong>{" "}
              <span className="font-semibold">
                All files should be at least 720p and less than 4.0 GB.
              </span>
            </p>
          </>
        )}
      </div>
    );
  };

  const renderLibraryTab = () => {
    const filteredVideos = videoData?.filter((video) =>
      video.fileName
        .toLowerCase()
        .includes(videoContent.libraryTab.searchQuery.toLowerCase())
    );

    return (
      <div className="py-4">
        <form onSubmit={handleSearchLibrary} className="mb-4">
          <div className="flex justify-end gap-2">
            <div className="w-1/2 relative">
              <input
                type="text"
                placeholder="Search files by name"
                value={videoContent.libraryTab.searchQuery}
                onChange={(e) =>
                  setVideoContent({
                    ...videoContent,
                    libraryTab: {
                      ...videoContent.libraryTab,
                      searchQuery: e.target.value,
                    },
                  })
                }
                className="w-full py-2 px-3 border border-gray-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="p-2 bg-[#6D28D9] text-white rounded-md hover:bg-indigo-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="border-b border-gray-300">
          <div className="grid grid-cols-4 gap-2 md:gap-4 p-3 text-[16px] font-bold border-b border-gray-300">
            <div>Filename</div>
            <div>Type</div>
            <div>Status</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                Date <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {filteredVideos?.length > 0 ? (
            filteredVideos?.map((video) => (
              <div
                key={video.id}
                className="grid grid-cols-4 gap-2 md:gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 items-center"
              >
                <div className="truncate">{video?.fileName}</div>
                <div>{video?.extension}</div>
                <div className="text-sm font-medium text-green-800">
                  {"Success"}
                </div>
                <div className="flex items-center justify-between">
                  <div>{video?.createdAt.split("T")[0]}</div>
                  <div className="text-indigo-600">
                    <button
                      onClick={() => onVideoSelect(video)}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => onDeleteVideo(video.id)}
                      className="ml-2 text-indigo-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-7 text-center text-gray-500 text-sm">
              No results found.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Local state to store the uploaded video URL after upload
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  // Wrap the original onVideoFileUpload to capture the uploaded URL
  const handleVideoFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onVideoFileUpload) {
      const result = await onVideoFileUpload(event);
      // If your upload handler returns the URL, set it here
      // setUploadedVideoUrl(result);
      // If not, you need to set it in the upload handler and pass it here
    }
  };

  useEffect(() => {
    if (
      videoUploadComplete &&
      videoContent.uploadTab.selectedFile &&
      uploadedVideoUrl
    ) {
      setVideoContent({
        ...videoContent,
        selectedVideoDetails: {
          id: Date.now().toString(),
          url: uploadedVideoUrl,
          filename: videoContent.uploadTab.selectedFile.name,
          thumbnailUrl: "",
          isDownloadable: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUploadComplete, videoContent.uploadTab.selectedFile, uploadedVideoUrl]);

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="p-2">
        <div className="flex border-b border-gray-300">
          {videoTabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 text-sm ${
                videoContent.activeTab === tab.key
                  ? "text-gray-800 font-bold border-b-3 border-gray-800"
                  : "text-gray-500 hover:text-gray-700 font-semibold"
              }`}
              onClick={() =>
                setVideoContent({ ...videoContent, activeTab: tab.key })
              }
              disabled={videoUploading || isVideoUploading}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {videoContent.activeTab === "uploadVideo" ? (
          renderUploadTab()
        ) : (
          renderLibraryTab()
        )}
      </div>
    </div>
  );
};

export default VideoContentManager;
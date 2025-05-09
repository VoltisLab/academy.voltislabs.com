import React from 'react';
import { VideoContent, StoredVideo } from '@/lib/types';
import { Search, Trash2, ChevronDown } from 'lucide-react';

interface VideoContentTabProps {
  videoContent: VideoContent;
  setVideoContent: React.Dispatch<React.SetStateAction<VideoContent>>;
  handleVideoFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isVideoUploading: boolean;
  videoUploadProgress: number;
  videoUploadComplete: boolean;
  deleteVideo: (videoId: string) => void;
  selectVideo: (videoId: string) => void;
}

export const VideoContentTab: React.FC<VideoContentTabProps> = ({
  videoContent,
  setVideoContent,
  handleVideoFileUpload,
  isVideoUploading,
  videoUploadProgress,
  videoUploadComplete,
  deleteVideo,
  selectVideo
}) => {
  // Tab selection
  const videoTabs = [
    { label: 'Upload Video', key: 'uploadVideo' },
    { label: 'Add from library', key: 'addFromLibrary' }
  ];

  // Handle search in library tab
  const handleSearchLibrary = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Searching for:", videoContent.libraryTab.searchQuery);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="p-2">
        {/* Tabs */}
        <div className="flex border-b border-gray-300">
          {videoTabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 text-sm ${
                videoContent.activeTab === tab.key
                  ? 'text-gray-800 font-bold border-b-3 border-gray-800'
                  : 'text-gray-500 hover:text-gray-700 font-semibold'
              }`}
              onClick={() =>
                setVideoContent({ ...videoContent, activeTab: tab.key })
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
    
        {videoContent.activeTab === 'uploadVideo' ? (
          <div className="py-4">
            {videoUploadComplete ? (
              <div className="space-y-4">
                {/* File display with replace button */}
                <div className="border-b border-gray-300 py-2 overflow-x-auto">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300 min-w-max">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center text-gray-700 font-semibold min-w-max">
                    <div className="truncate">{videoContent.uploadTab.selectedFile?.name || "2025-05-01-025523.webm"}</div>
                    <div>Video</div>
                    <div>Processing</div>
                    <div className="flex justify-between items-center">
                      {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                      <button 
                        className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-bold"
                        onClick={() => {
                          setVideoUploadComplete(false);
                          setVideoContent({
                            ...videoContent,
                            uploadTab: { selectedFile: null }
                          });
                        }}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div className="bg-gray-500 h-2 rounded" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-700">
                      <strong className="font-bold">Note:</strong> <span className="font-semibold">This video is still being processed. We will send you an email when it is ready.</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : isVideoUploading ? (
              <div className="space-y-4">
                {/* File being uploaded with progress bar */}
                <div className="border-b border-gray-300 py-2">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center">
                    <div className="truncate">{videoContent.uploadTab.selectedFile?.name || "2025-05-01-025523.webm"}</div>
                    <div>Video</div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center">
                        <div className="w-20 bg-gray-200 h-2 overflow-hidden roundedd">
                          <div className="bg-[#6D28D2] h-2 " style={{ width: `${videoUploadProgress}%` }}></div>
                        </div>
                        <span className="ml-2 text-xs">{videoUploadProgress}%</span>
                      </div>
                    </div>
                    <div>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* File selection box */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 font-semibold truncate py-3 border border-gray-400 w-[85%] px-4">
                    {videoContent.uploadTab.selectedFile
                      ? videoContent.uploadTab.selectedFile.name
                      : 'No file selected'}
                  </span>
                  <label className="ml-4 px-2 py-3 border border-[#6D28D2] text-sm font-bold text-[#6D28D2] rounded hover:bg-[#6D28D2]/10 cursor-pointer transition">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                    Select Video
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500 ">
                  <strong className='font-bold'>Note:</strong> <span className='font-semibold'>All files should be at least 720p and less than 4.0 GB.</span>
                </p>
              </>
            )}
          </div>
        ) : (
          // Library tab
          <div className="py-4">
            {/* Search form */}
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
      
            {/* Table header and results */}
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
              
              {videoContent.libraryTab.videos.filter(video => 
                video.filename.toLowerCase().includes(videoContent.libraryTab.searchQuery.toLowerCase())
              ).length > 0 ? (
                videoContent.libraryTab.videos.filter(video => 
                  video.filename.toLowerCase().includes(videoContent.libraryTab.searchQuery.toLowerCase())
                ).map(video => (
                  <div key={video.id} className="grid grid-cols-4 gap-2 md:gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 items-center">
                    <div className="truncate">{video.filename}</div>
                    <div>{video.type}</div>
                    <div className="text-sm font-medium text-green-600">
                      {video.status}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{video.date}</div>
                      <div>
                        <button 
                          onClick={() => selectVideo(video.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          Select
                        </button>
                        <button 
                          onClick={() => deleteVideo(video.id)}
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
        )}
      </div>
    </div>
  );
};
'use client';

import React, { useRef, useState } from 'react';
import { X, Play } from "lucide-react";
import dynamic from 'next/dynamic';

// Import PDF viewer with no SSR to avoid "document is not defined" errors
const SimplePdfViewer = dynamic(() => import('./SimplePdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded p-4 h-32 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-sm text-gray-600">Loading PDF viewer...</p>
      </div>
    </div>
  )
});

const VideoSlideMashupComponent: React.FC = () => {
  // State for video and presentation files
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  
  // Upload states
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [videoProcessing, setVideoProcessing] = useState<boolean>(false);
  const [presentationUploaded, setPresentationUploaded] = useState<boolean>(false);
  
  // References
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Start upload simulation
      setVideoUploading(true);
      setVideoUploadProgress(0);
      
      const interval = setInterval(() => {
        setVideoUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setVideoUploading(false);
              setVideoUploaded(true);
              setVideoFile(file);
              setVideoProcessing(true); // Set video to processing state
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
  };
  
  // Reset presentation
  const resetPresentation = (): void => {
    setPresentationUploaded(false);
    setPresentationFile(null);
  };
  
  // Handle presentation file selection
  const handlePresentationFileSelected = (file: File | null): void => {
    setPresentationFile(file);
  };
  
  // Reset video
  const resetVideo = (): void => {
    setVideoFile(null);
    setVideoUploaded(false);
    setVideoProcessing(false);
  };
  
  // Replace video
  const replaceVideo = (): void => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };
  
  // Mark presentation as used
  const handleUsePresentation = (): void => {
    setPresentationUploaded(true);
  };
  
  // Render video progress bar
  const renderVideoProgressBar = () => (
    <div className="relative w-full h-4 bg-gray-300 rounded-full mt-2">
      <div className="w-full flex items-center px-2">
        <button className="absolute left-0 px-1 z-10 text-gray-700 disabled:opacity-50" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div className="w-full h-1 bg-gray-300 rounded-full">
          {/* This would be the actual progress, but for now it's empty since video is "processing" */}
        </div>
        <button className="absolute right-0 px-1 z-10 text-gray-700 disabled:opacity-50" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="border border-gray-300 rounded-md">
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* Step 1 - Video */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${videoUploaded ? 'bg-amber-200 text-gray-800' : 'bg-gray-100 text-gray-700'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Pick a Video
            </span>
          </div>

          {videoUploaded ? (
            <>
              <div className="space-y-2">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-300">
                        <th className="py-2 font-bold text-gray-800">Filename</th>
                        <th className="py-2 font-bold text-gray-800">Type</th>
                        <th className="py-2 font-bold text-gray-800">Status</th>
                        <th className="py-2 font-bold text-gray-800">Date</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-sm text-gray-700 font-bold">
                        <td className="py-2">{videoFile?.name || "2025-05-01-025523.webm"}</td>
                        <td className="py-2">Video</td>
                        <td className="py-2">{videoProcessing ? "Processing" : "Ready"}</td>
                        <td className="py-2">{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</td>
                        <td className="py-2 text-right">
                          <button 
                            className="font-bold text-purple-600 hover:text-purple-800"
                            onClick={replaceVideo}
                          >
                            Replace
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Video progress bar */}
              {renderVideoProgressBar()}
              
              {/* Processing message */}
              {videoProcessing && (
                <p className="mt-1.5 text-sm text-gray-700">
                  <strong>Note:</strong> This video is still being processed. We will send you an email when it is ready.
                </p>
              )}
              
              {/* Hidden file input for replace functionality */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </>
          ) : videoUploading ? (
            <div className="space-y-2">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-base font-bold text-gray-800 border-b border-gray-300 py-2 min-w-max">
                  <div>Filename</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm items-center text-gray-700 font-semibold min-w-max py-2">
                  <div className="truncate">
                    {videoFile?.name || "2025-05-01-025523.webm"}
                  </div>
                  <div>Video</div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden mr-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${videoUploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs">{videoUploadProgress}%</span>
                  </div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1 border border-gray-500 rounded px-4 py-3 text-sm text-gray-600 truncate">
                {videoFile ? (
                  <span>{videoFile.name}</span>
                ) : (
                  <span>No file selected</span>
                )}
              </div>
              <label className="ml-4 px-2 py-3 border border-purple-700 text-sm font-bold text-purple-700 hover:bg-purple-50 cursor-pointer transition">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                Select Video
              </label>
            </div>
          )}
          
          {!videoUploaded && !videoUploading && (
            <p className="mt-1.5 text-xs text-gray-500">
              <strong>Note:</strong> All files should be at least 720p and less than 4.0 GB.
            </p>
          )}
        </div>

        {/* Step 2 - PDF */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${
              presentationUploaded 
                ? 'bg-green-500 text-white font-bold' 
                : presentationFile 
                  ? 'bg-amber-200 text-gray-800' 
                  : 'bg-gray-100 text-gray-700'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Pick a Presentation
            </span>
          </div>

          <SimplePdfViewer 
            onUsePresentation={handleUsePresentation}
            onCancel={resetPresentation}
            onFileSelected={handlePresentationFileSelected}
            isPresentationSelected={presentationUploaded}
          />
        </div>

        {/* Step 3 - Sync - Static implementation */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-700`}>
              3
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Synchronize Video & Presentation
            </span>
          </div>
          
          <div className="border-2 border-dashed border-gray-600 px-4 py-4 text-left font-medium text-sm text-gray-600">
            Please pick a video & presentation first
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSlideMashupComponent;
'use client';

import React, { useRef, useState } from 'react';
import { X, Play } from "lucide-react";
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

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

// Types for upload functions
interface VideoSlideMashupProps {
  sectionId?: string;
  lectureId?: string;
  uploadVideoToBackend?: (
    sectionId: string,
    lectureId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ) => Promise<string | null>;
  uploadFileToBackend?: (
    file: File,
    fileType: 'VIDEO' | 'RESOURCE'
  ) => Promise<string | null>;
}

const VideoSlideMashupComponent: React.FC<VideoSlideMashupProps> = ({
  sectionId = '',
  lectureId = '',
  uploadVideoToBackend,
  uploadFileToBackend
}) => {
  // State for video and presentation files
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  
  // Upload states for video
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [videoProcessing, setVideoProcessing] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Upload states for presentation
  const [presentationUploading, setPresentationUploading] = useState<boolean>(false);
  const [presentationUploadProgress, setPresentationUploadProgress] = useState<number>(0);
  const [presentationUploaded, setPresentationUploaded] = useState<boolean>(false);
  const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
  const [presentationUploadError, setPresentationUploadError] = useState<string | null>(null);
  
  // References
  const videoInputRef = useRef<HTMLInputElement>(null);
  const presentationInputRef = useRef<HTMLInputElement>(null);
  
  // Handle video upload with backend integration
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setVideoFile(file);
      
      // Check if we have the required props for backend upload
      if (!uploadVideoToBackend || !sectionId || !lectureId) {
        // Fallback to simulation if backend functions not available
        handleVideoUploadSimulation(file);
        return;
      }

      try {
        // Start upload
        setVideoUploading(true);
        setVideoUploadProgress(0);
        setVideoUploaded(false);
        setVideoProcessing(false);

        // Upload to backend
        const uploadedVideoUrl = await uploadVideoToBackend(
          sectionId,
          lectureId,
          file,
          (progress) => {
            setVideoUploadProgress(progress);
          }
        );

        if (uploadedVideoUrl) {
          setVideoUrl(uploadedVideoUrl);
          setVideoUploaded(true);
          setVideoProcessing(true); // Set to processing after upload
          toast.success('Video uploaded successfully!');
        } else {
          throw new Error('Failed to get video URL from upload');
        }
      } catch (error) {
        console.error('Video upload failed:', error);
        toast.error('Failed to upload video. Please try again.');
        // Reset states on error
        setVideoFile(null);
        setVideoUploaded(false);
        setVideoProcessing(false);
        setVideoUrl(null);
      } finally {
        setVideoUploading(false);
      }
    }
  };

  // Fallback simulation function
  const handleVideoUploadSimulation = (file: File) => {
    setVideoUploading(true);
    setVideoUploadProgress(0);
    
    const interval = setInterval(() => {
      setVideoUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVideoUploading(false);
            setVideoUploaded(true);
            setVideoProcessing(true);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Handle presentation file upload
  const handlePresentationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPresentationFile(file);
      setPresentationUploadError(null); // Clear any previous errors
      
      // Check if we have the upload function
      if (!uploadFileToBackend) {
        // Fallback to just setting the file without upload
        setPresentationUploaded(true);
        toast.success('Presentation file selected!');
        return;
      }

      try {
        // Start upload
        setPresentationUploading(true);
        setPresentationUploadProgress(0);
        setPresentationUploaded(false);

        // Simulate progress for presentation upload
        const progressInterval = setInterval(() => {
          setPresentationUploadProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            return Math.min(newProgress, 90); // Stop at 90% until upload completes
          });
        }, 200);

        // Upload to backend as RESOURCE type
        const uploadedFileUrl = await uploadFileToBackend(file, 'RESOURCE');

        // Clear progress simulation
        clearInterval(progressInterval);
        setPresentationUploadProgress(100);

        if (uploadedFileUrl) {
          setPresentationUrl(uploadedFileUrl);
          setPresentationUploaded(true);
          toast.success('Presentation uploaded successfully!');
        } else {
          throw new Error('Failed to get file URL from upload');
        }
      } catch (error) {
        console.error('Presentation upload failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload presentation. Please try again.';
        setPresentationUploadError(errorMessage);
        toast.error(errorMessage);
        // Reset states on error
        setPresentationFile(null);
        setPresentationUploaded(false);
        setPresentationUrl(null);
      } finally {
        setPresentationUploading(false);
        setPresentationUploadProgress(0);
      }
    }
  };
  
  // Reset presentation
  const resetPresentation = (): void => {
    setPresentationUploaded(false);
    setPresentationFile(null);
    setPresentationUrl(null);
    setPresentationUploading(false);
    setPresentationUploadProgress(0);
    setPresentationUploadError(null); // Clear error state
    if (presentationInputRef.current) {
      presentationInputRef.current.value = '';
    }
  };
  
  // Handle presentation file selection (for the PDF viewer component)
  const handlePresentationFileSelected = (file: File | null): void => {
    setPresentationFile(file);
  };
  
  // Reset video
  const resetVideo = (): void => {
    setVideoFile(null);
    setVideoUploaded(false);
    setVideoProcessing(false);
    setVideoUrl(null);
    setVideoUploading(false);
    setVideoUploadProgress(0);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
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
                        <td className="py-2">{videoFile?.name || "video-file.mp4"}</td>
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
                    {videoFile?.name || "uploading-video.mp4"}
                  </div>
                  <div>Video</div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden mr-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${videoUploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs">{Math.round(videoUploadProgress)}%</span>
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
                  disabled={videoUploading}
                />
                {videoUploading ? 'Uploading...' : 'Select Video'}
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

          {/* Enhanced SimplePdfViewer with upload functionality */}
          <div>
            <SimplePdfViewer 
              onUsePresentation={handleUsePresentation}
              onCancel={resetPresentation}
              onFileSelected={handlePresentationFileSelected}
              isPresentationSelected={presentationUploaded}
              onFileUpload={handlePresentationUpload}
              uploadedFileUrl={presentationUrl}
              isUploading={presentationUploading}
              uploadProgress={presentationUploadProgress}
              uploadError={presentationUploadError}
            />
            
            {/* Hidden file input for presentation */}
            <input
              ref={presentationInputRef}
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={handlePresentationUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Step 3 - Sync - Enhanced to check for both uploads */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${
              videoUploaded && presentationUploaded 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              3
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Synchronize Video & Presentation
            </span>
          </div>
          
          {videoUploaded && presentationUploaded ? (
            <div className="border-2 border-green-500 bg-green-50 px-4 py-4 text-left font-medium text-sm text-green-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ready to synchronize! Video and presentation are both uploaded.
              </div>
              <button 
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                onClick={() => toast.success('Synchronization started!')}
              >
                Start Synchronization
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 px-4 py-4 text-left font-medium text-sm text-gray-600">
              {!videoUploaded && !presentationUploaded 
                ? "Please pick a video & presentation first"
                : !videoUploaded 
                  ? "Please upload a video to continue" 
                  : "Please upload a presentation to continue"
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSlideMashupComponent;
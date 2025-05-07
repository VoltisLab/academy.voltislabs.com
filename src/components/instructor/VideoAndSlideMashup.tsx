import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, X, CircleCheck } from "lucide-react";

// TypeScript interfaces
interface MockPdfDocument {
  numPages: number;
  getPage: (pageNum: number) => {
    getViewport: () => { width: number; height: number };
    render: (renderContext: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
  };
}

interface MockPdfJs {
  getDocument: (file: File) => {
    promise: Promise<MockPdfDocument>;
  };
}

// Mock PDF.js functions for demonstration
const mockPdfJs: MockPdfJs = {
  getDocument: (file: File) => {
    return {
      promise: new Promise<MockPdfDocument>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Simulate determining number of pages based on file size
          const fileSize = file.size;
          const pageCount = Math.max(1, Math.min(Math.floor(fileSize / 50000), 30));
          
          // Create a mock PDF document object
          resolve({
            numPages: pageCount,
            getPage: (pageNum: number) => {
              return {
                getViewport: () => ({ width: 800, height: 1100 }),
                render: (renderContext: {
                  canvasContext: CanvasRenderingContext2D;
                  viewport: { width: number; height: number };
                }) => {
                  // Simulate rendering a page to the canvas
                  const canvas = renderContext.canvasContext.canvas;
                  const ctx = renderContext.canvasContext;
                  
                  // Clear canvas
                  ctx.fillStyle = '#fff';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  
                  // Draw page number in center
                  ctx.fillStyle = '#333';
                  ctx.font = '24px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2);
                  
                  return { promise: Promise.resolve() };
                }
              };
            }
          });
        };
        reader.readAsArrayBuffer(file);
      })
    };
  }
};

const VideoSlideMashupComponent: React.FC = () => {
  // State for video and presentation files
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  
  // Upload states
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [presentationUploading, setPresentationUploading] = useState<boolean>(false);
  const [presentationUploadProgress, setPresentationUploadProgress] = useState<number>(0);
  const [presentationUploaded, setPresentationUploaded] = useState<boolean>(false);
  
  // PDF viewing states
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [totalSlides, setTotalSlides] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfDocument, setPdfDocument] = useState<MockPdfDocument | null>(null);
  const [syncComplete, setSyncComplete] = useState<boolean>(false);
  
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setVideoFile(file);
      
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
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
  };
  
  // Handle PDF upload
  const handlePresentationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPresentationFile(file);
      
      // Start upload simulation
      setPresentationUploading(true);
      setPresentationUploadProgress(0);
      
      const interval = setInterval(() => {
        setPresentationUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPresentationUploading(false);
              setPresentationUploaded(true);
              
              // Load PDF for preview
              loadPdf(file);
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
  };
  
  // Load PDF and determine page count
  const loadPdf = async (file: File) => {
    try {
      const loadingTask = mockPdfJs.getDocument(file);
      const pdf = await loadingTask.promise;
      
      setPdfDocument(pdf);
      setTotalSlides(pdf.numPages);
      setCurrentSlide(1);
      
      renderPage(pdf, 1);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setTotalSlides(1);
    }
  };
  
  // Render specific page of PDF
  const renderPage = async (pdf: MockPdfDocument, pageNumber: number) => {
    if (!canvasRef.current) return;
    
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Could not get canvas context');
        return;
      }
      
      const viewport = page.getViewport();
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };
  
  // Effect to render current page when it changes
  useEffect(() => {
    if (pdfDocument && currentSlide) {
      renderPage(pdfDocument, currentSlide);
    }
  }, [pdfDocument, currentSlide]);
  
  // Navigation handlers
  const goToPreviousSlide = (): void => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const goToNextSlide = (): void => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const goToSlide = (slideNumber: number): void => {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
      setCurrentSlide(slideNumber);
    }
  };
  
  // Toggle fullscreen preview
  const toggleFullscreen = (): void => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Complete the synchronization
  const usePresentation = (): void => {
    setSyncComplete(true);
  };
  
  // Reset presentation
  const resetPresentation = (): void => {
    setPresentationFile(null);
    setPresentationUploaded(false);
    setPdfDocument(null);
    setCurrentSlide(1);
    setTotalSlides(1);
  };
  
  // Reset video
  const resetVideo = (): void => {
    setVideoFile(null);
    setVideoUploaded(false);
  };
  
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
            <div className="space-y-2">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-[16px] font-bold text-gray-800 border-b border-gray-300 py-2 min-w-max">
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
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={resetVideo}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : videoUploading ? (
            <div className="space-y-2">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-[16px] font-bold text-gray-800 border-b border-gray-300 py-2 min-w-max">
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
                  <div>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
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
              <label className="ml-4 px-2 py-3 border border-[#6D28D2] text-sm font-bold text-[#6D28D2] hover:bg-[#6D28D2]/10 cursor-pointer transition">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                Select Video
              </label>
            </div>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            <strong>Note:</strong> All files should be at least 720p and less than 4.0 GB.
          </p>
        </div>

        {/* Step 2 - PDF */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${
              syncComplete 
                ? 'bg-green-300 text-gray-800' 
                : presentationUploaded 
                  ? 'bg-amber-200 text-gray-800' 
                  : 'bg-gray-100 text-gray-700'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Pick a Presentation
            </span>
          </div>

          {presentationUploaded ? (
            syncComplete ? (
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-md">
                    {presentationFile?.name || "presentation.pdf"}
                  </p>
                  <p className="text-xs text-gray-500">{totalSlides} {totalSlides === 1 ? 'page' : 'pages'}</p>
                </div>
                <button 
                  className="ml-auto px-3 py-1 text-purple-600 text-sm font-bold border border-purple-600 rounded hover:bg-purple-50"
                  onClick={resetPresentation}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isFullscreen ? (
                  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
                    <div className="bg-white px-4 py-2 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Preview</h3>
                      <button 
                        onClick={toggleFullscreen}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-gray-100">
                      <canvas
                        ref={canvasRef}
                        className="max-h-full max-w-full object-contain shadow-lg"
                      />
                    </div>
                    <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={goToPreviousSlide}
                          className="p-2 rounded-full bg-white shadow hover:bg-gray-200 disabled:opacity-50"
                          disabled={currentSlide <= 1}
                        >
                          <ChevronDown className="w-5 h-5 transform rotate-90" />
                        </button>
                        <button 
                          onClick={goToNextSlide}
                          className="p-2 rounded-full bg-white shadow hover:bg-gray-200 disabled:opacity-50"
                          disabled={currentSlide >= totalSlides}
                        >
                          <ChevronDown className="w-5 h-5 transform -rotate-90" />
                        </button>
                        <span className="text-sm font-medium">
                          {currentSlide} of {totalSlides} Slides
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={usePresentation}
                          className="bg-purple-600 text-white text-sm px-4 py-1 rounded hover:bg-purple-700"
                        >
                          Use this presentation
                        </button>
                        <button
                          onClick={toggleFullscreen}
                          className="border border-gray-300 text-gray-700 text-sm px-4 py-1 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PDF Preview */}
                    <div className="border border-gray-300 rounded pb-2">
                      <div className="w-full h-80 bg-white relative flex justify-center items-center">
                        <canvas
                          ref={canvasRef}
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          onClick={toggleFullscreen}
                          className="absolute bottom-2 right-2 p-1 bg-white rounded shadow text-gray-700 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
                          </svg>
                        </button>
                      </div>

                      {/* Progress bar at the bottom */}
                      <div className="w-full bg-purple-100 h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2" 
                          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                        />
                      </div>

                      {/* Slide navigation with dots */}
                      <div className="flex items-center justify-between mt-2 px-4">
                        <button 
                          onClick={goToPreviousSlide}
                          className="p-1 rounded text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:text-gray-400"
                          disabled={currentSlide <= 1}
                        >
                          <ChevronDown className="w-5 h-5 transform rotate-90" />
                        </button>
                        
                        <div className="flex-1 flex justify-center items-center space-x-1 px-4 overflow-x-auto">
                          {Array.from({ length: totalSlides }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => goToSlide(i + 1)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === i + 1 
                                  ? 'bg-purple-600 w-3 h-3' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                        
                        <button 
                          onClick={goToNextSlide}
                          className="p-1 rounded text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:text-gray-400"
                          disabled={currentSlide >= totalSlides}
                        >
                          <ChevronDown className="w-5 h-5 transform -rotate-90" />
                        </button>
                      </div>
                      
                      <div className="px-4 pt-2 text-sm text-center font-medium text-gray-700">
                        {currentSlide} of {totalSlides} {totalSlides === 1 ? 'Slide' : 'Slides'}
                      </div>
                    </div>

                    {/* Action buttons positioned to the left */}
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={usePresentation}
                        className="bg-purple-600 text-white text-sm py-1.5 px-3 rounded hover:bg-purple-700 transition"
                      >
                        Use this presentation
                      </button>
                      <button
                        onClick={resetPresentation}
                        className="border border-gray-300 text-gray-700 text-sm py-1.5 px-3 rounded hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          ) : presentationUploading ? (
            <div className="space-y-2">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-[16px] font-bold text-gray-800 border-b border-gray-300 py-2 min-w-max">
                  <div>Filename</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm items-center text-gray-700 font-semibold min-w-max py-2">
                  <div className="truncate">
                    {presentationFile?.name || "presentation.pdf"}
                  </div>
                  <div>Presentation</div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden mr-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${presentationUploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs">{presentationUploadProgress}%</span>
                  </div>
                  <div>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1 border border-gray-500 rounded px-4 py-3 text-sm text-gray-600 truncate">
                {presentationFile ? (
                  <span>{presentationFile.name}</span>
                ) : (
                  <span>No file selected</span>
                )}
              </div>
              <label className="ml-4 px-2 py-3 border border-[#6D28D2] text-sm font-bold text-[#6D28D2] hover:bg-[#6D28D2]/10 cursor-pointer transition">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePresentationUpload}
                  className="hidden"
                />
                Select PDF
              </label>
            </div>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            <strong>Note:</strong> A presentation means slides (e.g. PowerPoint, Keynote). Slides are a great way to
            combine text and visuals to explain concepts in an effective and efficient way. Use meaningful graphics and
            clearly legible text!
          </p>
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
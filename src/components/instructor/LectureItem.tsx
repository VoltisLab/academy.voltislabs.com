import React, { useRef, useEffect, useState } from 'react';
import { ContentItemType, Lecture, ContentType, ResourceTabType } from '@/lib/types';
import {Plus, Trash2, Edit3, ChevronDown, ChevronUp, Search, X, CircleCheck, FileText, AlignJustify, Play, SquarePlay} from "lucide-react";
import dynamic from 'next/dynamic';
import AddResourceComponent from './AddResourceComponent';
import DescriptionEditorComponent from './DescriptionEditorComponent';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import VideoSlideMashupComponent from './VideoAndSlideMashup';
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Define the toolbar modules for React Quill
const quillModules = {
  toolbar: {
    container: "#custom-toolbar",
  },
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "link", "image", "code-block"
];

// Tab interfaces
interface TabInterface {
  label: string;
  key: string;
}

// Content interfaces for different content types
interface VideoContent {
  uploadTab: {
    selectedFile: File | null;
  };
  libraryTab: {
    searchQuery: string;
    selectedVideo: string | null;
  };
  activeTab: string;
}

interface VideoSlideContent {
  video: {
    selectedFile: File | null;
  };
  presentation: {
    selectedFile: File | null;
  };
  step: number;
}

interface ArticleContent {
  text: string;
}

interface LectureItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (sectionId: string, lectureId: string, newName: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (sectionId: string, lectureId: string, direction: 'up' | 'down') => void;
  toggleContentSection?: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal?: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor?: (sectionId: string, lectureId: string, currentText: string) => void;
  activeContentSection?: {sectionId: string, lectureId: string} | null;
  activeResourceSection?: {sectionId: string, lectureId: string} | null;
  activeDescriptionSection?: {sectionId: string, lectureId: string} | null;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, sectionId: string, lectureId?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
  sections?: any[];
  updateCurrentDescription?: (description: string) => void;
  saveDescription?: () => void;
  currentDescription?: string;
  children?: React.ReactNode;
}

export default function LectureItem({
  lecture,
  lectureIndex,
  totalLectures,
  sectionId,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  moveLecture,
  toggleContentSection,
  toggleAddResourceModal,
  toggleDescriptionEditor,
  activeContentSection,
  activeResourceSection,
  activeDescriptionSection,
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDragLeave,
  draggedLecture,
  dragTarget,
  sections = [],
  updateCurrentDescription,
  saveDescription,
  currentDescription = '',
  children
}: LectureItemProps) {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [content, setContent] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  // Add these to your existing state variables in the LectureItem component
const [isVideoUploading, setIsVideoUploading] = useState(false);
const [videoUploadProgress, setVideoUploadProgress] = useState(0);
const [videoUploadComplete, setVideoUploadComplete] = useState(false);

const [videoSlideStep, setVideoSlideStep] = useState(1);
const [videoUploading, setVideoUploading] = useState(false);
const [videoUploaded, setVideoUploaded] = useState(false);
const [presentationUploading, setPresentationUploading] = useState(false);
const [presentationUploadProgress, setPresentationUploadProgress] = useState(0);
const [presentationUploaded, setPresentationUploaded] = useState(false);
const [currentSlide, setCurrentSlide] = useState(1);
const [totalSlides, setTotalSlides] = useState(1); // Initialize with 1, will be updated after PDF upload
const [isFullscreen, setIsFullscreen] = useState(false);
const [syncComplete, setSyncComplete] = useState(false);

// Add these handlers for the video and slide mashup

// Handle video upload for video-slide content type
const handleVideoSlideVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    
    // Update the state with the selected file
    setVideoSlideContent({
      ...videoSlideContent,
      video: { selectedFile: file }
    });
    
    // Start the upload process
    setVideoUploading(true);
    setVideoUploadProgress(0);
    
    // Simulate file upload with progress
    const interval = setInterval(() => {
      setVideoUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVideoUploading(false);
            setVideoUploaded(true);
            // Automatically move to step 2 if not already there
            if (videoSlideStep === 1) {
              setVideoSlideStep(2);
            }
          }, 500);
          return 100;
        }
        return prev + 5; // Increase by 5% each time
      });
    }, 200);
  }
};

// Handle presentation (PDF) upload for video-slide content type
const handlePresentationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    
    // Update the state with the selected file
    setVideoSlideContent({
      ...videoSlideContent,
      presentation: { selectedFile: file }
    });
    
    // Start the upload process
    setPresentationUploading(true);
    setPresentationUploadProgress(0);
    
    // Simulate file upload with progress
    const interval = setInterval(() => {
      setPresentationUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPresentationUploading(false);
            setPresentationUploaded(true);
            
            // Attempt to determine the number of pages in the PDF
            determinePDFPageCount(file);
            
            // Automatically move to step 3 if video is already uploaded
            if (videoUploaded && videoSlideStep === 2) {
              setVideoSlideStep(3);
            }
          }, 500);
          return 100;
        }
        return prev + 5; // Increase by 5% each time
      });
    }, 200);
  }
};


// Function to determine the number of pages in a PDF
const determinePDFPageCount = (file: File) => {
  // If we have access to the PDF.js library, we could use it to accurately count pages
  // This is a simplified approach that estimates based on file size
  // In a real implementation, you would use a PDF parsing library
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    if (e.target?.result) {
      try {
        // This is a placeholder for PDF page counting logic
        // In a real implementation, you would use PDF.js or a similar library
        
        // For demonstration purposes, we'll set a reasonable number based on file size
        const fileSize = file.size;
        const estimatedPages = Math.max(1, Math.min(Math.floor(fileSize / 50000), 30));
        
        // If file size is over 50KB, assume multi-page document
        setTotalSlides(estimatedPages);
        setCurrentSlide(1);
        
        console.log(`Estimated ${estimatedPages} pages for PDF with size ${fileSize} bytes`);
      } catch (error) {
        console.error('Error determining PDF page count:', error);
        setTotalSlides(1); // Default to 1 page on error
        setCurrentSlide(1);
      }
    }
  };
  
  reader.readAsArrayBuffer(file);
};

// Handle "Use this presentation" button click
const usePresentation = () => {
  setSyncComplete(true);
  setVideoSlideStep(4);
};

// Slide navigation handlers
const goToPreviousSlide = () => {
  setCurrentSlide(prev => Math.max(1, prev - 1));
};

const goToNextSlide = () => {
  setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
};

// Toggle fullscreen
const toggleFullscreen = () => {
  setIsFullscreen(!isFullscreen);
};



// Add this function to handle the video file upload and progress
const handleVideoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    
    // Update the state with the selected file
    setVideoContent({
      ...videoContent,
      uploadTab: { selectedFile: file }
    });
    
    // Start the upload process
    setIsVideoUploading(true);
    setVideoUploadProgress(0);
    setVideoUploadComplete(false);
    
    // Simulate file upload with progress
    const interval = setInterval(() => {
      setVideoUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVideoUploading(false);
            setVideoUploadComplete(true);
          }, 500);
          return 100;
        }
        return prev + 5; // Increase by 5% each time
      });
    }, 200);
  }
};
  
  // Active content type state
  const [activeContentType, setActiveContentType] = useState<ContentItemType | null>(null);
  
  // States for different content types
  const [videoContent, setVideoContent] = useState<VideoContent>({
    uploadTab: { selectedFile: null },
    libraryTab: { searchQuery: '', selectedVideo: null },
    activeTab: 'uploadVideo'
  });
  
  const [videoSlideContent, setVideoSlideContent] = useState<VideoSlideContent>({
    video: { selectedFile: null },
    presentation: { selectedFile: null },
    step: 1
  });
  
  const [articleContent, setArticleContent] = useState<ArticleContent>({
    text: ''
  });

  // For resource component
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(ResourceTabType.DOWNLOADABLE_FILE);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video tab options
  const videoTabs: TabInterface[] = [
    { label: 'Upload Video', key: 'uploadVideo' },
    { label: 'Add from library', key: 'addFromLibrary' }
  ];

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  const startEditingLecture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLectureId(lecture.id);
  };

  // Determine lecture type label based on contentType
  const getLectureTypeLabel = () => {
    switch (lecture.contentType) {
      case 'video': return 'Lecture';
      case 'article': return 'Article';
      case 'quiz': return 'Quiz';
      case 'coding-exercise': return 'Coding Exercise';
      case 'assignment': return 'Assignment';
      case 'practice': return 'Practice';
      case 'role-play': return 'Role Play';
      default: return 'Item';
    }
  };

  // Handler for content type selection
  const handleContentTypeSelect = (contentType: ContentItemType) => {
    setActiveContentType(contentType);
    setShowContentTypeSelector(false);
    
    // Initialize the appropriate content state based on selection
    if (contentType === 'video') {
      setVideoContent({
        uploadTab: { selectedFile: null },
        libraryTab: { searchQuery: '', selectedVideo: null },
        activeTab: 'uploadVideo'
      });
    } else if (contentType === 'video-slide' as ContentItemType) {
      setVideoSlideContent({
        video: { selectedFile: null },
        presentation: { selectedFile: null },
        step: 1
      });
    } else if (contentType === 'article') {
      setArticleContent({ text: '' });
    }
  };
  
  // Handle video file selection
  const handleVideoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoContent({
        ...videoContent,
        uploadTab: { selectedFile: event.target.files[0] }
      });
    }
  };
  
  // Handle video slide file selections
  const handleVideoSlideFileSelect = (type: 'video' | 'presentation', event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (type === 'video') {
        setVideoSlideContent({
          ...videoSlideContent,
          video: { selectedFile: event.target.files[0] }
        });
      } else {
        setVideoSlideContent({
          ...videoSlideContent,
          presentation: { selectedFile: event.target.files[0] }
        });
      }
    }
  };
  
  // Handle video slide step navigation
  const handleVideoSlideStepChange = (step: number) => {
    setVideoSlideContent({
      ...videoSlideContent,
      step
    });
  };
  
  // Handle article text changes
  const handleArticleTextChange = (text: string) => {
    setArticleContent({
      text
    });
  };

  const handleSaveDescription = () => {
    if (!activeDescriptionSection || !saveDescription) return;
    
    // Call the provided saveDescription function
    saveDescription();
    
    // No need to manually close here as the parent component will handle it
  };
  
  // Handle search in library tab
  const handleSearchLibrary = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", videoContent.libraryTab.searchQuery);
  };

  const isExpanded = activeContentSection?.sectionId === sectionId && 
                     activeContentSection?.lectureId === lecture.id;

  // Determine if the resource section is active for THIS specific lecture
  const isResourceSectionActive = activeResourceSection?.sectionId === sectionId && 
                                 activeResourceSection?.lectureId === lecture.id;

  // Determine if the description section is active for THIS specific lecture
  const isDescriptionSectionActive = activeDescriptionSection?.sectionId === sectionId && 
                                    activeDescriptionSection?.lectureId === lecture.id;

  // Reset content type when section is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setActiveContentType(null);
      setShowContentTypeSelector(false);
    }
  }, [isExpanded]);

  // Helper to render the content based on activeContentType
  const renderContent = () => {
    if (!activeContentType) return null;

    switch (activeContentType) {
      case 'video':
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
          // Library tab code - remains the same
          <div className="py-4">
            {/* Search input (half-width from center to right) */}
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
            <div className=" border-b border-gray-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-3 text-[16px] font-bold border-b border-gray-300">
                <div>Filename</div>
                <div>Type</div>
                <div>Status</div>
                <div className="flex items-center gap-1">
                  Date <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="px-4 py-7 text-center text-gray-500 text-sm">
                No results found.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
        
  case 'video-slide':
  return (
   <VideoSlideMashupComponent/>
  );
    
      
      case 'article':
        return (
          <div className="border border-gray-300 rounded-md p-4">
  {/* Heading */}
  <h3 className="text-sm font-semibold text-gray-800 mb-2">Text</h3>

  {/* Editor Container with pink ring */}
  <div className="focus-within:ring-2 focus-within:ring-[#EC4899] rounded-md transition-all duration-200 border border-gray-300">
    
    {/* Custom toolbar container */}
    <div className="flex justify-between items-center flex-nowrap w-full px-2 py-1 bg-white border-b border-gray-200" id="custom-toolbar">

      
      {/* Quill formatting buttons */}
      <div className="flex items-center gap-2 text-sm text-gray-800">
        <select className="ql-header outline-none border-none bg-transparent" defaultValue="">
          <option value="">Styles</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-code-block" />
      </div>

      {/* Edit HTML toggle button */}
      <div className="shrink-0">
  <button
    onClick={() => setHtmlMode(!htmlMode)}
    className="text-xs font-medium text-gray-800 hover:bg-gray-100 rounded px-3 py-1 whitespace-nowrap"
  >
    {htmlMode ? "Live Preview" : "Edit HTML"}
  </button>
</div>

    </div>

    {/* Editor Body */}
    <div
      className={`h-[66px] px-2 transition-all ${
        htmlMode ? "bg-[#1A1B1F]" : "bg-white"
      }`}
    >
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={{ toolbar: "#custom-toolbar" }}
        formats={quillFormats}
        theme="snow"
        placeholder="Start writing your article content here..."
        className={`h-full [&_.ql-editor]:h-full [&_.ql-editor]:p-2 [&_.ql-toolbar]:!border-0 [&_.ql-container]:!border-0 [&_.ql-toolbar_.ql-formats>*]:!border-0 [&_.ql-toolbar_.ql-formats>*]:!shadow-none ${
          htmlMode
            ? "!text-white [&_.ql-editor]:text-white [&_.ql-editor]:bg-[#1A1B1F]"
            : ""
        }`}
      />
    </div>
  </div>

  {/* Save Button */}
  <div className="flex justify-end pt-4">
    <button className="bg-[#6D28D2] text-white text-sm px-4 py-2 rounded hover:bg-[#5b21b6] transition">
      Save
    </button>
  </div>
</div>

        
        );
      default:
        return null;
    }
  };

  // Simulate uploading a file for resources
  const triggerFileUpload = (contentType: ContentType) => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Update the main component return JSX to properly show the description text
return (
  <div 
    className={`mb-3 bg-white border border-gray-400 ${isExpanded && "border-b border-gray-500 "}${
      draggedLecture === lecture.id ? 'opacity-50' : ''
    } ${
      dragTarget?.lectureId === lecture.id ? 'border-2 border-indigo-500' : ''
    }`}
    draggable={true}
    onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
    onDragEnd={handleDragEnd}
    onDragOver={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDragOver(e);
    }}
    onDragLeave={handleDragLeave}
    onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    <div className={`flex items-center ${isExpanded && "border-b border-gray-500 "} px-3 py-2 `}>
      <div className="flex-1 flex items-center">
        <div className="bg-black rounded-full items-center justify-center mr-2 ">
          <CircleCheck className="text-white bg-gray-800 rounded-full" size={14} />
        </div>
        {editingLectureId === lecture.id ? (
          <input
            ref={lectureNameInputRef}
            type="text"
            value={lecture.name}
            onChange={(e) => updateLectureName(sectionId, lecture.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingLectureId(null);
              }
            }}
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm sm:text-base text-gray-800 truncate max-w-full whitespace-nowrap overflow-hidden flex items-center">
            {getLectureTypeLabel()} {lectureIndex + 1}: <FileText size={15} className="ml-2 inline-block flex-shrink-0" /> 
            <span className="truncate overflow-hidden ml-1">{lecture.name}</span>

            {isHovering && (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditingLecture(e);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLecture(sectionId, lecture.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div className={`hidden sm:flex items-center space-x-1 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!isResourceSectionActive && toggleContentSection) {
              toggleContentSection(sectionId, lecture.id);
              if (!isExpanded) {
                setShowContentTypeSelector(true);
              } else {
                setShowContentTypeSelector(false);
                setActiveContentType(null);
              }
            }
          }}
          className={`${
            (showContentTypeSelector && isExpanded) || isResourceSectionActive || activeContentType
            ? "text-gray-800 font-normal border-b-0 border-l border-t border-r border-gray-400 -mb-[12px] bg-white pb-2" 
            : "text-[#6D28D2] font-medium border-[#6D28D2] hover:bg-indigo-50 rounded "
          } text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center ml-1 sm:ml-2 border`}
        >
          {isResourceSectionActive ? (
            <>
              <span className='font-bold'>Add Resource</span>
              <X 
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (toggleAddResourceModal) {
                    toggleAddResourceModal(sectionId, lecture.id);
                  }
                }}
              />
            </>
          ) : activeContentType === 'video' ? (
            <>
              <span className='font-bold'>Add Video</span>
              <X 
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveContentType(null);
                  if (toggleContentSection) {
                    toggleContentSection(sectionId, lecture.id);
                  }
                }}
              />
            </>
          ) : activeContentType === 'video-slide' ? (
            <>
              <span className='font-bold'>Add Video & Slide Mashup</span>
              <X 
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveContentType(null);
                  if (toggleContentSection) {
                    toggleContentSection(sectionId, lecture.id);
                  }
                }}
              />
            </>
          ) : activeContentType === 'article' ? (
            <>
              <span className='font-bold'>Add Article</span>
              <X 
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveContentType(null);
                  if (toggleContentSection) {
                    toggleContentSection(sectionId, lecture.id);
                  }
                }}
              />
            </>
          ) : showContentTypeSelector && isExpanded ? (
            <>
              <span className='font-bold'>Select content type</span>
              <X 
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContentTypeSelector(false);
                  if (toggleContentSection) {
                    toggleContentSection(sectionId, lecture.id);
                  }
                }}
              />
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> 
              <span className='font-bold'>Content</span>
            </>
          )}
        </button>
        
        <button 
          className="p-1 text-gray-400 hover:text-gray-600 ml-1"
          onClick={(e) => {
            e.stopPropagation();
            if (toggleContentSection) {
              toggleContentSection(sectionId, lecture.id);
              if (isExpanded) {
                setShowContentTypeSelector(false);
                setActiveContentType(null);
              }
            }
          }}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
          
        </button>
        {isHovering && (
          <div className="">
            <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
          </div>
        )}
      </div>
    </div>
    
    {/* Expanded content area */}
    {(isExpanded || isResourceSectionActive || isDescriptionSectionActive) && (
      <div>
        {/* Render Resource Component when active */}
        {isResourceSectionActive && (
          <AddResourceComponent
            activeContentSection={activeResourceSection}
            onClose={() => {
              if (toggleAddResourceModal) {
                toggleAddResourceModal(sectionId, lecture.id);
              }
            }}
            activeResourceTab={activeResourceTab}
            setActiveResourceTab={setActiveResourceTab}
            sections={sections}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            triggerFileUpload={triggerFileUpload}
          />
        )}

        {/* Render Description Component when active */}
        {isDescriptionSectionActive && updateCurrentDescription && saveDescription && (
          <DescriptionEditorComponent
            activeDescriptionSection={activeDescriptionSection}
            onClose={() => {
              if (toggleDescriptionEditor) {
                toggleDescriptionEditor(sectionId, lecture.id, currentDescription);
              }
            }}
            currentDescription={currentDescription || ''}
            setCurrentDescription={updateCurrentDescription}
            saveDescription={saveDescription}
          />
        )}

        {showContentTypeSelector && !activeContentType && !isResourceSectionActive && !isDescriptionSectionActive && (
          <div className="bg-white shadow-sm border border-gray-300 p-2 w-full">          
            <p className="text-xs sm:text-sm text-gray-600 mb-4 mx-auto text-center">
              Select the main type of content. Files and links can be added as resources.
              <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">
                Learn about content types.
              </a>
            </p>
          
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {/* Video Button */}
              <button
                onClick={() => handleContentTypeSelect('video')}
                className="flex flex-col border border-gray-300 w-24 h-20"
              >
                <div className="bg-gray-100 flex-1 flex items-center justify-center">
                  <div className="p-1.5 bg-gray-300 rounded-full">
                    <Play className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="bg-gray-300 text-center py-1">
                  <span className="text-xs text-gray-800">Video</span>
                </div>
              </button>
          
              {/* Video & Slide Button */}
              <button
                onClick={() => handleContentTypeSelect('video-slide')}
                className="flex flex-col border border-gray-300 w-24 h-20"
              >
                <div className="bg-gray-100 flex-1 flex items-center justify-center">
                  <SquarePlay className="text-gray-400 w-5 h-5" />
                </div>
                <div className="bg-gray-300 text-center py-1">
                  <span className="text-xs text-gray-800 leading-tight">
                    Video & Slide<br />Mashup
                  </span>
                </div>
              </button>
          
              {/* Article Button */}
              <button
                onClick={() => handleContentTypeSelect('article')}
                className="flex flex-col border border-gray-300 w-24 h-20"
              >
                <div className="bg-gray-100 flex-1 flex items-center justify-center">
                  <div className="p-1.5 bg-gray-300 rounded-full">
                    <FileText className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="bg-gray-300 text-center py-1">
                  <span className="text-xs text-gray-800">Article</span>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {activeContentType && renderContent()}
        
        {!showContentTypeSelector && !activeContentType && !isResourceSectionActive && !isDescriptionSectionActive && (
  <div className="p-4">
    {/* Display the lecture description if it exists */}
    {lecture.description && (
      <div 
        className="text-gray-700 text-sm mb-3 p-2 border-l-2 border-gray-300 cursor-pointer hover:bg-gray-50"
        onClick={(e) => {
          e.stopPropagation();
          if (toggleDescriptionEditor) {
            toggleDescriptionEditor(sectionId, lecture.id, lecture.description || "");
          }
        }}
        dangerouslySetInnerHTML={{ __html: lecture.description }}
      />
    )}

    {/* Description button - only show if there's no description or if the description component isn't active */}
    {!lecture.description && !isDescriptionSectionActive && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (toggleDescriptionEditor) {
            toggleDescriptionEditor(sectionId, lecture.id, lecture.description || "");
          }
        }}
        className="flex items-center gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="font-bold">Description</span>
      </button>
    )}

    {/* Resource button - only show if the resource component isn't active */}
    {!isResourceSectionActive && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (toggleAddResourceModal) {
            toggleAddResourceModal(sectionId, lecture.id);
          }
        }}
        className={`flex items-center ${!lecture.description ? 'mt-2' : ''} gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50`}
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className='font-bold'>Resources</span>
      </button>
    )}

    {/* Any additional content */}
    {children}
  </div>
)}
      </div>
    )}
  </div>
);
}
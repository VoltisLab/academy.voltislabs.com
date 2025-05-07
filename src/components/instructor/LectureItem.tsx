import React, { useRef, useEffect, useState } from 'react';
import { ContentItemType, Lecture, ContentType, ResourceTabType } from '@/lib/types';
import {Plus, Trash2, Edit3, ChevronDown, ChevronUp, Search, X, CircleCheck, FileText, AlignJustify, Play, SquarePlay} from "lucide-react";
import dynamic from 'next/dynamic';
import AddResourceComponent from './AddResourceComponent';
import DescriptionEditorComponent from './DescriptionEditorComponent';
import { CiCircleCheck } from "react-icons/ci";
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

 

// React Quill styles
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';

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
                      ? 'text-gray-800 font-bold border-b-2 border-gray-800'
                      : 'text-gray-500 hover:text-gray-700'
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
                {/* File selection box */}
                <div className="flex items-center justify-between ">
                  <span className="text-sm text-gray-700 truncate py-3 border border-gray-300 w-[85%] px-4">
                    {videoContent.uploadTab.selectedFile
                      ? videoContent.uploadTab.selectedFile.name
                      : 'No file selected'}
                  </span>
                  <label className="text-sm font-medium text-[#6D28D9] border border-[#6D28D9] px-3 py-2 rounded cursor-pointer hover:bg-[#f5f3ff]">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />
                    Select Video
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  <strong>Note:</strong> All files should be at least 720p and less than 4.0 GB.
                </p>
              </div>
            ) : (
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
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-3 text-xs md:text-sm font-medium border-b border-gray-300">
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
        
      case 'video-slide' as ContentItemType:
        return (
          <div className="border border-gray-300 ">

      {/* Body */}
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* Step 1 - Video */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Pick a Video
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 border border-gray-500 rounded-md px-4 py-2 text-sm text-gray-600 truncate">
              {videoSlideContent.video.selectedFile ? (
                <span>{videoSlideContent.video.selectedFile.name}</span>
              ) : (
                <span>No file selected</span>
              )}
            </div>
            <label className="ml-4 px-4 py-1.5 border border-[#6D28D2] text-sm font-semibold text-[#6D28D2] rounded-md hover:bg-[#6D28D2]/10 cursor-pointer transition">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoSlideFileSelect("video", e)}
                className="hidden"
              />
              Select Video
            </label>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            <strong>Note:</strong> All files should be at least 720p and less than 4.0 GB.
          </p>
        </div>

        {/* Step 2 - PDF */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Pick a Presentation
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 border border-gray-500 rounded-md px-4 py-2 text-sm text-gray-600 truncate">
              {videoSlideContent.presentation.selectedFile ? (
                <span>{videoSlideContent.presentation.selectedFile.name}</span>
              ) : (
                <span>No file selected</span>
              )}
            </div>
            <label className="ml-4 px-4 py-1.5 border border-[#6D28D2] text-sm font-semibold text-[#6D28D2] rounded-md hover:bg-[#6D28D2]/10 cursor-pointer transition">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleVideoSlideFileSelect("presentation", e)}
                className="hidden"
              />
              Select PDF
            </label>
          </div>
          <p className="mt-1.5 text-xs  text-gray-600">
            <strong>Note:</strong> A presentation means slides (e.g. PowerPoint, Keynote). Slides are a great way to
            combine text and visuals to explain concepts in an effective and efficient way. Use meaningful graphics and
            clearly legible text!
          </p>
        </div>

        {/* Step 3 - Sync */}
        <div>
          <div className="flex items-center mb-2 border-b pb-3 border-b-gray-300">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-800">
              Synchronize Video & Presentation
            </span>
          </div>
          <div className="border border-dashed border-gray-600 rounded-md px-4 py-4 text-left text-sm text-gray-600">
            Please pick a video & presentation first
          </div>
        </div>
      </div>
    </div>
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

{isHovering &&(

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
          {/* Action buttons that only show on hover on larger screens */}
          <div className={`hidden sm:flex items-center space-x-1 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, 'up');
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={lectureIndex === 0}
              aria-label="Move up"
            >
              <ChevronUp className={`w-4 h-4 ${lectureIndex === 0 ? 'opacity-50' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, 'down');
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={lectureIndex === totalLectures - 1}
              aria-label="Move down"
            >
              <ChevronDown className={`w-4 h-4 ${lectureIndex === totalLectures - 1 ? 'opacity-50' : ''}`} />
            </button> */}
          </div>
          
          {/* Content button - Modified to change text when content selector is shown */}
          <button 
  onClick={(e) => {
    e.stopPropagation();
    // Only toggle content section if not in resource mode
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
          
          {/* Expand/Collapse button always visible */}
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              // Check if toggleContentSection exists before calling it
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
              {/* Description button - only show if description section is not active */}
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

              {/* Resource button - only show if resource section is not active */}
              {!showContentTypeSelector && !activeContentType && !isResourceSectionActive && !isDescriptionSectionActive && (
              <button
              onClick={(e) => {
                e.stopPropagation();
                if (toggleAddResourceModal) {
                  toggleAddResourceModal(sectionId, lecture.id);
                }
              }}
              className="flex items-center mt-2 gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50"
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
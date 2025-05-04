import React, { useRef, useEffect, useState } from 'react';
import { ContentItemType, Lecture, ContentType } from '@/lib/types';
import { 
  Plus, Trash2, Edit3, ChevronDown, ChevronUp, Move, Search, X, FileText, Upload, Library
} from "lucide-react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Define the toolbar modules for React Quill
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image', 'code-block'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image', 'code-block'
];

// React Quill styles
import 'react-quill-new/dist/quill.snow.css';
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
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDragLeave,
  draggedLecture,
  dragTarget,
  children
}: LectureItemProps) {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
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
            <div className="flex items-center justify-between px-2 py-2 border-b border-gray-300">
              <div className="flex-1">
                <h3 className="text-lg font-medium">Add Video</h3>
              </div>
              <button 
                onClick={() => setActiveContentType(null)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="border-b border-gray-300">
                <div className="flex flex-wrap">
                  {videoTabs.map(tab => (
                    <button
                      key={tab.key}
                      className={`py-2 px-4 text-sm font-medium ${videoContent.activeTab === tab.key 
                        ? 'border-b-2 border-indigo-600 text-indigo-600' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setVideoContent({ ...videoContent, activeTab: tab.key })}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {videoContent.activeTab === 'uploadVideo' ? (
                <div className="py-4">
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
                    <div className="flex-1 truncate text-sm">
                      {videoContent.uploadTab.selectedFile ? (
                        <span>{videoContent.uploadTab.selectedFile.name}</span>
                      ) : (
                        <span>No file selected</span>
                      )}
                    </div>
                    <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
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
                    Note: All files should be at least 720p and less than 4.0 GB.
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <form onSubmit={handleSearchLibrary} className="mb-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          placeholder="Search files by name"
                          value={videoContent.libraryTab.searchQuery}
                          onChange={(e) => setVideoContent({
                            ...videoContent, 
                            libraryTab: { ...videoContent.libraryTab, searchQuery: e.target.value }
                          })}
                          className="w-full sm:w-1/2 justify-end py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                  
                  <div className="border border-gray-300 rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-3 border-b border-gray-300 bg-gray-50 text-xs md:text-sm font-medium">
                      <div>Filename</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div className="flex items-center gap-1">
                        Date <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-4 text-center text-gray-500 text-sm">
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
          <div className="border border-gray-300 rounded-md">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
              <div className="flex-1">
                <h3 className="text-lg font-medium">Add Video & Slide Mashup</h3>
              </div>
              <button 
                onClick={() => setActiveContentType(null)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-2">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                    videoSlideContent.step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium text-sm">Pick a Video</span>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
                    <div className="flex-1 text-sm truncate">
                      {videoSlideContent.video.selectedFile ? (
                        <span>{videoSlideContent.video.selectedFile.name}</span>
                      ) : (
                        <span>No file selected</span>
                      )}
                    </div>
                    <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoSlideFileSelect('video', e)}
                        className="hidden"
                      />
                      Select Video
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Note: All files should be at least 720p and less than 4.0 GB.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                    videoSlideContent.step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium text-sm">Pick a Presentation</span>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
                    <div className="flex-1 text-sm truncate">
                      {videoSlideContent.presentation.selectedFile ? (
                        <span>{videoSlideContent.presentation.selectedFile.name}</span>
                      ) : (
                        <span>No file selected</span>
                      )}
                    </div>
                    <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleVideoSlideFileSelect('presentation', e)}
                        className="hidden"
                      />
                      Select PDF
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Note: A presentation means slides (e.g. PowerPoint, Keynote). Slides are a great way to combine text and visuals to explain concepts in an effective and efficient way. Use meaningful graphics and clearly legible text!
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                    videoSlideContent.step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 font-medium text-sm">Synchronize Video & Presentation</span>
                </div>
                
                <div className="mt-4 p-6 border border-gray-300 rounded-md border-dashed text-center text-gray-500 text-sm">
                  Please pick a video & presentation first
                </div>
              </div>
            </div>
          </div>
        );
        
        case 'article':
          return (
            <div className="border border-gray-300 rounded-md">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">Add Article</h3>
                </div>
                <button 
                  onClick={() => setActiveContentType(null)} 
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="">
                           
                <ReactQuill
                  value={articleContent.text}
                  onChange={(value) => handleArticleTextChange(value)}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  placeholder="Start writing your article content here..."
                  className="bg-white rounded-b-md" 
                  style={{ height: '150px' }}
                />
                
                <div className="mt-16 flex justify-end m-2">
                  <button className="inline-flex items-center px-4 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    Save
                  </button>
                </div>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`mb-3 bg-white rounded-lg border border-gray-300 ${
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
      <div className="flex items-center p-3">
        <div className="flex-1 flex items-center">
          <div className="mr-2 text-gray-600">●</div>
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
            <div className="text-sm sm:text-base truncate max-w-full">{getLectureTypeLabel()} {lectureIndex + 1}: {lecture.name}</div>
          )}
        </div>
        <div className="flex items-center">
          {/* Action buttons that only show on hover on larger screens */}
          <div className={`hidden sm:flex items-center space-x-1 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
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
            <button
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
            </button>
          </div>
          
          {/* Content button always visible */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Check if toggleContentSection exists before calling it
              if (toggleContentSection) {
                toggleContentSection(sectionId, lecture.id);
                if (!isExpanded) {
                  setShowContentTypeSelector(true);
                } else {
                  setShowContentTypeSelector(false);
                  setActiveContentType(null);
                }
              }
            }}
            className="text-indigo-600 font-medium text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md hover:bg-indigo-50 flex items-center ml-1 sm:ml-2 border border-indigo-200"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> 
            <span>Content</span>
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
        </div>
      </div>
      
      {/* Expanded content area */}
      {isExpanded && (
        <div className="">
          {showContentTypeSelector && !activeContentType && (
            <div className="bg-white shadow-sm border border-gray-300 p-2 w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-800 font-medium text-sm sm:text-base">Select content type</h3>
                <button 
                  onClick={() => setShowContentTypeSelector(false)} 
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Select the main type of content. Files and links can be added as resources. 
                <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">Learn about content types.</a>
              </p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <button 
                  onClick={() => handleContentTypeSelect('video')}
                  className="flex flex-col items-center p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-md mb-1 sm:mb-2 flex items-center justify-center">
                    <span className="text-gray-400">▶</span>
                  </div>
                  <span className="text-xs sm:text-sm">Video</span>
                </button>
                
                <button 
                  onClick={() => handleContentTypeSelect('video-slide' as ContentItemType)}
                  className="flex flex-col items-center p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-md mb-1 sm:mb-2 flex items-center justify-center">
                    <span className="text-gray-400">▶⊞</span>
                  </div>
                  <span className="text-xs sm:text-sm">Video & Slide</span>
                </button>
                
                <button 
                  onClick={() => handleContentTypeSelect('article')}
                  className="flex flex-col items-center p-2 sm:p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-md mb-1 sm:mb-2 flex items-center justify-center">
                    <span className="text-gray-400">📄</span>
                  </div>
                  <span className="text-xs sm:text-sm">Article</span>
                </button>
              </div>
            </div>
          )}
          
          {activeContentType && renderContent()}
          
          {!showContentTypeSelector && !activeContentType && (
            <div className="p-2">
              {/* Description button */}
              <button
                onClick={() => {
                  // Check if toggleDescriptionEditor exists before calling it
                  if (toggleDescriptionEditor) {
                    toggleDescriptionEditor(sectionId, lecture.id, lecture.description || "");
                  }
                }}
                className="mb-2 flex items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm text-indigo-600 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Description</span>
              </button>
              
              {/* Resources button */}
              <button
                onClick={() => {
                  // Check if toggleAddResourceModal exists before calling it
                  if (toggleAddResourceModal) {
                    toggleAddResourceModal(sectionId, lecture.id);
                  }
                }}
                className="flex items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm text-indigo-600 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Resources</span>
              </button>
              
              {/* Any additional content */}
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
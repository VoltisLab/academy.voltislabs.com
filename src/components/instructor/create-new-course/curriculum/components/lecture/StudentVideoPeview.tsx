import React, { useState, useEffect, useRef } from 'react';
import {
  Lecture,
  SourceCodeFile,
  VideoContent,
  AttachedFile,
  ExternalResource,
  PreviewSection,
  EnhancedLecture,
  ContentTypeDetector,
  ExtendedLecture,
  ArticleContent,
} from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Play,
  X,
  Volume2,
  Settings,
  Maximize,
  Search,
  Clock,
  Globe,
  Plus,
  Edit,
  Trash2,
  FileDown,
  FileText,
  SquareArrowOutUpRight,
  Code,
  Minimize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactPlayer from "react-player";
import StudentPreviewSidebar from "./StudentPreviewSidebar";
import ReportAbuseModal from "./modals/ReportAbuseModal";
import QuizPreview from "../quiz/QuizPreview";
import AssignmentPreview from "../assignment/AssignmentPreview";
import VideoControls from "./VideoControls";
import LearningReminderModal from './modals/LearningReminderModal';

// Add QuizData interface
interface QuizData {
  id: string;
  name: string;
  description?: string;
  questions: Array<{
    id: string;
    text: string;
    answers: Array<{
      text: string;
      explanation: string;
    }>;
    correctAnswerIndex: number;
    relatedLecture?: string;
    type: string;
  }>;
}

type ChildProps = {
  videoContent: VideoContent;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  lecture: Lecture;
  uploadedFiles?: Array<{ name: string; size: string; lectureId?: string }>;
  sourceCodeFiles?: SourceCodeFile[];
  externalResources?: ExternalResource[];
  section?: {
    id: string;
    name: string;
    sections?: Array<{
      id: string;
      name: string;
      lectures?: Lecture[];
      quizzes?: any[];
      assignments?: any[];
      codingExercises?: any[];
      isExpanded?: boolean;
    }>;
    lectures?: Lecture[];
    quizzes?: any[];
    assignments?: any[];
    codingExercises?: any[];
  };
  articleContent?: ArticleContent;
  quizData?: QuizData;
};

// Define interfaces for missing types
interface Quiz {
  id: string;
  name: string;
  description?: string;
  questions?: any[];
  duration?: string;
  contentType?: string;
}

interface Assignment {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  contentType?: string;
}

interface CodingExercise {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  contentType?: string;
}

// Define a type for notes
type VideoNote = {
  id: string;
  timestamp: number;
  formattedTime: string;
  content: string;
  lectureId: string;
  lectureName?: string;
  sectionName: string;
  createdAt: Date;
};

type SelectedItemType = Lecture | Quiz | Assignment | CodingExercise;

const StudentVideoPreview = ({
  videoContent,
  setShowVideoPreview,
  lecture,
  uploadedFiles = [],
  sourceCodeFiles = [],
  externalResources = [],
  section,
  articleContent = { text: "" },
  quizData,
}: ChildProps) => {
  // State management
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string>(lecture.id);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isContentFullscreen, setIsContentFullscreen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedItemData, setSelectedItemData] = useState<SelectedItemType | null>(lecture);

  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "announcements" | "reviews" | "learning-tools"
  >("overview");

  // Notes specific state
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [currentNoteContent, setCurrentNoteContent] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [allLecturesDropdownOpen, setAllLecturesDropdownOpen] = useState<boolean>(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState<boolean>(false);
  const [selectedLectureFilter, setSelectedLectureFilter] = useState<string>("All lectures");
  const [selectedSortOption, setSelectedSortOption] = useState<string>("Sort by most recent");
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Content type detection
  const detectContentType = (
    lectureId: string, 
    lectureData?: Lecture,
    hasVideoContent?: boolean,
    hasArticleContent?: boolean
  ): string => {
    if (lectureId === lecture.id) {
      const hasRealArticleContent = !!(articleContent && articleContent.text && articleContent.text.trim() !== '');
      const hasRealVideoContent = !!(videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url);

      if (hasRealArticleContent && hasRealVideoContent) {
        return lecture.contentType === 'video' ? 'video' : 'article';
      }
      
      if (hasRealArticleContent && !hasRealVideoContent) {
        return 'article';
      }
      
      if (hasRealVideoContent && !hasRealArticleContent) {
        return 'video';
      }
      
      if (lecture.contentType) {
        return lecture.contentType;
      }

      return 'video';
    }

    if (lectureData) {
      const enhancedLecture = lectureData as EnhancedLecture;
      
      if (enhancedLecture.actualContentType) {
        return enhancedLecture.actualContentType;
      }

      if (enhancedLecture.hasArticleContent) {
        return 'article';
      }
      
      if (enhancedLecture.hasVideoContent) {
        return 'video';
      }

      if (lectureData.contentType) {
        return lectureData.contentType;
      }

      return 'video';
    }

    return 'video';
  };

  const determineInitialContentType = (): string => {
    const detectedType = detectContentType(lecture.id, lecture);
    return detectedType;
  };

  const [activeItemType, setActiveItemType] = useState<string>(determineInitialContentType());

  // Process sections
  const processedSections = React.useMemo(() => {
    if (!section) return [];

    if (section.sections && Array.isArray(section.sections)) {
      return section.sections;
    }

    if (section.lectures || section.quizzes || section.assignments || section.codingExercises) {
      return [{
        id: section.id,
        name: section.name,
        lectures: section.lectures || [],
        quizzes: section.quizzes || [],
        assignments: section.assignments || [],
        codingExercises: section.codingExercises || [],
        isExpanded: true
      }];
    }

    return [];
  }, [section]);

  // Get all items in order for navigation
  const getAllItemsInOrder = () => {
    const items: { id: string; type: string; sectionId: string; item: any }[] = [];
    
    processedSections.forEach(section => {
      section.lectures?.forEach(lecture => {
        items.push({ id: lecture.id, type: 'lecture', sectionId: section.id, item: lecture });
      });
      section.quizzes?.forEach(quiz => {
        items.push({ id: quiz.id, type: 'quiz', sectionId: section.id, item: quiz });
      });
      section.assignments?.forEach(assignment => {
        items.push({ id: assignment.id, type: 'assignment', sectionId: section.id, item: assignment });
      });
      section.codingExercises?.forEach(exercise => {
        items.push({ id: exercise.id, type: 'coding-exercise', sectionId: section.id, item: exercise });
      });
    });
    
    return items;
  };

  // Check if current item is last in section
  const isLastItemInSection = () => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex(item => item.id === activeItemId);
    
    if (currentIndex === -1) return false;
    
    const currentItem = allItems[currentIndex];
    const sectionItems = allItems.filter(item => item.sectionId === currentItem.sectionId);
    const lastSectionItem = sectionItems[sectionItems.length - 1];
    
    return currentItem.id === lastSectionItem.id;
  };

  // Navigate to next/previous item
  const navigateToItem = (direction: 'next' | 'prev') => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex(item => item.id === activeItemId);
    
    if (currentIndex === -1) return;
    
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (targetIndex >= 0 && targetIndex < allItems.length) {
      const targetItem = allItems[targetIndex];
      handleItemSelect(targetItem.id, targetItem.type);
    }
  };

  // Go to first item of next section
  const goToNextSection = () => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex(item => item.id === activeItemId);
    
    if (currentIndex === -1) return;
    
    const currentItem = allItems[currentIndex];
    const nextSectionItems = allItems.filter(item => 
      item.sectionId !== currentItem.sectionId && 
      allItems.indexOf(item) > currentIndex
    );
    
    if (nextSectionItems.length > 0) {
      const firstItemInNextSection = nextSectionItems[0];
      handleItemSelect(firstItemInNextSection.id, firstItemInNextSection.type);
    }
  };

  // Handle item selection
  const handleItemSelect = (itemId: string, itemType: string) => {
    console.log(`🎯 Selected item: ${itemId}, type: ${itemType}`);
    
    let selectedItem: SelectedItemType | undefined;
    let selectedEnhancedLecture: EnhancedLecture | undefined;

    for (const sectionData of processedSections) {
      if (sectionData.lectures) {
        const foundLecture = sectionData.lectures.find((l: Lecture) => l.id === itemId);
        if (foundLecture) {
          selectedItem = foundLecture;
          selectedEnhancedLecture = foundLecture as EnhancedLecture;
          break;
        }
      }
      
      if (sectionData.quizzes) {
        const foundQuiz = sectionData.quizzes.find((q: any) => q.id === itemId);
        if (foundQuiz) {
          selectedItem = foundQuiz;
          break;
        }
      }
      
      if (sectionData.assignments) {
        const foundAssignment = sectionData.assignments.find((a: any) => a.id === itemId);
        if (foundAssignment) {
          selectedItem = foundAssignment;
          break;
        }
      }
      
      if (sectionData.codingExercises) {
        const foundExercise = sectionData.codingExercises.find((e: any) => e.id === itemId);
        if (foundExercise) {
          selectedItem = foundExercise;
          break;
        }
      }
    }

    setActiveItemId(itemId);
    setActiveItemType(itemType);

    if (selectedItem) {
      setSelectedItemData(selectedItem);
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Video handlers
  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(duration, progress + 5);
      playerRef.current.seekTo(newTime / duration);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const newTime = Math.max(0, progress - 5);
      playerRef.current.seekTo(newTime / duration);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle fullscreen for content
  const handleContentFullscreen = () => {
    setIsContentFullscreen(!isContentFullscreen);
    if (!isContentFullscreen) {
      setIsExpanded(true); // Automatically expand when going fullscreen
    }
  };

  // Handle expand/collapse
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle report abuse
  const handleReportAbuse = () => {
    setShowReportModal(true);
    setShowSettingsDropdown(false);
  };

  const handleReportSubmit = (issueType: string, issueDetails: string) => {
    console.log("Report submitted:", { issueType, issueDetails });
    setShowReportModal(false);
  };

  // Get current content
  const getCurrentContent = () => {
    if (activeItemType === "quiz") {
      const currentQuizData = selectedItemData && 'questions' in selectedItemData 
        ? selectedItemData as QuizData 
        : quizData;
      return { type: "quiz", data: currentQuizData };
    } else if (activeItemType === "article") {
      let currentArticleData: ArticleContent;
      
      if (activeItemId === lecture.id) {
        currentArticleData = articleContent || { text: "" };
      } else {
        const enhancedSelectedItem = selectedItemData as EnhancedLecture;
        
        if (enhancedSelectedItem?.articleContent?.text) {
          currentArticleData = enhancedSelectedItem.articleContent;
        } else if (enhancedSelectedItem?.description && enhancedSelectedItem.description.includes('<')) {
          currentArticleData = { text: enhancedSelectedItem.description };
        } else {
          currentArticleData = { 
            text: `<h1>${selectedItemData?.name || 'Article'}</h1><p>Article content for this lecture.</p>` 
          };
        }
      }
      
      return { type: "article", data: currentArticleData };
    } else if (activeItemType === "assignment") {
      return { type: "assignment", data: selectedItemData };
    } else if (activeItemType === "coding-exercise") {
      return { type: "coding-exercise", data: selectedItemData };
    } else {
      let currentVideoData;
      
      if (activeItemId === lecture.id) {
        currentVideoData = videoContent;
      } else {
        const enhancedSelectedItem = selectedItemData as EnhancedLecture;
        
        if (enhancedSelectedItem?.videoDetails) {
          currentVideoData = { 
            ...videoContent,
            selectedVideoDetails: enhancedSelectedItem.videoDetails 
          };
        } else {
          currentVideoData = {
            ...videoContent,
            selectedVideoDetails: null
          };
        }
      }
      
      return { type: "video", data: currentVideoData };
    }
  };

  // Notes handlers
  const handleCreateNote = () => {
    setIsAddingNote(true);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };

  const handleSaveNote = () => {
    if (editingNoteId) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, content: currentNoteContent }
            : note
        )
      );
    } else {
      const newNote: VideoNote = {
        id: Date.now().toString(),
        timestamp: progress,
        formattedTime: formatTime(progress),
        content: currentNoteContent,
        lectureId: activeItemId || "default-lecture",
        lectureName: selectedItemData?.name || "Current Item",
        sectionName: "Demo Section",
        createdAt: new Date(),
      };

      setNotes([newNote, ...notes]);
    }

    setIsAddingNote(false);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };

  const handleCancelNote = () => {
    setIsAddingNote(false);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };

  const handleEditNote = (noteId: string) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      setCurrentNoteContent(noteToEdit.content);
      setEditingNoteId(noteId);
      setIsAddingNote(true);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const getSortedNotes = () => {
    let filteredNotes = [...notes];

    if (selectedLectureFilter === "Current lecture") {
      filteredNotes = filteredNotes.filter(
        (note) => note.lectureId === activeItemId
      );
    }

    if (selectedSortOption === "Sort by most recent") {
      filteredNotes.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } else if (selectedSortOption === "Sort by oldest") {
      filteredNotes.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    }

    return filteredNotes;
  };

  // Search toggle
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setActiveTab("overview");
    }
  };

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allLecturesDropdownOpen || sortByDropdownOpen || showSettingsDropdown) {
        setAllLecturesDropdownOpen(false);
        setSortByDropdownOpen(false);
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [allLecturesDropdownOpen, sortByDropdownOpen, showSettingsDropdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && activeItemType === "video") {
        setPlaying(!playing);
        e.preventDefault();
      } else if (e.code === "KeyB" && activeTab === "notes" && !isAddingNote) {
        handleCreateNote();
        e.preventDefault();
      } else if (e.code === "ArrowRight" && activeItemType === "video") {
        handleForward();
        e.preventDefault();
      } else if (e.code === "ArrowLeft" && activeItemType === "video") {
        handleRewind();
        e.preventDefault();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [playing, activeTab, isAddingNote, activeItemType]);

  const shouldShowPreview =
    videoContent.selectedVideoDetails ||
    (articleContent && articleContent.text) ||
    (activeItemType === "quiz" && (quizData || selectedItemData)) ||
    activeItemType === "assignment" ||
    activeItemType === "coding-exercise" ||
    activeItemType === "video" ||
    selectedItemData;

  if (!shouldShowPreview) {
    return null;
  }

  const currentContent = getCurrentContent();

  // Render bottom bar based on content type
  const renderBottomBar = () => {
    if (isContentFullscreen) return null;

    return (
      <div className="bg-white border-t border-gray-200 flex items-center px-4 py-2 relative">
        <div className="flex items-center justify-between w-full max-w-[78vw] mx-auto">
          {/* Left side content */}
          <div className="flex items-center">
            {activeItemType === "assignment" && (
              <button
                className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50"
                onClick={() => {/* Handle go to summary */}}
                type="button"
              >
                Go to summary
              </button>
            )}
            {activeItemType === "coding-exercise" && (
              <span className="text-gray-700 font-medium">Coding exercise</span>
            )}
          </div>

          {/* Center content - Article navigation */}
          {activeItemType === "article" && (
            <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => navigateToItem('prev')}
                type="button"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => navigateToItem('next')}
                type="button"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Right side content */}
          <div className="flex items-center space-x-2">
            {/* Next lecture button for assignments */}
            {activeItemType === "assignment" && (
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium"
                onClick={() => navigateToItem('next')}
                type="button"
              >
                Next lecture
              </button>
            )}

            {/* Next button for coding exercise (only if last item in section) */}
            {activeItemType === "coding-exercise" && isLastItemInSection() && (
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium"
                onClick={goToNextSection}
                type="button"
              >
                Next
              </button>
            )}

            {/* Settings dropdown */}
            <div className="relative">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                type="button"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettingsDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={handleReportAbuse}
                    type="button"
                  >
                    Report abuse
                  </button>
                </div>
              )}
            </div>

            {/* Fullscreen button */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={handleContentFullscreen}
              type="button"
              aria-label={isContentFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isContentFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>

            {/* Expand/Collapse button */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={handleExpand}
              type="button"
              aria-label={isExpanded ? "Show sidebar" : "Hide sidebar"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isExpanded ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      <div className="flex flex-1 h-full">
        {/* Main scrollable container */}
        <div
          ref={mainContentRef}
          className="flex-1 flex flex-col overflow-y-auto"
          style={{ 
            width: isExpanded ? "100%" : "calc(100% - 320px)",
            transition: "width 0.3s ease-in-out"
          }}
        >
          {/* Content area */}
          <div className="flex-shrink-0" style={{ height: isContentFullscreen ? "100vh" : "calc(100vh - 280px)" }}>
            {activeItemType === "quiz" ? (
              <div className="bg-white relative h-full">
                <QuizPreview quiz={currentContent.data as QuizData} />
              </div>
            ) : activeItemType === "coding-exercise" ? (
              <div className="flex w-full h-full">
                <div className="w-64 bg-white border-r border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold">Instructions</h2>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-3">
                      {selectedItemData?.name || "Coding Exercise"}
                    </h3>
                    <div className="text-sm text-gray-700 mt-2">
                      {selectedItemData?.description ||
                        "Complete the exercise by writing the required code."}
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-900 flex flex-col">
                  <div className="flex-1 flex items-center justify-center text-white">
                    <p>Code Editor Interface</p>
                  </div>
                  <div className="p-4 border-t border-gray-700 flex items-center space-x-4">
                    <button
                      className="bg-white text-gray-800 rounded px-4 py-2 text-sm font-medium flex items-center"
                      type="button"
                    >
                      <span className="mr-2">▶</span> Run tests
                    </button>
                    <button
                      className="text-white text-sm font-medium"
                      type="button"
                    >
                      Reset
                    </button>
                    <div className="flex-1"></div>
                    <div className="text-sm text-gray-400">
                      All changes saved | Line 1, Column 1
                    </div>
                  </div>
                </div>
              </div>
            ) : activeItemType === "assignment" ? (
              <div className="w-full h-full">
                <AssignmentPreview
                  assignmentData={currentContent.data as ExtendedLecture}
                />
              </div>
            ) : activeItemType === "article" ? (
              <div className="bg-white relative h-full">
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto max-w-[78vw] mx-auto">
                  <h1 className="text-2xl font-bold mb-4">
                    {selectedItemData?.name || "Article"}
                  </h1>
                  <div
                    className="article-content prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: (currentContent.data as ArticleContent)?.text || "",
                    }}
                  />

                  {/* Resources section */}
                  {(uploadedFiles.filter(f => f.lectureId === activeItemId).length > 0 ||
                    sourceCodeFiles.filter(f => f.lectureId === activeItemId).length > 0 ||
                    externalResources.filter(r => r.lectureId === activeItemId).length > 0) && (
                    <div className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Resources for this {activeItemType}
                      </h2>

                      <div className="space-y-3">
                        {uploadedFiles.filter(f => f.lectureId === activeItemId).map((file, index) => (
                          <div
                            key={`uploaded-${index}`}
                            className="flex items-center"
                          >
                            <FileDown className="w-5 h-5 text-gray-600 mr-2" />
                            <a
                              href="#"
                              className="text-blue-600 hover:underline font-medium"
                              onClick={(e) => e.preventDefault()}
                            >
                              {file.name}
                            </a>
                          </div>
                        ))}

                        {sourceCodeFiles.filter(f => f.lectureId === activeItemId).map((file, index) => (
                          <div
                            key={`code-${index}`}
                            className="flex items-center"
                          >
                            <Code className="w-5 h-5 text-gray-600 mr-2" />
                            <a
                              href="#"
                              className="text-blue-600 hover:underline font-medium"
                              onClick={(e) => e.preventDefault()}
                            >
                              {file.name || file.filename}
                            </a>
                          </div>
                        ))}

                        {externalResources.filter(r => r.lectureId === activeItemId).map((resource, index) => (
                          <div
                            key={`external-${index}`}
                            className="flex items-center"
                          >
                            <SquareArrowOutUpRight className="w-5 h-5 text-gray-600 mr-2" />
                            <a
                              href={resource.url}
                              className="text-blue-600 hover:underline font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {typeof resource.title === "string"
                                ? resource.title
                                : resource.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Video content
              <div className="bg-black relative w-full h-full">
                <div
                  ref={playerContainerRef}
                  className="relative w-full h-full flex"
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  <div className="relative w-full h-full mx-auto">
                    <ReactPlayer
                      ref={playerRef}
                      url={
                        (currentContent.data as any)?.selectedVideoDetails?.url ||
                        videoContent.selectedVideoDetails?.url ||
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      }
                      width="100%"
                      height="100%"
                      playing={playing}
                      volume={volume}
                      playbackRate={playbackRate}
                      onProgress={handleProgress}
                      onDuration={handleDuration}
                      progressInterval={100}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                          },
                        },
                      }}
                    />

                    {!playing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <button
                          className="rounded-full bg-black bg-opacity-70 p-4 hover:bg-opacity-90 transition-all"
                          type="button"
                          aria-label="Play video"
                          onClick={() => setPlaying(true)}
                        >
                          <Play
                            size={80}
                            className="p-3 rounded-full bg-gray-800 text-white"
                          />
                        </button>
                      </div>
                    )}

                    {/* Video controls for video content */}
                    {activeItemType === "video" && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <VideoControls
                          playing={playing}
                          progress={progress}
                          duration={duration}
                          volume={volume}
                          playbackRate={playbackRate}
                          onPlayPause={() => setPlaying(!playing)}
                          onRewind={handleRewind}
                          onForward={handleForward}
                          onVolumeChange={setVolume}
                          onPlaybackRateChange={setPlaybackRate}
                          onFullscreen={handleContentFullscreen}
                          onExpand={handleExpand}
                          formatTime={formatTime}
                          currentVideoDetails={(currentContent.data as any)?.selectedVideoDetails}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom bar for non-video content */}
          {activeItemType !== "video" && renderBottomBar()}

          {/* Bottom content tabs */}
          {!isContentFullscreen && (
            <div className="bg-white border-t border-gray-200 flex-shrink-0">
              <div className="max-w-[78vw] mx-auto">
                {/* Tabs */}
                <div className="flex items-center border-b border-gray-200">
                  <button
                    className={`px-4 py-3 text-gray-500 hover:text-gray-700 ${
                      showSearch ? "text-gray-700 border-b-2 border-gray-700" : ""
                    }`}
                    type="button"
                    aria-label="Search"
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {[
                    { id: "overview", label: "Overview" },
                    { id: "notes", label: "Notes" },
                    { id: "announcements", label: "Announcements" },
                    { id: "reviews", label: "Reviews" },
                    { id: "learning-tools", label: "Learning tools" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`px-6 py-3 text-sm font-bold ${
                        activeTab === tab.id && !showSearch
                          ? "text-gray-700 border-b-2 border-gray-700"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      onClick={() => {
                        setActiveTab(tab.id as typeof activeTab);
                        setShowSearch(false);
                      }}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto">
                  {showSearch && (
                    <div className="px-6 py-8">
                      <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Search course content"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            autoFocus
                          />
                          <button
                            className="absolute right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md"
                            aria-label="Search"
                            type="button"
                          >
                            <Search className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          Start a new search
                        </h3>
                        <p className="text-gray-600">To find lectures or resources</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "overview" && !showSearch && (
                    <div className="p-6">
                      <div className="flex items-center gap-8 mb-6">
                        <div className="flex flex-col items-center">
                          <span className="text-amber-700 text-lg font-bold mr-1">
                            0.0 <span className="text-amber-700">★</span>
                          </span>
                          <span className="text-gray-500 text-xs ml-1">
                            (0 ratings)
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-700 font-bold">0</div>
                          <div className="text-gray-500 text-xs">Students</div>
                        </div>
                        <div>
                          <div className="text-gray-700 font-bold">
                            {selectedItemData?.duration || "2mins"}
                          </div>
                          <div className="text-gray-500 text-xs">Total</div>
                        </div>
                      </div>

                      <div className="mb-6 space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">Published May 2025</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="text-sm">English</span>
                        </div>
                      </div>

                      <div className="border-b border-gray-300 mb-8">
                        <div className="p-6 border border-gray-300 rounded-lg">
                          <div className="flex items-start">
                            <Clock className="text-gray-500 w-5 h-5 mr-3 mt-1" />
                            <div>
                              <h4 className="font-medium text-base mb-2">
                                Schedule learning time
                              </h4>
                              <p className="text-sm text-gray-600 mb-4">
                                Learning a little each day adds up. Research shows
                                that students who make learning a habit are more
                                likely to reach their goals. Set time aside to learn
                                and get reminders using your learning scheduler.
                              </p>
                              <div className="flex">
                                <button
                                  type="button"
                                  className="bg-[#6D28D2] hover:bg-[#7D28D2] text-white text-sm py-2 px-4 rounded-md mr-3 font-medium"
                                  onClick={() => setShowLearningModal(true)}
                                >
                                  Get started
                                </button>
                                <button
                                  type="button"
                                  className="text-[#6D28D2] hover:text-[#7D28D2] text-sm py-2 px-4 font-medium"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3">
                        <h3 className="text-gray-700 text-sm mb-4">By the numbers</h3>

                        <div className="mr-12">
                          <p className="text-sm text-gray-700">Skill level:</p>
                          <p className="text-sm text-gray-700">Students: 0</p>
                          <p className="text-sm text-gray-700">Languages: English</p>
                          <p className="text-sm text-gray-700">Captions: No</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-700">
                            Content Type: {activeItemType}
                          </p>
                          <p className="text-sm text-gray-700">
                            Duration: {selectedItemData?.duration || "2 mins"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b grid grid-cols-3 items-center border-gray-200 mr-7">
                        <h3 className="text-sm text-gray-700">Features</h3>
                        <div className="flex items-center text-gray-700 font-medium">
                          <p className="text-sm">Available on </p>
                          <a
                            href="#"
                            className="text-purple-600 mx-1 text-sm font-medium"
                          >
                            iOS
                          </a>
                          <p className="text-sm">and</p>
                          <a
                            href="#"
                            className="text-purple-600 mx-1 text-sm font-medium"
                          >
                            Android
                          </a>
                        </div>
                      </div>

                      <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3 mr-10">
                        <h3 className="text-sm text-gray-700">Description</h3>
                        <div className="text-sm text-gray-700 col-span-2">
                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Content Details
                            </h4>
                            <p className="mb-4">
                              {selectedItemData?.description || `This is a ${activeItemType} content item.`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 mr-10">
                        <h3 className="text-sm text-gray-700">Instructor</h3>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                            SS
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Stanley Samuel</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && !showSearch && (
                    <div className="p-6 flex flex-col items-center">
                      {!isAddingNote ? (
                        <div className="mb-4 w-full max-w-3xl">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={`Create a new note at ${formatTime(progress)}`}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                              onClick={handleCreateNote}
                              readOnly
                            />
                            <button
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                              aria-label="Add note"
                              onClick={handleCreateNote}
                              type="button"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 w-full max-w-3xl">
                          <div className="bg-black text-white text-sm px-3 py-1 rounded-t-md inline-block">
                            {formatTime(progress)}
                          </div>
                          <div className="border border-purple-200 rounded-md p-2 rounded-tl-none">
                            <div className="border-b border-gray-200 pb-2 mb-2 flex items-center">
                              <button className="px-2 py-1 text-sm">Styles</button>
                              <button className="px-2 py-1 text-sm font-bold">B</button>
                              <button className="px-2 py-1 text-sm italic">I</button>
                              <button className="px-2 py-1 text-sm">≡</button>
                              <button className="px-2 py-1 text-sm">≡</button>
                              <button className="px-2 py-1 text-sm">&lt;&gt;</button>
                              <div className="ml-auto text-gray-400 text-sm">1000</div>
                            </div>
                            <textarea
                              className="w-full min-h-32 resize-none focus:outline-none focus:ring-0 border-0 p-2"
                              value={currentNoteContent}
                              onChange={(e) => setCurrentNoteContent(e.target.value)}
                              placeholder="Enter your note here..."
                              autoFocus
                            />
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              className="text-gray-700 font-medium mr-3 hover:text-gray-900"
                              onClick={handleCancelNote}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:bg-purple-300"
                              onClick={handleSaveNote}
                              disabled={!currentNoteContent.trim()}
                              type="button"
                            >
                              Save note
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 mb-6 w-full max-w-3xl">
                        <div className="relative">
                          <button
                            className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] text-[#6D28D2] rounded-md font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAllLecturesDropdownOpen(!allLecturesDropdownOpen);
                              setSortByDropdownOpen(false);
                            }}
                            type="button"
                          >
                            <span>{selectedLectureFilter}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>

                          {allLecturesDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10 w-48">
                              <div className="p-2">
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLectureFilter("All lectures");
                                    setAllLecturesDropdownOpen(false);
                                  }}
                                  type="button"
                                >
                                  All lectures
                                </button>
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLectureFilter("Current lecture");
                                    setAllLecturesDropdownOpen(false);
                                  }}
                                  type="button"
                                >
                                  Current lecture
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] rounded-md text-[#6D28D2] font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSortByDropdownOpen(!sortByDropdownOpen);
                              setAllLecturesDropdownOpen(false);
                            }}
                            type="button"
                          >
                            <span>{selectedSortOption}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>

                          {sortByDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                              <div className="p-2">
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSortOption("Sort by most recent");
                                    setSortByDropdownOpen(false);
                                  }}
                                  type="button"
                                >
                                  Sort by most recent
                                </button>
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSortOption("Sort by oldest");
                                    setSortByDropdownOpen(false);
                                  }}
                                  type="button"
                                >
                                  Sort by oldest
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {getSortedNotes().length > 0 ? (
                        <div className="w-full max-w-3xl">
                          {getSortedNotes().map((note) => (
                            <div key={note.id} className="mb-4">
                              <div className="flex items-center mb-2">
                                <div className="bg-black text-white text-xs px-2 py-1 rounded-sm mr-3">
                                  {note.formattedTime}
                                </div>
                                <div className="text-sm text-gray-700 font-medium mr-2">
                                  {note.sectionName && `${note.sectionName}.`} {note.lectureName}
                                </div>
                                <div className="ml-auto flex">
                                  <button
                                    className="text-gray-500 hover:text-purple-600 p-1"
                                    onClick={() => handleEditNote(note.id)}
                                    type="button"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-500 hover:text-red-600 p-1 ml-1"
                                    onClick={() => handleDeleteNote(note.id)}
                                    type="button"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700">{note.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                          <p className="text-gray-600 mb-2">
                            Click the "Create a new note" box, the "+" button, or
                            press "B" to make your first note.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "announcements" && !showSearch && (
                    <div className="p-6">
                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold mb-2">
                          No announcements posted yet
                        </h3>
                        <p className="text-gray-600">
                          The instructor hasn't added any announcements to this course
                          yet. Announcements are used to inform you of updates or
                          additions to the course.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && !showSearch && (
                    <div className="p-6">
                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold mb-2">Student feedback</h3>
                        <p className="text-gray-600">
                          This course doesn't have any reviews yet.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "learning-tools" && !showSearch && (
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Learning reminders</h3>
                        <p className="text-gray-600 mb-4">
                          Set up push notifications or calendar events to stay on
                          track for your learning goals.
                        </p>

                        <button
                          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                          onClick={() => setShowLearningModal(true)}
                          type="button"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          <span>Add a learning reminder</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!isExpanded && (
          <StudentPreviewSidebar
            currentLectureId={activeItemId}
            setShowVideoPreview={setShowVideoPreview}
            sections={processedSections}
            uploadedFiles={uploadedFiles}
            sourceCodeFiles={sourceCodeFiles}
            externalResources={externalResources}
            onSelectItem={handleItemSelect}
          />
        )}
      </div>

      {/* Exit fullscreen button */}
      {isContentFullscreen && (
        <button
          className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 focus:outline-none z-50"
          onClick={handleContentFullscreen}
          type="button"
        >
          Exit fullscreen
        </button>
      )}

      {/* Modals */}
      <LearningReminderModal
        isOpen={showLearningModal}
        onClose={() => setShowLearningModal(false)}
      />

      <ReportAbuseModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default StudentVideoPreview;
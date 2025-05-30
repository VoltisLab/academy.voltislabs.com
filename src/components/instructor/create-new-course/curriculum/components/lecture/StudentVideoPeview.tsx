"use client"
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
  Keyboard,
  ChevronDown,
} from "lucide-react";
import ReactPlayer from "react-player";
import StudentPreviewSidebar from "./StudentPreviewSidebar";
import ReportAbuseModal from "./modals/ReportAbuseModal";
import QuizPreview from "../quiz/QuizPreview";
import AssignmentPreview from "../assignment/AssignmentPreview";
import VideoControls from "./VideoControls";
import LearningReminderModal from "./modals/LearningReminderModal";
import BottomTabsContainer from "./BottomTabsContainer";
import { useRouter } from 'next/navigation'; 

// Add ContentInformationDisplay component
const ContentInformationDisplay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contentData: {
    contentType: string;
    isEncrypted: boolean;
    courseHasEncryptedVideos: boolean;
  };
}> = ({ isOpen, onClose, contentData }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black flex justify-center z-50">
      <div className="text-white rounded-lg p-8 w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-center">Content information</h2>
        
        <div className="space-y-4">
          <div>
            <span className="font-medium">Content type: </span>
            <span className="capitalize">{contentData.contentType}</span>
          </div>
          
          <div>
            <span className="font-medium">Course contains encrypted videos: </span>
            <span>{contentData.courseHasEncryptedVideos ? 'Yes' : 'No'}</span>
          </div>
          
          <div>
            <span className="font-medium">Is this video encrypted: </span>
            <span>{contentData.isEncrypted ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [videoQuality, setVideoQuality] = useState<string>('Auto');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string>(lecture.id);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] =
    useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isContentFullscreen, setIsContentFullscreen] =
    useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedItemData, setSelectedItemData] = useState<SelectedItemType | null>(lecture);
  const [showQuizKeyboardShortcuts, setShowQuizKeyboardShortcuts] = useState<boolean>(false);
  const [showVideoKeyboardShortcuts, setShowVideoKeyboardShortcuts] = useState<boolean>(false);
  
  // Add state for content information modal
  const [showContentInformation, setShowContentInformation] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "announcements" | "reviews" | "learning-tools"
  >("overview");

  // Notes specific state
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [currentNoteContent, setCurrentNoteContent] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [allLecturesDropdownOpen, setAllLecturesDropdownOpen] =
    useState<boolean>(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState<boolean>(false);
  const [selectedLectureFilter, setSelectedLectureFilter] =
    useState<string>("All lectures");
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    "Sort by most recent"
  );
  const [startAssignment, setStartAssignment] = useState<boolean>(false);
  const [assignmentStatus, setAssignmentStatus] = useState<
    "overview" | "assignment" | "summary/feedback"
  >("overview");
   const router = useRouter();

  const handleStartAssignment = () => {
    setAssignmentStatus("assignment");
  };

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
      const hasRealArticleContent = !!(
        articleContent &&
        articleContent.text &&
        articleContent.text.trim() !== ""
      );
      const hasRealVideoContent = !!(
        videoContent.selectedVideoDetails &&
        videoContent.selectedVideoDetails.url
      );

      if (hasRealArticleContent && hasRealVideoContent) {
        return lecture.contentType === "video" ? "video" : "article";
      }

      if (hasRealArticleContent && !hasRealVideoContent) {
        return "article";
      }

      if (hasRealVideoContent && !hasRealArticleContent) {
        return "video";
      }

      if (lecture.contentType) {
        return lecture.contentType;
      }

      return "video";
    }

    if (lectureData) {
      const enhancedLecture = lectureData as EnhancedLecture;

      if (enhancedLecture.actualContentType) {
        return enhancedLecture.actualContentType;
      }

      if (enhancedLecture.hasArticleContent) {
        return "article";
      }

      if (enhancedLecture.hasVideoContent) {
        return "video";
      }

      if (lectureData.contentType) {
        return lectureData.contentType;
      }

      return "video";
    }

    return "video";
  };

  const determineInitialContentType = (): string => {
    const detectedType = detectContentType(lecture.id, lecture);
    return detectedType;
  };

  const [activeItemType, setActiveItemType] = useState<string>(
    determineInitialContentType()
  );

  // Process sections
  const processedSections = React.useMemo(() => {
    if (!section) return [];

    if (section.sections && Array.isArray(section.sections)) {
      return section.sections;
    }

    if (
      section.lectures ||
      section.quizzes ||
      section.assignments ||
      section.codingExercises
    ) {
      return [
        {
          id: section.id,
          name: section.name,
          lectures: section.lectures || [],
          quizzes: section.quizzes || [],
          assignments: section.assignments || [],
          codingExercises: section.codingExercises || [],
          isExpanded: true,
        },
      ];
    }

    return [];
  }, [section]);

  // Get all items in order for navigation
  const getAllItemsInOrder = () => {
    const items: { id: string; type: string; sectionId: string; item: any }[] =
      [];

    processedSections.forEach((section) => {
      section.lectures?.forEach((lecture) => {
        items.push({
          id: lecture.id,
          type: "lecture",
          sectionId: section.id,
          item: lecture,
        });
      });
      section.quizzes?.forEach((quiz) => {
        items.push({
          id: quiz.id,
          type: "quiz",
          sectionId: section.id,
          item: quiz,
        });
      });
      section.assignments?.forEach((assignment) => {
        items.push({
          id: assignment.id,
          type: "assignment",
          sectionId: section.id,
          item: assignment,
        });
      });
      section.codingExercises?.forEach((exercise) => {
        items.push({
          id: exercise.id,
          type: "coding-exercise",
          sectionId: section.id,
          item: exercise,
        });
      });
    });

    return items;
  };

  // Check if current item is last in section
  const isLastItemInSection = () => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex((item) => item.id === activeItemId);

    if (currentIndex === -1) return false;

    const currentItem = allItems[currentIndex];
    const sectionItems = allItems.filter(
      (item) => item.sectionId === currentItem.sectionId
    );
    const lastSectionItem = sectionItems[sectionItems.length - 1];

    return currentItem.id === lastSectionItem.id;
  };

  // Navigate to next/previous item
  const navigateToItem = (direction: "next" | "prev") => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex((item) => item.id === activeItemId);

    if (currentIndex === -1) return;

    let targetIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < allItems.length) {
      const targetItem = allItems[targetIndex];
      handleItemSelect(targetItem.id, targetItem.type);
    }
    setStartAssignment(false);
  };

  // Go to first item of next section
  const goToNextSection = () => {
    const allItems = getAllItemsInOrder();
    const currentIndex = allItems.findIndex((item) => item.id === activeItemId);

    if (currentIndex === -1) return;

    const currentItem = allItems[currentIndex];
    const nextSectionItems = allItems.filter(
      (item) =>
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
        const foundLecture = sectionData.lectures.find(
          (l: Lecture) => l.id === itemId
        );
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
        const foundAssignment = sectionData.assignments.find(
          (a: any) => a.id === itemId
        );
        if (foundAssignment) {
          selectedItem = foundAssignment;
          break;
        }
      }

      if (sectionData.codingExercises) {
        const foundExercise = sectionData.codingExercises.find(
          (e: any) => e.id === itemId
        );
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
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
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

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log(activeItemType + " active item");
    setShowSettingsDropdown(false);
    
    if (activeItemType === 'quiz') {
      setShowQuizKeyboardShortcuts(true);
    } else if (activeItemType === 'coding-exercise') {
      // Use router.push with proper error handling
      try {
        router.push('/coding-excercise');
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback: show a message or handle the error
        alert('Navigation to coding exercise page failed');
      }
    }
  };

  // Fixed handleReportAbuse function
  const handleReportAbuse = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log("Report abuse clicked - setting modal to show");
    setShowSettingsDropdown(false);
    setShowReportModal(true);
  };

  const handleReportSubmit = (issueType: string, issueDetails: string) => {
    console.log("Report submitted:", { issueType, issueDetails });
    setShowReportModal(false);
  };

  // Handle video keyboard shortcuts (from video controls)
  const handleVideoKeyboardShortcuts = () => {
    setShowVideoKeyboardShortcuts(true);
  };

  // Handle content information
  const handleContentInformation = () => {
    setShowContentInformation(true);
  };

  // Handle video quality change
  const handleVideoQualityChange = (quality: string) => {
    setVideoQuality(quality);
    
    // For ReactPlayer, we can implement a basic quality system
    // Note: This is a simplified implementation as ReactPlayer doesn't have built-in quality control for all sources
    if (quality === 'Auto') {
      // Implement auto quality selection based on connection or random selection
      const qualities = ['1080p', '720p', '576p', '432p', '360p'];
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      console.log(`Auto quality selected: ${randomQuality}`);
    } else {
      console.log(`Video quality changed to: ${quality}`);
      // Here you would typically modify the video URL to request the specific quality
      // This depends on your video source and whether it supports quality parameters
    }
  };

  // Get current content
  const getCurrentContent = () => {
    if (activeItemType === "quiz") {
      const currentQuizData =
        selectedItemData && "questions" in selectedItemData
          ? (selectedItemData as QuizData)
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
        } else if (
          enhancedSelectedItem?.description &&
          enhancedSelectedItem.description.includes("<")
        ) {
          currentArticleData = { text: enhancedSelectedItem.description };
        } else {
          currentArticleData = {
            text: `<h1>${
              selectedItemData?.name || "Article"
            }</h1><p>Article content for this lecture.</p>`,
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
            selectedVideoDetails: enhancedSelectedItem.videoDetails,
          };
        } else {
          currentVideoData = {
            ...videoContent,
            selectedVideoDetails: null,
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

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if click is inside settings dropdown or its button
      const settingsDropdown = document.querySelector('.absolute.bottom-full');
      const settingsButton = document.querySelector('[aria-label="Settings"]');
      
      if (
        settingsDropdown && 
        (settingsDropdown.contains(target) || settingsButton?.contains(target))
      ) {
        return; // Don't close if clicking inside settings dropdown
      }
      
      if (showSettingsDropdown) {
        setShowSettingsDropdown(false);
      }
      
      if (allLecturesDropdownOpen) {
        setAllLecturesDropdownOpen(false);
      }
      
      if (sortByDropdownOpen) {
        setSortByDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [allLecturesDropdownOpen, sortByDropdownOpen, showSettingsDropdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is currently typing in an input field
      const activeElement = document.activeElement;
      const isTypingInFormField = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );

      // Don't handle keyboard shortcuts if user is typing in a form field
      if (isTypingInFormField) {
        return;
      }

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

  // Check if we should show the bottom bar
  const shouldShowBottomBar = () => {
    if (isContentFullscreen) return false;
    if (activeItemType === "video") return false; // Videos have their own controls
    return true;
  };

  // Render bottom bar based on content type
  const renderBottomBar = () => {
    if (!shouldShowBottomBar()) return null;

    return (
      <div className="bg-white border-t border-gray-200 flex items-center px-4 py-2 relative">
        <div
          className="flex items-center justify-between w-full"
          style={{ maxWidth: isExpanded ? "100%" : "75.5vw" }}
        >
          {/* Left side content */}
          <div className="flex items-center">
            {activeItemType === "assignment" && (
              <button
                className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50"
                onClick={() => {
                  /* Handle go to summary */
                }}
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
          {(activeItemType === "article") && (
            <div className="flex items-center relative ">
              <button
                className={`p-1 text-white focus:outline-none bg-[#6D28D2] absolute  -top-52 -left-[455px]`}
                onClick={() => navigateToItem('prev')}
                type="button"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className={`p-1 text-white focus:outline-none bg-[#6D28D2] absolute -top-52 -right-[570px]`}
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
            {/* Next lecture button for assignments and other content types (only if last in section) */}
            {activeItemType === "assignment" && (
              <>
                {isLastItemInSection() && (
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium"
                    onClick={() => navigateToItem('next')}
                    type="button"
                  >
                    Next
                  </button>
                )}
                <button className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
                  onClick={() => navigateToItem('next')}
                >
                  Skip Assignment
                </button>
                <button
                  onClick={() => setAssignmentStatus("assignment")}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer transition"
                >
                  Start assignment
                </button>
              </>
            )}

            {/* Next button for quiz, article, and coding exercise (only if last item in section) */}
            {(activeItemType === "quiz" || activeItemType === "article" || activeItemType === "coding-exercise") && isLastItemInSection() && (
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettingsDropdown(!showSettingsDropdown);
                }}
                type="button"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettingsDropdown && (
                <div 
                  className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[160px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Keyboard shortcuts option - only show for quiz and coding exercise */}
                  {(activeItemType === 'quiz' || activeItemType === 'coding-exercise') && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleKeyboardShortcuts();
                      }}
                      type="button"
                    >
                      Keyboard shortcuts
                    </button>
                  )}

                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleReportAbuse();
                    }}
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
              aria-label={
                isContentFullscreen ? "Exit fullscreen" : "Fullscreen"
              }
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
          className="flex flex-col overflow-y-auto"
          style={{
            width: isExpanded ? "100%" : "75.5vw",
            transition: "width 0.3s ease-in-out",
          }}
        >
          {/* Content area */}
          <div className="flex-shrink-0" style={{ height: isContentFullscreen ? "100vh" : "calc(100vh - 170px)" }}>
            {showQuizKeyboardShortcuts ? (
              <div className="bg-black h-full flex items-center justify-center p-8">
                <button
                    onClick={() => setShowQuizKeyboardShortcuts(false)}
                    className="absolute top-8 right-[500px] text-white hover:text-white focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                <div className="bg-black text-white rounded-lg p-5 h-full max-w-2xl relative text-center justify-center items-center flex flex-col gap-20">
                

                  <div className="flex items-center mb-6 text-center">
                    <h2 className="text-2xl font-bold text-center">Keyboard shortcuts</h2>
                    <span className="ml-2 text-white bg-gray-700 px-2">?</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-10">
                      <span>Select answer 1-9</span>
                      <div className="flex space-x-1">
                        <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono min-w-[24px] text-center">
                          1-9
                        </kbd>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-10">
                      <span>Check answer / Next question</span>
                      <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                        →
                      </kbd>
                    </div>

                    <div className="flex items-center justify-between gap-10">
                      <span>Skip question</span>
                      <div className="flex items-center space-x-1">
                        <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                          Shift
                        </kbd>
                        <span className="text-gray-400">+</span>
                        <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                          →
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : showVideoKeyboardShortcuts ? (
              <div className="bg-black h-full flex items-center justify-center p-8">
                <div className="bg-black text-white rounded-lg p-6 max-w-2xl w-full mx-4 relative border border-gray-700">
                  <button
                    onClick={() => setShowVideoKeyboardShortcuts(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex items-center mb-6">
                    <h2 className="text-xl font-semibold">Keyboard shortcuts</h2>
                    <span className="ml-2 text-gray-400">?</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      { action: 'Play / pause', key: 'Space' },
                      { action: 'Go back 5s', key: '←' },
                      { action: 'Go forward 5s', key: '→' },
                      { action: 'Speed slower', key: 'Shift + ←' },
                      { action: 'Speed faster', key: 'Shift + →' },
                      { action: 'Volume up', key: '↑' },
                      { action: 'Volume down', key: '↓' },
                      { action: 'Mute', key: 'M' },
                      { action: 'Fullscreen', key: 'F' },
                      { action: 'Exit fullscreen', key: 'ESC' },
                      { action: 'Add note', key: 'B' },
                      { action: 'Toggle captions', key: 'C' },
                      { action: 'Content information', key: 'I' },
                    ].map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{shortcut.action}</span>
                        <kbd className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono min-w-[60px] text-center">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeItemType === "quiz" ? (
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
                  skipAssignment={() => navigateToItem("next")}
                  startAssignment={startAssignment}
                  setAssignmentStatus={setAssignmentStatus}
                  assignmentStatus={assignmentStatus}
                />
              </div>
            ) : activeItemType === "article" ? (
              <div className="bg-white relative h-full">
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto">
                  <h1 className="text-2xl font-bold mb-4">
                    {selectedItemData?.name || "Article"}
                  </h1>
                  <div
                    className="article-content prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        (currentContent.data as ArticleContent)?.text || "",
                    }}
                  />

                  {/* Resources section */}
                  {(uploadedFiles.filter((f) => f.lectureId === activeItemId)
                    .length > 0 ||
                    sourceCodeFiles.filter((f) => f.lectureId === activeItemId)
                      .length > 0 ||
                    externalResources.filter(
                      (r) => r.lectureId === activeItemId
                    ).length > 0) && (
                    <div className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Resources for this {activeItemType}
                      </h2>

                      <div className="space-y-3">
                        {uploadedFiles
                          .filter((f) => f.lectureId === activeItemId)
                          .map((file, index) => (
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

                        {sourceCodeFiles
                          .filter((f) => f.lectureId === activeItemId)
                          .map((file, index) => (
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

                        {externalResources
                          .filter((r) => r.lectureId === activeItemId)
                          .map((resource, index) => (
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
              <div className="bg-black relative h-full"
               style={{ 
            width: isExpanded ? "100%" : "75.5vw",
            transition: "width 0.3s ease-in-out"
          }}>
                {/* Content Information Display - shows over video player */}
                {showContentInformation && (
                  <ContentInformationDisplay
                    isOpen={showContentInformation}
                    onClose={() => setShowContentInformation(false)}
                    contentData={{
                      contentType: activeItemType,
                      isEncrypted: false,
                      courseHasEncryptedVideos: false,
                    }}
                  />
                )}

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
                        (currentContent.data as any)?.selectedVideoDetails
                          ?.url ||
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
                          videoQuality={videoQuality}
                          onPlayPause={() => setPlaying(!playing)}
                          onRewind={handleRewind}
                          onForward={handleForward}
                          onVolumeChange={setVolume}
                          onPlaybackRateChange={setPlaybackRate}
                          onVideoQualityChange={handleVideoQualityChange}
                          onFullscreen={handleContentFullscreen}
                          onExpand={handleExpand}
                          formatTime={formatTime}
                          currentVideoDetails={(currentContent.data as any)?.selectedVideoDetails}
                          onReportAbuse={handleReportAbuse}
                          onShowKeyboardShortcuts={handleVideoKeyboardShortcuts}
                          onShowContentInformation={handleContentInformation}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom bar for non-video content */}
          {renderBottomBar()}

          {/* Bottom content tabs */}
          {!isContentFullscreen && (
            <BottomTabsContainer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              isExpanded={isExpanded}
              selectedItemData={selectedItemData}
              activeItemType={activeItemType}
              progress={progress}
              formatTime={formatTime}
              notes={notes}
              onCreateNote={handleCreateNote}
              onSaveNote={handleSaveNote}
              onCancelNote={handleCancelNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              isAddingNote={isAddingNote}
              currentNoteContent={currentNoteContent}
              setCurrentNoteContent={setCurrentNoteContent}
              selectedLectureFilter={selectedLectureFilter}
              setSelectedLectureFilter={setSelectedLectureFilter}
              selectedSortOption={selectedSortOption}
              setSelectedSortOption={setSelectedSortOption}
              getSortedNotes={getSortedNotes}
              onOpenLearningModal={() => setShowLearningModal(true)}
              activeItemId={activeItemId}
            />
          )}
        </div>

        {/* Course Content Button - only shows when sidebar is collapsed */}
        {isExpanded && (
          <div className="fixed top-1/5 right-0 transform -translate-y-1/2 z-50">
            <div className="group">
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-l shadow-lg flex items-center transition-all duration-300 ease-in-out transform translate-x-24 group-hover:translate-x-0"
                style={{ 
                  paddingTop: '12px', 
                  paddingBottom: '12px',
                  paddingLeft: '8px',
                  paddingRight: '16px',
                  minWidth: '140px'
                }}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium whitespace-nowrap">
                  Course content
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Sidebar */}
        {!isExpanded && (
          <div
            className="flex-shrink-0"
            style={{ width: "calc(100vw - 75.5vw)" }}
          >
            <StudentPreviewSidebar
              currentLectureId={activeItemId}
              setShowVideoPreview={setShowVideoPreview}
              sections={processedSections}
              uploadedFiles={uploadedFiles}
              sourceCodeFiles={sourceCodeFiles}
              externalResources={externalResources}
              onSelectItem={handleItemSelect}
            />
          </div>
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

      {/* Other Modals */}
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
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Lecture,
  SourceCodeFile,
  VideoContent,
  AttachedFile,
  ExternalResource,
  PreviewSection,
  EnhancedLecture,
  ArticleContent,
  VideoNote,
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
import ReportAbuseModal from "../modals/ReportAbuseModal";
import QuizPreview, { LectureType } from "../../quiz/QuizPreview";
import AssignmentPreview from "../../assignment/AssignmentPreview";
import VideoControls from "./VideoControls";
import LearningReminderModal from "../modals/LearningReminderModal";
import { useRouter } from "next/navigation";
import ContentInformationDisplay from "./ContentInformationDisplay";
import { useAssignment } from "@/context/AssignmentDataContext";
import { CourseSectionQuiz } from "@/api/course/section/queries";
import VoltisLoader from "@/components/loader/loader";
import CodingExercisePreview from "../../code/CodingExercisePreview";
import PreviewHeader from "./PreviewHeader";
import { ControlButtons } from "@/components/preview/ControlsButton";
import { usePreviewContext } from "@/context/PreviewContext";
import { useVideoProgress } from "@/app/preview/VideoProgressContext";

// Add QuizData interface
export interface Answer {
  id: number;
  order?: number; // Optional, if you want to allow custom order
  isCorrect: boolean;
  text: string;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  answerChoices: Answer[];
  orders?: number[]; // Optional, if you want to allow custom order
  relatedLecture?: LectureType;
  type: string;
}

export interface QuizData {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

type ChildProps = {
  videoContent: VideoContent;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  lecture: any;
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
  quizData?: CourseSectionQuiz;
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

type SelectedItemType = Lecture | Quiz | Assignment | CodingExercise;

const StudentCoursePreview = ({
  videoContent,
  setShowVideoPreview,
  lecture,
  uploadedFiles = [],
  sourceCodeFiles = [],
  externalResources = [],
  section,
  articleContent,
  quizData,
}: ChildProps) => {
  // Debug logs for props and state
  console.log("lecture", lecture);
  console.log("videoContent", videoContent);
  console.log("articleContent", articleContent);

  const componentRef = useRef<HTMLDivElement>(null);
  const { expandedView, toggleExpandedView } = usePreviewContext();

  const [fullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!fullScreen) {
      if (videoContentRef?.current?.requestFullscreen) {
        videoContentRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

   const {
    videoState,
    setProgress,
    setDuration,
    setPlaying,
    togglePlayPause,
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
    setCurrentVideo,
    resetProgress,
    getFormattedProgress,
    getFormattedDuration,
    getProgressPercentage,
  } = useVideoProgress();

  
  // State management
  // const [playing, setPlaying] = useState<boolean>(false);
  // const [progress, setProgress] = useState<number>(0);
  // const [duration, setDuration] = useState<number>(0);
  // const [showControls, setShowControls] = useState<boolean>(false);
  // const [volume, setVolume] = useState<number>(0.8);
  // const [muted, setMuted] = useState<boolean>(false);
  // const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [videoQuality, setVideoQuality] = useState<string>("Auto");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string>(lecture?.id ?? "");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSettingsDropdown, setShowSettingsDropdown] =
    useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isContentFullscreen, setIsContentFullscreen] =
    useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [selectedItemData, setSelectedItemData] =
    useState<SelectedItemType | null>(lecture);
  const [showQuizKeyboardShortcuts, setShowQuizKeyboardShortcuts] =
    useState<boolean>(false);
  const [showVideoKeyboardShortcuts, setShowVideoKeyboardShortcuts] =
    useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(false);

  // Add state for content information modal
  const [showContentInformation, setShowContentInformation] =
    useState<boolean>(false);

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

  const { assignmentData } = useAssignment();
  const router = useRouter();

  const handleStartAssignment = () => {
    setAssignmentStatus("assignment");
  };

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const videoContentRef = useRef<HTMLDivElement>(null);

  // Video control handlers for keyboard shortcuts
  const handlePlayPause = (): void => {
    setPlaying(!videoState.playing);
  };

  const handleMute = (): void => {
    const newMuted = !videoState.muted;
    setMuted(newMuted);
    console.log("Mute toggled:", newMuted, "Current volume:", videoState.volume);

    // Force update ReactPlayer mute state
    if (playerRef.current) {
      setTimeout(() => {
        const player = playerRef.current?.getInternalPlayer();
        if (player) {
          if (newMuted) {
            player.mute?.();
            player.setVolume?.(0);
          } else {
            player.unMute?.();
            player.setVolume?.(videoState.volume * 100);
          }
        }
      }, 100);
    }
  };

  const handleVolumeUp = (): void => {
    if (videoState.muted) {
      setMuted(false); // Unmute if muted when increasing volume
    }
    setVolume((prevVolume) => {
      const newVolume = Math.min(1, prevVolume + 0.1);
      console.log(
        "Volume up - Previous:",
        prevVolume,
        "New:",
        newVolume,
        "Muted:",
        videoState.muted
      );

      // Multiple approaches to ensure volume change works
      if (playerRef.current) {
        // Approach 1: ReactPlayer internal player
        setTimeout(() => {
          const player = playerRef.current?.getInternalPlayer();
          if (player) {
            console.log("Setting volume via internal player:", newVolume);
            if (player.setVolume) {
              // Try different volume scales
              player.setVolume(newVolume * 100); // YouTube scale
              player.setVolume(newVolume); // HTML5 scale
            }
            player.unMute?.();
          }

          // Approach 2: Direct HTML5 video element access
          const videoElement = playerRef.current?.getInternalPlayer(
            "video"
          ) as HTMLVideoElement;
          if (videoElement && videoElement.tagName === "VIDEO") {
            console.log("Setting volume via HTML5 video element:", newVolume);
            videoElement.volume = newVolume;
            videoElement.muted = false;
          }

          // Approach 3: Query for video elements in the container
          const container = playerContainerRef.current;
          if (container) {
            const videos = container.querySelectorAll("video");
            videos.forEach((video) => {
              console.log(
                "Setting volume via queried video element:",
                newVolume
              );
              video.volume = newVolume;
              video.muted = false;
            });
          }
        }, 100);
      }

      return newVolume;
    });
  };

  const handleVolumeDown = (): void => {
    setVolume((prevVolume: number) => {
      const newVolume = Math.max(0, prevVolume - 0.1);
      console.log(
        "Volume down - Previous:",
        prevVolume,
        "New:",
        newVolume,
        "Muted:",
        videoState.muted
      );

      // Auto-mute if volume reaches 0
      if (newVolume === 0) {
        setMuted(true);
      }

      // Multiple approaches to ensure volume change works
      if (playerRef.current) {
        setTimeout(() => {
          const player = playerRef.current?.getInternalPlayer();
          if (player && newVolume > 0) {
            console.log("Setting volume via internal player:", newVolume);
            if (player.setVolume) {
              player.setVolume(newVolume * 100); // YouTube scale
              player.setVolume(newVolume); // HTML5 scale
            }
            player.unMute?.();
          } else if (player && newVolume === 0) {
            player.mute?.();
          }

          // Direct HTML5 video element access
          const videoElement = playerRef.current?.getInternalPlayer(
            "video"
          ) as HTMLVideoElement;
          if (videoElement && videoElement.tagName === "VIDEO") {
            console.log("Setting volume via HTML5 video element:", newVolume);
            videoElement.volume = newVolume;
            videoElement.muted = newVolume === 0;
          }

          // Query for video elements in the container
          const container = playerContainerRef.current;
          if (container) {
            const videos = container.querySelectorAll("video");
            videos.forEach((video) => {
              console.log(
                "Setting volume via queried video element:",
                newVolume
              );
              video.volume = newVolume;
              video.muted = newVolume === 0;
            });
          }
        }, 100);
      }

      return newVolume;
    });
  };

  const handleSpeedSlower = (): void => {
    setPlaybackRate((prevRate) => {
      const newRate = Math.max(0.25, prevRate - 0.25);
      console.log("Speed slower:", newRate);
      return newRate;
    });
  };

  const handleSpeedFaster = (): void => {
    setPlaybackRate((prevRate) => {
      const newRate = Math.min(2, prevRate + 0.25);
      console.log("Speed faster:", newRate);
      return newRate;
    });
  };

  const handleToggleCaptions = (): void => {
    setShowCaptions(!showCaptions);
    console.log("Captions toggled:", !showCaptions);
  };

  const handleSeekBackward = (): void => {
    if (playerRef.current) {
      const newTime = Math.max(0, videoState.progress - 5);
      console.log("Seeking backward to:", newTime);
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  const handleSeekForward = (): void => {
    if (playerRef.current) {
      const newTime = Math.min(videoState.duration, videoState.progress + 5);
      console.log("Seeking forward to:", newTime);
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  // Content type detection
  const detectContentType = (
    lectureId: string,
    lectureData?: Lecture,
    hasVideoContent?: boolean,
    hasArticleContent?: boolean
  ): string => {
    // If this is a lecture, use videoUrl to determine type
    if (
      lectureData &&
      typeof lectureData === "object" &&
      "videoUrl" in lectureData
    ) {
      if (!lectureData.videoUrl || String(lectureData.videoUrl).trim() === "") {
        return "article";
      } else {
        return "video";
      }
    }

    if (!lectureData || lectureId !== lectureData.id) {
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
        return lectureData?.contentType === "video" ? "video" : "article";
      }

      if (hasRealArticleContent && !hasRealVideoContent) {
        return "article";
      }

      if (hasRealVideoContent && !hasRealArticleContent) {
        return "video";
      }

      console.log("lecturedaat", lectureData);

      if (lectureData?.contentType) {
        return lectureData.contentType;
      }

      return "video";
    }

    const hasRealArticleContent = !!(
      articleContent &&
      articleContent.text &&
      articleContent.text.trim() !== ""
    );
    const hasRealVideoContent = !!(
      videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url
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
  };

  const determineInitialContentType = (): string => {
    const detectedType = detectContentType(lecture?.id ?? "", lecture);
    return detectedType;
  };

  console.log(lecture);

  const [activeItemType, setActiveItemType] = useState<string>(
    determineInitialContentType()
  );

  // Sync state with lecture prop when it changes
  useEffect(() => {
    if (activeItemId !== (lecture?.id ?? "") || selectedItemData !== lecture) {
      setActiveItemId(lecture?.id ?? "");
      setSelectedItemData(lecture);
      setActiveItemType(detectContentType(lecture?.id ?? "", lecture));
    }
  }, [lecture, activeItemId, selectedItemData]);

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

  const handleSidebarSelect = (
    itemId: string,
    itemType: string,
    courseId: string,
    sectionId: string
  ) => {
    // You can add some logging if desired
    // console.log('Sidebar nav:', {itemId, itemType, courseId, sectionId});
    router.push(`/preview/${itemType}/${courseId}/${sectionId}/${itemId}`);
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
    setSelectedItemData(selectedItem ?? null);

    // Update activeItemType for correct preview switching
    if (itemType === "lecture") {
      // Only pass selectedItem if it is a Lecture (has videoUrl property)
      const isLecture =
        selectedItem &&
        typeof selectedItem === "object" &&
        "videoUrl" in selectedItem;
      setActiveItemType(
        detectContentType(
          selectedItem?.id ?? "",
          isLecture ? (selectedItem as Lecture) : undefined
        )
      );
    } else {
      setActiveItemType(itemType);
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
      const newTime = Math.min(videoState.duration, videoState.progress + 5);
      playerRef.current.seekTo(newTime / videoState.duration);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const newTime = Math.max(0, videoState.progress - 5);
      playerRef.current.seekTo(newTime / videoState.duration);
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

    if (activeItemType === "quiz") {
      setShowQuizKeyboardShortcuts(true);
    } else if (activeItemType === "coding-exercise") {
      // Use router.push with proper error handling
      try {
        router.push("/coding-excercise");
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback: show a message or handle the error
        alert("Navigation to coding exercise page failed");
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
    if (quality === "Auto") {
      // Implement auto quality selection based on connection or random selection
      const qualities = ["1080p", "720p", "576p", "432p", "360p"];
      const randomQuality =
        qualities[Math.floor(Math.random() * qualities.length)];
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
          ? (selectedItemData as unknown)
          : quizData;
      return { type: "quiz", data: currentQuizData };
    } else if (activeItemType === "article") {
      let currentArticleData: ArticleContent;

      if (activeItemId === lecture?.id) {
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

      if (activeItemId === lecture?.id) {
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
        timestamp: videoState.progress,
        formattedTime: formatTime(videoState.progress),
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
      const settingsDropdown = document.querySelector(".absolute.bottom-full");
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

  // Effect to handle volume changes and ensure they're applied to ReactPlayer
  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        console.log("Applying volume change:", videoState.volume, "Muted:", videoState.muted);

        // Handle different player types
        if (videoState.muted) {
          player.mute?.();
          player.setVolume?.(0);
        } else {
          player.unMute?.();
          // Different players use different volume scales
          if (player.setVolume) {
            // YouTube uses 0-100, others might use 0-1
            const volumeValue = player.getVideoUrl?.()?.includes("youtube")
              ? videoState.volume * 100
              : videoState.volume;
            player.setVolume(volumeValue);
          }
        }
      }
    }
  }, [videoState.volume, videoState.muted]);

  // Comprehensive keyboard shortcuts implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is currently typing in an input field
      const activeElement = document.activeElement;
      const isTypingInFormField =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          (activeElement as HTMLElement).contentEditable === "true");

      // Don't handle keyboard shortcuts if user is typing in a form field
      if (isTypingInFormField) {
        return;
      }

      // Only handle video shortcuts when video is active and notes tab is not active
      const shouldHandleVideoShortcuts =
        activeItemType === "video" && activeTab !== "notes";

      // Only handle note shortcut when notes tab is active and not adding a note
      const shouldHandleNoteShortcut = activeTab === "notes" && !isAddingNote;

      if (shouldHandleVideoShortcuts) {
        switch (e.code) {
          case "Space": // Play/pause
            e.preventDefault();
            handlePlayPause();
            break;

          case "ArrowLeft": // Go back 5s or speed slower
            if (e.shiftKey) {
              // Speed slower (Shift + ←)
              e.preventDefault();
              handleSpeedSlower();
            } else {
              // Go back 5s (←)
              e.preventDefault();
              handleSeekBackward();
            }
            break;

          case "ArrowRight": // Go forward 5s or speed faster
            if (e.shiftKey) {
              // Speed faster (Shift + →)
              e.preventDefault();
              handleSpeedFaster();
            } else {
              // Go forward 5s (→)
              e.preventDefault();
              handleSeekForward();
            }
            break;

          case "ArrowUp": // Volume up
            e.preventDefault();
            console.log("Arrow Up pressed for volume up");
            handleVolumeUp();
            break;

          case "ArrowDown": // Volume down
            e.preventDefault();
            console.log("Arrow Down pressed for volume down");
            handleVolumeDown();
            break;

          case "KeyM": // Mute
            e.preventDefault();
            handleMute();
            break;

          case "KeyF": // Content Fullscreen (not browser fullscreen)
            e.preventDefault();
            console.log("F key pressed - entering content fullscreen");
            handleContentFullscreen();
            break;

          case "Escape": // Exit content fullscreen
            e.preventDefault();
            if (isContentFullscreen) {
              console.log("ESC key pressed - exiting content fullscreen");
              handleContentFullscreen(); // Toggle off content fullscreen
            }
            break;

          case "KeyC": // Toggle captions
            e.preventDefault();
            handleToggleCaptions();
            break;

          case "KeyI": // Content information - use existing functionality
            e.preventDefault();
            console.log("I key pressed - toggling content info");
            setShowContentInformation(!showContentInformation);
            break;

          default:
            // No action for other keys
            break;
        }
      }

      // Handle note creation shortcut (B key) when notes tab is active
      if (shouldHandleNoteShortcut && e.code === "KeyB") {
        e.preventDefault();
        handleCreateNote();
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
  }, [
    videoState.playing,
    activeTab,
    isAddingNote,
    activeItemType,
    videoState.volume,
    videoState.muted,
    videoState.playbackRate,
    showCaptions,
    showContentInformation,
    isContentFullscreen,
    videoState.progress,
    videoState.duration,
  ]);

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

  if (!lecture) {
    return <VoltisLoader />;
  }

  // Render article if no videoUrl
  if (!lecture.videoUrl || String(lecture.videoUrl).trim() === "") {
    console.log("Rendering article content");
    return (
      <div
        ref={componentRef}
        className={`flex flex-col relative bg-white ${
          expandedView ? "h-[80vh]" : "h-[70vh]"
        }`}
      >
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl  font-bold mb-4">{lecture.title}</h1>
          <div
            className="article-content prose w-full"
            dangerouslySetInnerHTML={{ __html: articleContent?.text || "" }}
          />
        </div>

        <div className="flex items-center bg-white border-t border-gray-200 pl-4 h-14 mt-auto">
          <ControlButtons className="ml-auto" componentRef={componentRef} />
        </div>
      </div>
    );
  }

  // --- NEW: Expand/Fullscreen logic ---
  // isExpanded and isContentFullscreen already exist

  // --- Helper: Render Bottom Bar for non-video content ---
  const renderBottomBar = () => {
    if (isContentFullscreen) return null;
    if (activeItemType === "video") return null;
    return (
      <div
        className="bg-white border-t border-gray-200 flex items-center px-4 py-2 relative"
        style={{ maxWidth: isExpanded ? "100%" : "75.5vw", width: "100%" }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left: Content type label */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium capitalize">
              {activeItemType.replace("-", " ")}
            </span>
          </div>
          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            {/* Content Info */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={handleContentInformation}
              type="button"
              aria-label="Content Information"
            >
              <i className="lucide-info w-5 h-5" />
            </button>
            {/* Fullscreen */}
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
            {/* Expand/Shrink */}
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

  // --- Main Render ---
  return (
    <div
      className={`flex flex-col relative bg-white ${
        expandedView ? "h-[80vh]" : "h-[70vh]"
      }`}
    >
      {/* <div className="flex flex-1"> */}
      {/* Main scrollable container */}
      <div
        ref={mainContentRef}
        className="flex flex-col h-full w-full overflow-y-auto "
        // style={{
        //   width: isExpanded ? "100%" : "76vw",
        //   transition: "width 0.3s ease-in-out",
        // }}
      >
        {/* Content area */}
        <div
          className=" relative h-full"
          // style={{
          //   height: fullScreen ? "100vh" : "100%",
          // }}
        >
          {/* Content Info Modal */}
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
          {/* Video */}
          {activeItemType === "video" ? (
            <div
              ref={videoContentRef}
              className="bg-black relative w-full h-full flex flex-col justify-center items-center"
            >
              {/* <div></div> */}
              <ReactPlayer
                ref={playerRef}
                url={lecture.videoUrl}
                width="100%"
                height="91%"
                playing={videoState.playing}
                volume={videoState.muted ? 0 : videoState.volume}
                muted={videoState.muted}
                playbackRate={videoState.playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
                progressInterval={100}
                controls={false}
                config={{
                  youtube: {
                    playerVars: {
                      controls: 1,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      disablekb: 1,
                    },
                  },
                  vimeo: {
                    playerOptions: {
                      controls: true,
                      keyboard: false,
                    },
                  },
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
                    },
                  },
                }}
                onReady={() => {
                  if (playerRef.current) {
                    const player = playerRef.current.getInternalPlayer();
                    if (player && player.setVolume) {
                      player.setVolume(videoState.volume * 100);
                    }
                  }
                }}
              />
              {/* Always render controls */}
              <VideoControls
                playing={videoState.playing}
                progress={videoState.progress}
                duration={videoState.duration}
                volume={videoState.volume}
                playbackRate={videoState.playbackRate}
                videoQuality={videoQuality}
                onPlayPause={() => setPlaying(!videoState.playing)}
                onRewind={handleRewind}
                onForward={handleForward}
                onVolumeChange={(newVolume: number) => {
                  setVolume(newVolume);
                  setMuted(newVolume === 0);
                }}
                onPlaybackRateChange={setPlaybackRate}
                onVideoQualityChange={handleVideoQualityChange}
                onFullscreen={toggleFullScreen}
                fullScreen={fullScreen}
                onExpand={toggleExpandedView}
                formatTime={formatTime}
                currentVideoDetails={
                  videoContent.selectedVideoDetails || undefined
                }
                onReportAbuse={handleReportAbuse}
                onShowKeyboardShortcuts={handleVideoKeyboardShortcuts}
                onShowContentInformation={handleContentInformation}
              />
            </div>
          ) : (
            // Non-video content (article, quiz, assignment, coding-exercise)
            <div className="bg-white relative w-full h-full flex flex-col">
              {/* Article */}
              {activeItemType === "article" && (
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto">
                  <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>
                  <div
                    className="article-content prose w-full"
                    dangerouslySetInnerHTML={{
                      __html: articleContent?.text || "",
                    }}
                  />
                </div>
              )}
              {/* Quiz */}
              {activeItemType === "quiz" && (quizData || selectedItemData) ? (
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto">
                  <QuizPreview quiz={(quizData || selectedItemData) as any} />
                </div>
              ) : activeItemType === "quiz" ? (
                <div className="relative w-full h-full flex items-center justify-center text-gray-500">
                  No quiz data available.
                </div>
              ) : null}
              {/* Assignment */}
              {activeItemType === "assignment" && selectedItemData ? (
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto">
                  <AssignmentPreview assignmentData={selectedItemData as any} />
                </div>
              ) : activeItemType === "assignment" ? (
                <div className="relative w-full h-full flex items-center justify-center text-gray-500">
                  No assignment data available.
                </div>
              ) : null}
              {/* Coding Exercise */}
              {activeItemType === "coding-exercise" && selectedItemData ? (
                <div className="relative w-full h-full px-8 py-6 overflow-y-auto">
                  <CodingExercisePreview
                    data={selectedItemData as any}
                    onClose={() => {}}
                  />
                </div>
              ) : activeItemType === "coding-exercise" ? (
                <div className="relative w-full h-full flex items-center justify-center text-gray-500">
                  No coding exercise data available.
                </div>
              ) : null}
              {/* Bottom bar for non-video content */}
              {renderBottomBar()}
            </div>
          )}
        </div>
        {/* --- BOTTOM TABS: Always show below content --- */}
        {/* <BottomTabsContainer
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
          /> */}
      </div>
      {/* Sidebar (only show when not expanded) */}
      {/* {!isExpanded && (
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
              // onSelectItem={handleItemSelect}
              onSelectItem={handleSidebarSelect}
            />
          </div>
        )} */}
      {/* </div> */}
      {/* Exit fullscreen button */}
      {/* {isContentFullscreen && (
        <button
          className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 focus:outline-none z-50"
          onClick={handleContentFullscreen}
          type="button"
        >
          Exit fullscreen
        </button>
      )} */}
    </div>
  );
};

export default StudentCoursePreview;

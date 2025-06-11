import React, { useRef, useEffect, useState } from "react";
import {
  ContentItemType,
  ContentType,
  ResourceTabType,
  ArticleContent,
  TabInterface,
  VideoSlideContent,
  VideoContent,
  StoredVideo,
  Lecture,
  EnhancedLecture,
  ContentTypeDetector,
  ExternalResourceItem,
  SourceCodeFile,
  SelectedVideoDetails,
  LibraryFileWithSize,
} from "@/lib/types";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  AlignJustify,
} from "lucide-react";
import AddResourceComponent from "./components/AddResourceComponent";
import DescriptionEditorComponent from "./components/DescriptionEditorComponent";
import "react-quill-new/dist/quill.snow.css";
import { ContentSelector } from "./components/ContentSelector";
import VideoSlideMashupComponent from "./components/VideoAndSlideMashup";
import Article from "./components/Article";
import { FaCircleCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { FileUploadFunction } from "../../CourseSectionBuilder";
import { uploadFile } from "@/services/fileUploadService";
import VideoContentManager from "./components/VideoContentManager";
import LectureContentDisplay from "./components/LectureContentDisplay";

// Updated LectureItemProps interface with async functions
interface UpdatedLectureItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => Promise<void>;
  deleteLecture: (sectionId: string, lectureId: string) => Promise<void>;
  moveLecture: (
    sectionId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => void;
  updateLectureContent?: (
    sectionId: string,
    lectureId: string,
    updatedLecture: EnhancedLecture
  ) => void;
  toggleContentSection?: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal?: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor?: (
    sectionId: string,
    lectureId: string,
    currentText: string
  ) => void;
  activeContentSection?: { sectionId: string; lectureId: string } | null;
  activeResourceSection?: { sectionId: string; lectureId: string } | null;
  activeDescriptionSection?: { sectionId: string; lectureId: string } | null;
  isDragging: boolean;
  handleDragStart: (
    e: React.DragEvent,
    sectionId: string,
    lectureId?: string
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => void;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: { sectionId: string | null; lectureId: string | null };
  sections?: any[];
  updateCurrentDescription?: (description: string) => void;
  saveDescription?: () => void;
  currentDescription?: string;
  children?: React.ReactNode;
  allSections: any[];
  globalUploadedFiles?: Array<{
    name: string;
    size: string;
    lectureId: string;
  }>;
  globalSourceCodeFiles?: SourceCodeFile[];
  globalExternalResources?: ExternalResourceItem[];
  addUploadedFile?: (file: {
    name: string;
    size: string;
    lectureId: string;
  }) => void;
  removeUploadedFile?: (fileName: string, lectureId: string) => void;
  addSourceCodeFile?: (file: SourceCodeFile) => void;
  removeSourceCodeFile?: (fileName: string | undefined, lectureId: string) => void;
  addExternalResource?: (resource: ExternalResourceItem) => void;
  removeExternalResource?: (title: string, lectureId: string) => void;
  uploadVideoToBackend?: (
    sectionId: string,
    lectureId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ) => Promise<string | null>;
  saveArticleToBackend?: (
    sectionId: string,
    lectureId: string,
    articleContent: string
  ) => Promise<string>;
  videoUploading?: boolean;
  videoUploadProgres?: number;
  uploadFileToBackend?: FileUploadFunction;
}

export default function LectureItem(props: UpdatedLectureItemProps) {
  const {
    lecture,
    lectureIndex,
    sectionId,
    editingLectureId,
    setEditingLectureId,
    updateLectureName,
    deleteLecture,
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
    currentDescription = "",
    children,
    allSections,
    updateLectureContent,
    globalUploadedFiles = [],
    globalSourceCodeFiles = [],
    globalExternalResources = [],
    addUploadedFile,
    removeUploadedFile,
    addSourceCodeFile,
    removeSourceCodeFile,
    addExternalResource,
    removeExternalResource,
    uploadVideoToBackend,
    saveArticleToBackend,
    videoUploading = false,
    videoUploadProgres = 0,
    uploadFileToBackend,
  } = props;

  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [content, setContent] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(videoUploadProgres);
  const [videoUploadComplete, setVideoUploadComplete] = useState(false);
  const [showEditLectureForm, setShowEditLectureForm] = useState<boolean>(false);
  const [editLectureTitle, setEditLectureTitle] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const lectureFormRef = useRef<HTMLDivElement>(null);
  const [activeContentType, setActiveContentType] = useState<ContentItemType | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(
    ResourceTabType.DOWNLOADABLE_FILE
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Content state
  const [videoContent, setVideoContent] = useState<VideoContent>({
    uploadTab: { selectedFile: null },
    libraryTab: {
      searchQuery: "",
      selectedVideo: null,
      videos: [
        {
          id: "1",
          filename: "Netflix.mp4",
          type: "Video",
          status: "Success",
          date: "05/08/2025",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        {
          id: "2",
          filename: "Netflix.mp4",
          type: "Video",
          status: "Success",
          date: "05/08/2025",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        },
        {
          id: "3",
          filename: "2025-05-01-025523.webm",
          type: "Video",
          status: "Success",
          date: "05/08/2025",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
          id: "4",
          filename: "Netflix.mp4",
          type: "Video",
          status: "Success",
          date: "05/07/2025",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        },
        {
          id: "5",
          filename: "Netflix.mp4",
          type: "Video",
          status: "Success",
          date: "05/07/2025",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        },
      ],
    },
    activeTab: "uploadVideo",
    selectedVideoDetails: null,
  });

  const [videoSlideContent, setVideoSlideContent] = useState<VideoSlideContent>({
    video: { selectedFile: null },
    presentation: { selectedFile: null },
    step: 1,
  });

  const [articleContent, setArticleContent] = useState<ArticleContent>({
    text: "",
  });

  // Filtered resources for current lecture
  const currentLectureUploadedFiles = globalUploadedFiles.filter(file => file.lectureId === lecture.id);
  const currentLectureSourceCodeFiles = globalSourceCodeFiles.filter(file => file.lectureId === lecture.id);
  const currentLectureExternalResources = globalExternalResources.filter(resource => resource.lectureId === lecture.id);

  // Initialize edit form when opened
  useEffect(() => {
    if (showEditLectureForm) {
      setEditLectureTitle(lecture.name || "");
    }
  }, [showEditLectureForm, lecture.name]);

  // File upload function
  const handleFileUpload: FileUploadFunction = async (file: File, fileType: 'VIDEO' | 'RESOURCE') => {
    if (uploadFileToBackend) {
      return await uploadFileToBackend(file, fileType);
    } else {
      try {
        const uploadedUrl = await uploadFile(file, fileType);
        return uploadedUrl;
      } catch (error) {
        console.error('File upload failed:', error);
        throw error;
      }
    }
  };

  // Handle save article
  const handleSaveArticle = async (articleContent: string) => {
    try {
      if (saveArticleToBackend) {
        await saveArticleToBackend(sectionId, lecture.id, articleContent);
      }
      
      setArticleContent({ text: articleContent });
      
      if (videoContent.selectedVideoDetails) {
        setVideoContent({
          ...videoContent,
          selectedVideoDetails: null
        });
      }

      if (updateLectureContent) {
        const enhancedLecture = createEnhancedLectureForPreview();
        const updatedLecture = ContentTypeDetector.updateLectureContentType(
          enhancedLecture,
          'article',
          { text: articleContent }
        );
        updateLectureContent(sectionId, lecture.id, updatedLecture);
      }

      setActiveContentType(null);

      if (
        toggleContentSection &&
        (!activeContentSection ||
          activeContentSection.sectionId !== sectionId ||
          activeContentSection.lectureId !== lecture.id)
      ) {
        toggleContentSection(sectionId, lecture.id);
      }
    } catch (error) {
      console.error('Failed to save article to backend:', error);
      toast.error('Failed to save article. Please try again.');
    }
  };

  // Create enhanced lecture for preview
  const createEnhancedLectureForPreview = (): EnhancedLecture => {
    const hasRealVideoContent = !!(videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url);
    const hasRealArticleContent = !!(articleContent && articleContent.text && articleContent.text.trim() !== '');

    const enhancedLecture: EnhancedLecture = {
      ...lecture,
      hasVideoContent: hasRealVideoContent,
      hasArticleContent: hasRealArticleContent,
      articleContent: hasRealArticleContent ? articleContent : undefined,
      videoDetails: hasRealVideoContent && videoContent.selectedVideoDetails ? videoContent.selectedVideoDetails : undefined,
      contentMetadata: {
        createdAt: new Date(),
        lastModified: new Date(),
        ...(hasRealArticleContent && {
          articleWordCount: articleContent.text.split(/\s+/).length
        }),
        ...(hasRealVideoContent && videoContent.selectedVideoDetails?.duration && {
          videoDuration: videoContent.selectedVideoDetails.duration
        })
      }
    };

    let detectedType: "article" | "video" | "quiz" | "coding-exercise" | "assignment";
    
    if (hasRealArticleContent && !hasRealVideoContent) {
      detectedType = 'article';
    } else if (hasRealVideoContent && !hasRealArticleContent) {
      detectedType = 'video';
    } else if (hasRealArticleContent && hasRealVideoContent) {
      console.warn('⚠️ Both article and video content exist - this is unexpected');
      detectedType = 'article';
    } else {
      detectedType = (lecture.contentType as "article" | "video" | "quiz" | "coding-exercise" | "assignment") || 'video';
    }
    
    enhancedLecture.actualContentType = detectedType;
    enhancedLecture.contentType = detectedType;

    return enhancedLecture;
  };

  // Select video handler
  const selectVideo = (videoId: string) => {
    const selectedVideo = videoContent.libraryTab.videos.find(
      (v) => v.id === videoId
    );

    if (selectedVideo) {
      const selectedDetails: SelectedVideoDetails = {
        id: selectedVideo.id,
        filename: selectedVideo.filename,
        duration: "01:45",
        thumbnailUrl: "https://via.placeholder.com/160x120/000000/FFFFFF/?text=Netflix",
        isDownloadable: false,
        url: selectedVideo.url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      };

      setVideoContent({
        ...videoContent,
        libraryTab: {
          ...videoContent.libraryTab,
          selectedVideo: videoId,
        },
        selectedVideoDetails: selectedDetails,
      });

      setArticleContent({ text: "" });

      if (updateLectureContent) {
        const enhancedLecture = createEnhancedLectureForPreview();
        const updatedLecture = ContentTypeDetector.updateLectureContentType(
          enhancedLecture,
          'video',
          selectedDetails
        );
        updateLectureContent(sectionId, lecture.id, updatedLecture);
      }

      setActiveContentType(null);

      if (
        toggleContentSection &&
        (!activeContentSection ||
          activeContentSection.sectionId !== sectionId ||
          activeContentSection.lectureId !== lecture.id)
      ) {
        toggleContentSection(sectionId, lecture.id);
      }
    }
  };

  // Delete video handler
  const deleteVideo = (videoId: string) => {
    setVideoContent({
      ...videoContent,
      libraryTab: {
        ...videoContent.libraryTab,
        videos: videoContent.libraryTab.videos.filter(
          (video) => video.id !== videoId
        ),
        selectedVideo:
          videoContent.libraryTab.selectedVideo === videoId
            ? null
            : videoContent.libraryTab.selectedVideo,
      },
    });
  };

  // Handle edit lecture
  const handleEditLecture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditLectureForm(true);
  };

  // Save lecture edit
  const handleSaveLectureEdit = async () => {
    if (editLectureTitle.trim()) {
      try {
        setEditLoading(true);
        await updateLectureName(sectionId, lecture.id, editLectureTitle.trim());
        setShowEditLectureForm(false);
      } catch (error) {
        console.error("Failed to save lecture edit:", error);
      } finally {
        setEditLoading(false);
      }
    }
  };

  // Cancel lecture edit
  const handleCancelLectureEdit = () => {
    setShowEditLectureForm(false);
  };

  // Handle key down for edit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editLectureTitle.trim()) {
      e.preventDefault();
      handleSaveLectureEdit();
    } else if (e.key === "Escape") {
      handleCancelLectureEdit();
    }
  };

  // Delete lecture handler
  const handleDeleteLecture = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeleteLoading(true);
      await deleteLecture(sectionId, lecture.id);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle downloadable
  const toggleDownloadable = () => {
    if (videoContent.selectedVideoDetails) {
      setVideoContent({
        ...videoContent,
        selectedVideoDetails: {
          ...videoContent.selectedVideoDetails,
          isDownloadable: !videoContent.selectedVideoDetails.isDownloadable,
        },
      });
    }
  };

  // Handle video file upload
  const handleVideoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const videoUrl = URL.createObjectURL(file);

      setVideoContent({
        ...videoContent,
        uploadTab: { selectedFile: file },
      });

      setIsVideoUploading(true);
      setVideoUploadProgress(0);
      setVideoUploadComplete(false);

      try {
        if (uploadVideoToBackend) {
          const backendVideoUrl = await uploadVideoToBackend(
            sectionId,
            lecture.id,
            file,
            (progress) => {
              setVideoUploadProgress(progress);
            }
          );

          if (backendVideoUrl) {
            const videoId = `${file.name.replace(/\s+/g, "")}-${Date.now()}`;

            const existingVideo = videoContent.libraryTab.videos.find(
              (v) => v.filename === file.name
            );

            if (!existingVideo) {
              const newVideo: StoredVideo = {
                id: videoId,
                filename: file.name,
                type: "Video",
                status: "Success",
                date: new Date().toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }),
                url: backendVideoUrl,
              };

              setVideoContent((prev) => ({
                ...prev,
                libraryTab: {
                  ...prev.libraryTab,
                  videos: [newVideo, ...prev.libraryTab.videos],
                },
              }));
            }

            setVideoUploadComplete(true);
            setIsVideoUploading(false);

            setVideoContent((prev) => ({
              ...prev,
              activeTab: "addFromLibrary",
            }));

            toast.success("Video uploaded successfully!");
          }
        } else {
          // Fallback simulation
          const interval = setInterval(() => {
            setVideoUploadProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                  setIsVideoUploading(false);
                  setVideoUploadComplete(true);

                  const videoId = `${file.name.replace(/\s+/g, "")}-${Date.now()}`;

                  const existingVideo = videoContent.libraryTab.videos.find(
                    (v) => v.filename === file.name
                  );

                  if (!existingVideo) {
                    const newVideo: StoredVideo = {
                      id: videoId,
                      filename: file.name,
                      type: "Video",
                      status: "Success",
                      date: new Date().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }),
                      url: videoUrl,
                    };

                    setVideoContent((prev) => ({
                      ...prev,
                      libraryTab: {
                        ...prev.libraryTab,
                        videos: [newVideo, ...prev.libraryTab.videos],
                      },
                    }));
                  }

                  setVideoContent((prev) => ({
                    ...prev,
                    activeTab: "addFromLibrary",
                  }));
                }, 500);
                return 100;
              }
              return prev + 5;
            });
          }, 200);
        }
      } catch (error) {
        console.error('Video upload failed:', error);
        setIsVideoUploading(false);
        setVideoUploadProgress(0);
        setVideoUploadComplete(false);
        toast.error('Failed to upload video. Please try again.');
      }
    }
  };

  // Handle content type selection
  const handleContentTypeSelect = (contentType: ContentItemType) => {
    setActiveContentType(contentType);
    setShowContentTypeSelector(false);

    if (contentType === "video") {
      setArticleContent({ text: "" });
      
      const existingVideos = videoContent.libraryTab.videos;
      const existingSelectedVideoDetails = videoContent.selectedVideoDetails;

      setVideoContent({
        uploadTab: { selectedFile: null },
        libraryTab: {
          searchQuery: "",
          selectedVideo: null,
          videos: existingVideos,
        },
        activeTab: "uploadVideo",
        selectedVideoDetails: existingSelectedVideoDetails,
      });
    } else if (contentType === "video-slide") {
      setArticleContent({ text: "" });
      setVideoSlideContent({
        video: { selectedFile: null },
        presentation: { selectedFile: null },
        step: 1,
      });
    } else if (contentType === "article") {
      setVideoContent({
        ...videoContent,
        selectedVideoDetails: null
      });
      setArticleContent({ text: "" });
    }
  };

  // Handle edit content
  const handleEditContent = () => {
    setActiveContentType("video");
    setShowContentTypeSelector(false);

    setVideoContent({
      ...videoContent,
      activeTab: "addFromLibrary",
      selectedVideoDetails: videoContent.selectedVideoDetails,
    });

    if (
      activeContentSection &&
      activeContentSection.sectionId === sectionId &&
      activeContentSection.lectureId === lecture.id
    ) {
      console.log("Section already expanded, just updating content type and tab");
    } else if (toggleContentSection) {
      toggleContentSection(sectionId, lecture.id);
      console.log("Section was collapsed, expanding it");
    }
  };

  // Resource handlers
  const handleSourceCodeSelect = (file: LibraryFileWithSize) => {
    if (addSourceCodeFile) {
      addSourceCodeFile({
        name: file.filename,
        type: "SourceCode",
        lectureId: lecture.id,
        filename: file.filename,
      });
    }

    if (toggleAddResourceModal) {
      toggleAddResourceModal(sectionId, lecture.id);
    }
  };

  const handleExternalResourceAdd = (title: string, url: string, name: string) => {
    if (addExternalResource) {
      addExternalResource({
        title: title,
        url: url,
        name: name,
        lectureId: lecture.id
      });
    }

    if (toggleAddResourceModal) {
      toggleAddResourceModal(sectionId, lecture.id);
    }
  };

  const handleLibraryItemSelect = (item: LibraryFileWithSize) => {
    if (addUploadedFile) {
      addUploadedFile({
        name: item.filename,
        size: item.size || (item.type === "Video" ? "01:45" : "1.2 MB"),
        lectureId: lecture.id,
      });
    }

    if (toggleAddResourceModal) {
      toggleAddResourceModal(sectionId, lecture.id);
    }
  };

  // Save description handler
  const handleSaveDescription = () => {
    if (saveDescription) {
      saveDescription();
    }
  };

  // Trigger file upload simulation
  const triggerFileUpload = (contentType: ContentType) => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);

            const filename =
              contentType === ContentType.VIDEO
                ? "2025-05-01-025523.webm"
                : "course_materials.pdf";

            if (addUploadedFile) {
              addUploadedFile({
                name: filename,
                size: contentType === ContentType.VIDEO ? "263.5 kB" : "1.2 MB",
                lectureId: lecture.id,
              });
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      videoContent.libraryTab.videos.forEach((video) => {
        if (video.url && video.url.startsWith("blob:")) {
          URL.revokeObjectURL(video.url);
        }
      });

      if (
        videoContent.selectedVideoDetails?.url &&
        videoContent.selectedVideoDetails.url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(videoContent.selectedVideoDetails.url);
      }
    };
  }, []);

  // Focus on lecture name input when editing
  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  // Reset content type when section is collapsed
  useEffect(() => {
    const isExpanded =
      activeContentSection?.sectionId === sectionId &&
      activeContentSection?.lectureId === lecture.id;

    if (!isExpanded) {
      setActiveContentType(null);
      setShowContentTypeSelector(false);
    }
  }, [activeContentSection, sectionId, lecture.id]);

  // Determine lecture type label
  const getLectureTypeLabel = (): string => {
    const enhancedLecture = createEnhancedLectureForPreview();
    
    let detectedType: string;
    if (ContentTypeDetector && typeof ContentTypeDetector.detectLectureContentType === 'function') {
      detectedType = ContentTypeDetector.detectLectureContentType(enhancedLecture);
    } else {
      detectedType = enhancedLecture.actualContentType || 'video';
    }
    
    switch (detectedType) {
      case "video":
        return "Lecture";
      case "article":
        return "Article";
      case "quiz":
        return "Quiz";
      case "coding-exercise":
        return "Coding Exercise";
      case "assignment":
        return "Assignment";
      default:
        return "Item";
    }
  };

  // Check if lecture has existing content
  const hasExistingContent = (lecture: Lecture): boolean => {
    return Boolean(
      (lecture.videos && lecture.videos.length > 0) ||
      lecture.contentType === "article" ||
      videoContent.selectedVideoDetails !== null ||
      (articleContent.text && articleContent.text.trim() !== "")
    );
  };

  // State flags
  const isExpanded =
    activeContentSection?.sectionId === sectionId &&
    activeContentSection?.lectureId === lecture.id;

  const isResourceSectionActive =
    activeResourceSection?.sectionId === sectionId &&
    activeResourceSection?.lectureId === lecture.id;

  const isDescriptionSectionActive =
    activeDescriptionSection?.sectionId === sectionId &&
    activeDescriptionSection?.lectureId === lecture.id;

  const isLoading = editLoading || deleteLoading;
  const maxLength = 80;

  // Render content based on activeContentType
  const renderContent = () => {
    if (!activeContentType) return null;

    switch (activeContentType) {
      case "video":
        return (
          <VideoContentManager
            videoContent={videoContent}
            setVideoContent={setVideoContent}
            isVideoUploading={isVideoUploading}
            videoUploadProgress={videoUploadProgress}
            videoUploadComplete={videoUploadComplete}
            setVideoUploadComplete={setVideoUploadComplete}
            onVideoFileUpload={handleVideoFileUpload}
            onVideoSelect={selectVideo}
            onDeleteVideo={deleteVideo}
            videoUploading={videoUploading}
            onClose={() => {
              setActiveContentType(null);
              if (toggleContentSection) {
                toggleContentSection(sectionId, lecture.id);
              }
            }}
          />
        );
      case "video-slide":
        return (
          <VideoSlideMashupComponent 
            sectionId={sectionId}
            lectureId={lecture.id}
            uploadVideoToBackend={uploadVideoToBackend}
            uploadFileToBackend={handleFileUpload}
          />
        );
      case "article":
        return (
          <Article
            content={content}
            setContent={setContent}
            setHtmlMode={setHtmlMode}
            htmlMode={htmlMode}
            onSave={handleSaveArticle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`mb-3 bg-white border border-gray-400 ${
        isExpanded && "border-b border-gray-500 "
      }${draggedLecture === lecture.id ? "opacity-50" : ""} ${
        dragTarget?.lectureId === lecture.id ? "border-2 border-indigo-500" : ""
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
      {showEditLectureForm ? (
        <div
          className="flex items-center justify-center"
          onClick={() => setShowEditLectureForm(false)}
        >
          <div
            ref={lectureFormRef}
            className="bg-white p-6 rounded-lg w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <FaCircleCheck
                color="black"
                size={14}
                className="shrink-0 text-white mr-2"
              />
              <div className="text-sm font-medium">
                Lecture {lectureIndex + 1}:
              </div>
              <div className="flex-1 ml-2">
                <input
                  type="text"
                  value={editLectureTitle}
                  onChange={(e) => setEditLectureTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 px-2 py-1 rounded-md"
                  autoFocus
                  maxLength={80}
                  disabled={isLoading}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {maxLength - editLectureTitle.length}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCancelLectureEdit}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLectureEdit}
                disabled={!editLectureTitle.trim() || isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {editLoading ? "Saving..." : "Save Lecture"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Lecture Header */}
          <div
            className={`flex items-center ${
              isExpanded && "border-b border-gray-500 "
            } px-3 py-2 `}
          >
            <div className="flex-1 flex items-center">
              <FaCircleCheck
                color="black"
                size={14}
                className="shrink-0 text-white mr-2"
              />
              {editingLectureId === lecture.id ? (
                <input
                  ref={lectureNameInputRef}
                  type="text"
                  value={lecture.name}
                  onChange={(e) =>
                    updateLectureName(sectionId, lecture.id, e.target.value)
                  }
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
                  {getLectureTypeLabel()} {lectureIndex + 1}:{" "}
                  <FileText
                    size={15}
                    className="ml-2 inline-block flex-shrink-0"
                  />
                  <span className="truncate overflow-hidden ml-1">
                    {lecture.name}
                  </span>
                  {isHovering && !isLoading && (
                    <div>
                      <button
                        onClick={handleEditLecture}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDeleteLecture}
                        className="p-1 text-gray-400 hover:text-red-600"
                        aria-label="Delete"
                        disabled={deleteLoading}
                      >
                        <Trash2 className={`w-4 h-4 text-gray-400 hover:bg-gray-200 p-2 rounded ${deleteLoading ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center">
              {!hasExistingContent(lecture) && (
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
                    (showContentTypeSelector && isExpanded) ||
                    isResourceSectionActive ||
                    activeContentType
                      ? "text-gray-800 font-normal border-b-0 border-l border-t border-r border-gray-400 -mb-[12px] bg-white pb-2"
                      : "text-[#6D28D2] font-medium border-[#6D28D2] hover:bg-indigo-50 rounded "
                  } text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center ml-1 sm:ml-2 border`}
                  disabled={isLoading}
                >
                  {isResourceSectionActive ? (
                    <>
                      <span className="font-bold">Add Resource</span>
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
                  ) : activeContentType === "video" ? (
                    <>
                      <span className="font-bold">Add Video</span>
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
                  ) : activeContentType === "video-slide" ? (
                    <>
                      <span className="font-bold">
                        Add Video & Slide Mashup
                      </span>
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
                  ) : activeContentType === "article" ? (
                    <>
                      <span className="font-bold">Add Article</span>
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
                      <span className="font-bold">Select content type</span>
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
                      <span className="font-bold">Content</span>
                    </>
                  )}
                </button>
              )}

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
                disabled={isLoading}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {isHovering && !isLoading && (
                <div>
                  <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
                </div>
              )}
            </div>
          </div>

          {/* Expanded Content Area */}
          {(isExpanded ||
            isResourceSectionActive ||
            isDescriptionSectionActive) && (
            <div>
              {/* Resource Component */}
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
                  onLibraryItemSelect={handleLibraryItemSelect}
                  onSourceCodeSelect={handleSourceCodeSelect}
                  onExternalResourceAdd={handleExternalResourceAdd}
                />
              )}

              {/* Description Component */}
              {isDescriptionSectionActive &&
                updateCurrentDescription &&
                saveDescription && (
                  <DescriptionEditorComponent
                    activeDescriptionSection={activeDescriptionSection}
                    onClose={() => {
                      if (toggleDescriptionEditor) {
                        toggleDescriptionEditor(
                          sectionId,
                          lecture.id,
                          currentDescription
                        );
                      }
                    }}
                    currentDescription={currentDescription || ""}
                    setCurrentDescription={updateCurrentDescription}
                    saveDescription={handleSaveDescription}
                  />
                )}

              {/* Content Type Selector */}
              {showContentTypeSelector &&
                !activeContentType &&
                !isResourceSectionActive &&
                !isDescriptionSectionActive && (
                  <ContentSelector
                    handleContentTypeSelect={handleContentTypeSelect}
                  />
                )}

              {/* Content Renderer */}
              {activeContentType && renderContent()}

              {/* Content Display */}
              {!showContentTypeSelector &&
                !activeContentType &&
                !isResourceSectionActive &&
                !isDescriptionSectionActive && (
                  <LectureContentDisplay
                    lecture={lecture}
                    sectionId={sectionId}
                    videoContent={videoContent}
                    articleContent={articleContent}
                    isExpanded={isExpanded}
                    isResourceSectionActive={isResourceSectionActive}
                    isDescriptionSectionActive={isDescriptionSectionActive}
                    onEditContent={handleEditContent}
                    onToggleDownloadable={toggleDownloadable}
                    onToggleDescriptionEditor={toggleDescriptionEditor}
                    onToggleAddResourceModal={toggleAddResourceModal}
                    onSetActiveContentType={setActiveContentType}
                    onToggleContentSection={toggleContentSection}
                    currentLectureUploadedFiles={currentLectureUploadedFiles}
                    currentLectureSourceCodeFiles={currentLectureSourceCodeFiles}
                    currentLectureExternalResources={currentLectureExternalResources}
                    removeUploadedFile={removeUploadedFile}
                    removeSourceCodeFile={removeSourceCodeFile}
                    removeExternalResource={removeExternalResource}
                    globalUploadedFiles={globalUploadedFiles}
                    globalSourceCodeFiles={globalSourceCodeFiles}
                    globalExternalResources={globalExternalResources}
                    allSections={allSections}
                    children={children}
                  />
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
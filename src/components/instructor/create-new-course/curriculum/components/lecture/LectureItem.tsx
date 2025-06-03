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
  LectureItemProps,
  Lecture,
  EnhancedLecture,
  ContentTypeDetector,
  ExternalResource,
} from "@/lib/types";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  FileText,
  AlignJustify,
  SquareArrowOutUpRight,
  FileDown,
} from "lucide-react";
import AddResourceComponent from "./AddResourceComponent";
import DescriptionEditorComponent from "./DescriptionEditorComponent";
import "react-quill-new/dist/quill.snow.css";
import { ContentSelector } from "./ContentSelector";
import VideoSlideMashupComponent from "./VideoAndSlideMashup";
import Article from "./Article";
import StudentVideoPreview from "./StudentVideoPeview";
import InstructorVideoPreview from "./InstructorVideoPeview";
import { FaCircleCheck } from "react-icons/fa6";
import toast from "react-hot-toast";

interface SelectedVideoDetails {
  id: string;
  filename: string;
  duration: string;
  thumbnailUrl: string;
  isDownloadable: boolean;
  url?: string;
}

interface LibraryFileWithSize extends StoredVideo {
  size?: string;
}

export interface SourceCodeFile {
  lectureId: string;
  filename: string;
  name: string;
  type: string;
}

interface ExternalResourceItem {
  title: string 
  url: string;
  name: string;
  lectureId?: string;
  filename?: string;
}

// Updated LectureItemProps interface with async functions
interface UpdatedLectureItemProps extends Omit<LectureItemProps, 'updateLectureName' | 'deleteLecture'> {
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => Promise<void>;
  deleteLecture: (sectionId: string, lectureId: string) => Promise<void>;
  // NEW: Backend integration props
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
  // NEW: Backend integration props
  uploadVideoToBackend,
  saveArticleToBackend,
  videoUploading = false,
  videoUploadProgres = 0,
}: UpdatedLectureItemProps) {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [content, setContent] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(videoUploadProgres);
  const [videoUploadComplete, setVideoUploadComplete] = useState(false);
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "instructor" | "student" | null
  >(null);
  const [showEditLectureForm, setShowEditLectureForm] =
    useState<boolean>(false);
  const [editLectureTitle, setEditLectureTitle] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const lectureFormRef = useRef<HTMLDivElement>(null);
  const [activeContentType, setActiveContentType] =
    useState<ContentItemType | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(
    ResourceTabType.DOWNLOADABLE_FILE
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const currentLectureUploadedFiles = globalUploadedFiles.filter(file => file.lectureId === lecture.id);
  const currentLectureSourceCodeFiles = globalSourceCodeFiles.filter(file => file.lectureId === lecture.id);
  const currentLectureExternalResources = globalExternalResources.filter(resource => resource.lectureId === lecture.id);
  const [previewContentType, setPreviewContentType] = useState<string>("video");

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
  const [videoSlideContent, setVideoSlideContent] = useState<VideoSlideContent>(
    {
      video: { selectedFile: null },
      presentation: { selectedFile: null },
      step: 1,
    }
  );
  const [articleContent, setArticleContent] = useState<ArticleContent>({
    text: "",
  });

  // Add this useEffect to initialize the edit form when opened
  useEffect(() => {
    if (showEditLectureForm) {
      setEditLectureTitle(lecture.name || " ");
    }
  }, [showEditLectureForm, lecture.name]);

  // Add this function to handle the edit button click
  const handleEditLecture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditLectureForm(true);
  };

  const handleSaveArticle = async (articleContent: string) => {
      
    try {
      // Save to backend first
      if (saveArticleToBackend) {
        const a  = await saveArticleToBackend(sectionId, lecture.id, articleContent);
        console.log(a)
      }
      
      // Update local state after successful backend save
      setArticleContent({ text: articleContent });
      
      // CRITICAL: Clear video content when saving article
      if (videoContent.selectedVideoDetails) {
        setVideoContent({
          ...videoContent,
          selectedVideoDetails: null
        });
      }

      // CRITICAL: Update the lecture's content type to 'article'
      if (updateLectureContent) {
        const updatedLecture = ContentTypeDetector.updateLectureContentType(
          createEnhancedLectureForPreview(),
          'article',
          { text: articleContent }
        );
        updateLectureContent(sectionId, lecture.id, updatedLecture);
      }

      // Close the content section and show the article summary
      setActiveContentType(null);

      // Make sure lecture stays expanded
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

  // CRITICAL FIX: Update selectVideo to properly set content type
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

      // CRITICAL: Clear article content when selecting a video
      setArticleContent({ text: "" });

      // CRITICAL: Update the lecture's content type to 'video'
      if (updateLectureContent) {
        const updatedLecture = ContentTypeDetector.updateLectureContentType(
          createEnhancedLectureForPreview(),
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

  // NEW: Updated function to save the lecture edit with backend integration
  const handleSaveLectureEdit = async () => {
    if (editLectureTitle.trim()) {
      try {
        setEditLoading(true);
        await updateLectureName(sectionId, lecture.id, editLectureTitle.trim());
        setShowEditLectureForm(false);
      } catch (error) {
        console.error("Failed to save lecture edit:", error);
        // Error is already handled in the service with toast
      } finally {
        setEditLoading(false);
      }
    }
  };

  // Add this function to cancel the lecture edit
  const handleCancelLectureEdit = () => {
    setShowEditLectureForm(false);
  };

  // Add this to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editLectureTitle.trim()) {
      e.preventDefault();
      handleSaveLectureEdit();
    } else if (e.key === "Escape") {
      handleCancelLectureEdit();
    }
  };

  // NEW: Updated handleDeleteLecture with backend integration
  const handleDeleteLecture = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeleteLoading(true);
      await deleteLecture(sectionId, lecture.id);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
      // Error is already handled in the service with toast
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add these handlers for the video and slide mashup
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

  useEffect(() => {
    // Clean up function to revoke object URLs when component unmounts
    return () => {
      // Revoke URLs for videos in the library
      videoContent.libraryTab.videos.forEach((video) => {
        if (video.url && video.url.startsWith("blob:")) {
          URL.revokeObjectURL(video.url);
        }
      });

      // Revoke URL for selected video if it exists
      if (
        videoContent.selectedVideoDetails?.url &&
        videoContent.selectedVideoDetails.url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(videoContent.selectedVideoDetails.url);
      }
    };
  }, []);

  // Function to handle the edit content button click
  const handleEditContent = () => {
    // Force set all the required states directly
    setActiveContentType("video");
    setShowContentTypeSelector(false);

    setVideoContent({
      ...videoContent,
      activeTab: "addFromLibrary",
      selectedVideoDetails: videoContent.selectedVideoDetails,
    });

    // If we have access to the activeContentSection state in the parent component
    // We could directly set it rather than toggling
    if (
      activeContentSection &&
      activeContentSection.sectionId === sectionId &&
      activeContentSection.lectureId === lecture.id
    ) {
      // It's already expanded, we've set the correct states above
      console.log(
        "Section already expanded, just updating content type and tab"
      );
    } else if (toggleContentSection) {
      // It's collapsed, so we need to expand it
      toggleContentSection(sectionId, lecture.id);
      console.log("Section was collapsed, expanding it");
    }
  };

  // FIXED: Updated createEnhancedSections function with proper type conversion
  const createEnhancedSections = () => {
    if (!allSections || allSections.length === 0) {
      return allSections;
    }

    console.log('📦 Using global resources for enhanced sections:', {
      totalUploadedFiles: globalUploadedFiles.length,
      totalSourceCodeFiles: globalSourceCodeFiles.length,
      totalExternalResources: globalExternalResources.length
    });

    // Process all sections and enhance ALL lectures with proper resource attachment
    return allSections.map(section => ({
      ...section,
      lectures: section.lectures?.map(lec => {
        // Get resources for this specific lecture from global arrays
        const lectureUploadedFiles = globalUploadedFiles.filter(file => file.lectureId === lec.id);
        const lectureSourceCodeFiles = globalSourceCodeFiles.filter(file => file.lectureId === lec.id);
        const lectureExternalResources = globalExternalResources.filter(resource => resource.lectureId === lec.id);

        let enhancedLecture: EnhancedLecture;
        
        if (lec.id === lecture.id) {
          // For the current lecture, create enhanced version with current state
          enhancedLecture = createEnhancedLectureForPreview();
        } else {
          // For other lectures, determine their content type properly
          const existingEnhanced = lec as EnhancedLecture;
          
          if (existingEnhanced.actualContentType) {
            enhancedLecture = existingEnhanced;
          } else {
            let hasVideoContent = false;
            let hasArticleContent = false;
            let actualContentType = lec.contentType || 'video';
            
            if (lec.contentType === 'article') {
              hasArticleContent = true;
              actualContentType = 'article';
            } else if (lec.contentType === 'video' || !lec.contentType) {
              hasVideoContent = true;
              actualContentType = 'video';
            } else {
              actualContentType = lec.contentType;
            }
            
            enhancedLecture = {
              ...lec,
              actualContentType: actualContentType as any,
              hasVideoContent,
              hasArticleContent,
              contentMetadata: {
                createdAt: new Date(),
                lastModified: new Date()
              }
            };
          }
        }
        
        // Attach resources to each lecture from global arrays
        enhancedLecture.lectureResources = {
          uploadedFiles: lectureUploadedFiles,
          sourceCodeFiles: lectureSourceCodeFiles,
          externalResources: lectureExternalResources
        };
        
        console.log(`Enhanced lecture ${lec.id}:`, {
          id: lec.id,
          name: lec.name,
          actualContentType: enhancedLecture.actualContentType,
          resourceCounts: {
            uploaded: lectureUploadedFiles.length,
            sourceCode: lectureSourceCodeFiles.length,
            external: lectureExternalResources.length
          }
        });
        
        return enhancedLecture;
      }) || []
    }));
  };

  // FIXED: Updated handleExternalResourceAdd function with proper typing
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

  // FIXED: Don't filter resources in handlePreviewSelection - pass ALL resources
  const handlePreviewSelection = (mode: "instructor" | "student"): void => {
    const enhancedLecture = createEnhancedLectureForPreview();
    
    let detectedContentType: string;
    if (ContentTypeDetector && typeof ContentTypeDetector.detectLectureContentType === 'function') {
      detectedContentType = ContentTypeDetector.detectLectureContentType(enhancedLecture);
    } else {
      detectedContentType = enhancedLecture.actualContentType || 'video';
    }

    setPreviewMode(mode);
    setShowPreviewDropdown(false);
    setPreviewContentType(detectedContentType);

    setTimeout(() => {
      setShowVideoPreview(true);
    }, 50);
  };

  const createEnhancedLectureForPreview = (): EnhancedLecture => {
    // FIXED: More precise content detection logic
    const hasRealVideoContent = !!(videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url);
    const hasRealArticleContent = !!(articleContent && articleContent.text && articleContent.text.trim() !== '');

    const enhancedLecture: EnhancedLecture = {
      ...lecture,
      // FIXED: Only set to true if content actually exists
      hasVideoContent: hasRealVideoContent,
      hasArticleContent: hasRealArticleContent,
      articleContent: hasRealArticleContent ? articleContent : undefined,
      // FIXED: Handle null case by converting to undefined
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

    // FIXED: Enhanced content type detection logic with proper typing
    let detectedType: "article" | "video" | "quiz" | "coding-exercise" | "assignment";
    
    // IMPORTANT: Check for actual content, not just the presence of objects
    if (hasRealArticleContent && !hasRealVideoContent) {
      detectedType = 'article';
    } else if (hasRealVideoContent && !hasRealArticleContent) {
      detectedType = 'video';
    } else if (hasRealArticleContent && hasRealVideoContent) {
      // This should not happen - log a warning
      console.warn('⚠️ Both article and video content exist - this is unexpected');
      // Default to the most recently set content (article takes precedence as it's set last)
      detectedType = 'article';
    } else {
      // Neither has content, use the original content type or default to video
      detectedType = (lecture.contentType as "article" | "video" | "quiz" | "coding-exercise" | "assignment") || 'video';
    }
    
    enhancedLecture.actualContentType = detectedType;
    enhancedLecture.contentType = detectedType;

    return enhancedLecture;
  };

  // For debugging
  const VideoPreviewPage: React.FC = () => {
    const enhancedLecture = createEnhancedLectureForPreview();
    const enhancedSections = createEnhancedSections(); // This now includes all resources properly
    
    const hasArticleContent = !!(articleContent && articleContent.text && articleContent.text.trim() !== '') && 
      !videoContent.selectedVideoDetails;

    const [activeItemId, setActiveItemId] = useState<string>(lecture.id);
    const [activeItemType, setActiveItemType] = useState<string>(
      hasArticleContent ? "article" : previewContentType || enhancedLecture.actualContentType || "video"
    );

    useEffect(() => {
      console.log("🚀 VideoPreviewPage initialized with enhanced sections:", {
        hasArticleContent,
        articleTextExists: !!articleContent?.text,
        articleLength: articleContent?.text?.length || 0,
        videoDetailsExists: !!videoContent.selectedVideoDetails,
        previewContentType,
        activeItemType,
        enhancedSectionsCount: enhancedSections.length,
        totalLecturesWithResources: enhancedSections.reduce((acc, section) => 
          acc + section.lectures.filter((l: EnhancedLecture) => 
            l.lectureResources && (
              l.lectureResources.uploadedFiles.length > 0 || 
              l.lectureResources.sourceCodeFiles.length > 0 || 
              l.lectureResources.externalResources.length > 0
            )
          ).length, 0
        )
      });
    }, []);

    const handleItemSelect = (itemId: string, itemType: string) => {
      console.log(`🎯 Switching to item ${itemId} of type ${itemType}`);
      setActiveItemId(itemId);
      setActiveItemType(itemType);
    };

    if (previewMode === "student") {
      return (
        <StudentVideoPreview
        videoContent={videoContent}
        articleContent={articleContent}
        setShowVideoPreview={setShowVideoPreview}
        lecture={enhancedLecture}
        uploadedFiles={globalUploadedFiles} // Pass global arrays
        sourceCodeFiles={globalSourceCodeFiles} // Pass global arrays
        externalResources={globalExternalResources} // Pass global arrays
        section={{
          id: 'all-sections',
          name: 'All Sections',
          sections: enhancedSections
        }}
      />
      );
    }

    // Instructor preview
    const currentSection = enhancedSections.find(section => section.id === sectionId) || {
      id: sectionId,
      name: "Section",
      lectures: [enhancedLecture],
      quizzes: [],
      assignments: [],
      codingExercises: [],
      isExpanded: true
    };

    return (
      <InstructorVideoPreview
        videoContent={videoContent}
        articleContent={articleContent}
        setShowVideoPreview={setShowVideoPreview}
        lecture={enhancedLecture}
        section={currentSection}
      />
    );
  };

  // Add the closing event handler for clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Check if the dropdown is open
      if (!showPreviewDropdown) return;

      // Check if the click was outside the dropdown area
      const dropdownElement = document.getElementById("preview-dropdown");
      const target = event.target as Node;

      if (dropdownElement && !dropdownElement.contains(target)) {
        setShowPreviewDropdown(false);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPreviewDropdown]);

  const isArticleContent = (): boolean => {
    return (
      !!(articleContent && articleContent.text && articleContent.text.trim() !== '') &&
      !videoContent.selectedVideoDetails
    );
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

  // Add this function to handle the video file upload and progress
  const handleVideoFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Create a local URL for the video file that can be used in the player
      const videoUrl = URL.createObjectURL(file);

      // Update the state with the selected file
      setVideoContent({
        ...videoContent,
        uploadTab: { selectedFile: file },
      });

      // Start the upload process
      setIsVideoUploading(true);
      setVideoUploadProgress(0);
      setVideoUploadComplete(false);

      try {
        // Upload to backend
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
            // Generate a unique ID based on the filename and current timestamp
            const videoId = `${file.name.replace(/\s+/g, "")}-${Date.now()}`;

            // Check if a video with the same filename already exists
            const existingVideo = videoContent.libraryTab.videos.find(
              (v) => v.filename === file.name
            );

            // Only add to library if it doesn't already exist
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
                url: backendVideoUrl, // Use the backend URL
              };

              setVideoContent((prev) => ({
                ...prev,
                libraryTab: {
                  ...prev.libraryTab,
                  videos: [newVideo, ...prev.libraryTab.videos],
                },
              }));
            }

            // Set upload complete
            setVideoUploadComplete(true);
            setIsVideoUploading(false);

            // Switch to the library tab to show the uploaded video
            setVideoContent((prev) => ({
              ...prev,
              activeTab: "addFromLibrary",
            }));

            toast.success("Video uploaded successfully!");
          }
        } else {
          // Fallback to original simulation if backend function not available
          const interval = setInterval(() => {
            setVideoUploadProgress((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                  setIsVideoUploading(false);
                  setVideoUploadComplete(true);

                  // Generate a unique ID based on the filename and current timestamp
                  const videoId = `${file.name.replace(/\s+/g, "")}-${Date.now()}`;

                  // Check if a video with the same filename already exists
                  const existingVideo = videoContent.libraryTab.videos.find(
                    (v) => v.filename === file.name
                  );

                  // Only add to library if it doesn't already exist
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
                      url: videoUrl, // Store URL in the library as well
                    };

                    setVideoContent((prev) => ({
                      ...prev,
                      libraryTab: {
                        ...prev.libraryTab,
                        videos: [newVideo, ...prev.libraryTab.videos],
                      },
                    }));
                  }

                  // Switch to the library tab to show the uploaded video
                  setVideoContent((prev) => ({
                    ...prev,
                    activeTab: "addFromLibrary",
                  }));
                }, 500);
                return 100;
              }
              return prev + 5; // Increase by 5% each time
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

  // Function to handle saving description
  const handleSaveDescription = () => {
    if (saveDescription) {
      saveDescription();
    }
  };

  // Video tab options
  const videoTabs: TabInterface[] = [
    { label: "Upload Video", key: "uploadVideo" },
    { label: "Add from library", key: "addFromLibrary" },
  ];

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  // Determine lecture type label based on contentType
  const getLectureTypeLabel = (): string => {
    // ENHANCED: Use enhanced content type detection
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

  // Handle search in library tab
  const handleSearchLibrary = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", videoContent.libraryTab.searchQuery);
  };

  // Updated for clarity - when initializing with handleContentTypeSelect
  const handleContentTypeSelect = (contentType: ContentItemType) => {
    console.log('🔄 Switching content type to:', contentType);
    
    setActiveContentType(contentType);
    setShowContentTypeSelector(false);

    if (contentType === "video") {
      // FIXED: Clear article content when switching to video
      setArticleContent({ text: "" });
      
      // Keep existing videos in the library when initializing
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
      // FIXED: Clear other content types
      setArticleContent({ text: "" });
      setVideoSlideContent({
        video: { selectedFile: null },
        presentation: { selectedFile: null },
        step: 1,
      });
    } else if (contentType === "article") {
      // FIXED: Clear video content when switching to article
      setVideoContent({
        ...videoContent,
        selectedVideoDetails: null // Clear selected video
      });
      setArticleContent({ text: "" });
    }
  };

  // Function to delete a video from the library
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

  const isExpanded =
    activeContentSection?.sectionId === sectionId &&
    activeContentSection?.lectureId === lecture.id;

  // Determine if the resource section is active for THIS specific lecture
  const isResourceSectionActive =
    activeResourceSection?.sectionId === sectionId &&
    activeResourceSection?.lectureId === lecture.id;

  // Determine if the description section is active for THIS specific lecture
  const isDescriptionSectionActive =
    activeDescriptionSection?.sectionId === sectionId &&
    activeDescriptionSection?.lectureId === lecture.id;

  // Reset content type when section is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setActiveContentType(null);
      setShowContentTypeSelector(false);
    }
  }, [isExpanded]);


  const renderUploadTab = () => {
    return (
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
                <div className="truncate">
                  {videoContent.uploadTab.selectedFile?.name ||
                    "2025-05-01-025523.webm"}
                </div>
                <div>Video</div>
                <div>Success</div>
                <div className="flex justify-between items-center">
                  {new Date().toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                  <button
                    className="text-[#D28D2] hover:text-[#7D28D2] text-xs font-bold"
                    onClick={() => {
                      setVideoUploadComplete(false);
                      setVideoContent({
                        ...videoContent,
                        uploadTab: { selectedFile: null },
                      });
                    }}
                  >
                    Replace
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (isVideoUploading || videoUploading) ? (
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
                <div className="truncate">
                  {videoContent.uploadTab.selectedFile?.name ||
                    "2025-05-01-025523.webm"}
                </div>
                <div>Video</div>
                <div className="flex items-center">
                  <div className="w-full flex items-center">
                    <div className="w-20 bg-gray-200 h-2 overflow-hidden rounded">
                      <div
                        className="bg-[#6D28D9] h-2"
                        style={{ width: `${videoUploading ? videoUploadProgress : videoUploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">
                      {Math.round(videoUploading ? videoUploadProgress : videoUploadProgress)}%
                    </span>
                  </div>
                </div>
                <div>
                  {new Date().toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
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
                  : "No file selected"}
              </span>
              <label className="ml-4 px-2 py-3 border border-[#6D28D2] text-sm font-bold text-[#6D28D2] rounded hover:bg-[#6D28D2]/10 cursor-pointer transition">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                  disabled={videoUploading || isVideoUploading}
                />
                {videoUploading || isVideoUploading ? 'Uploading...' : 'Select Video'}
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500 ">
              <strong className="font-bold">Note:</strong>{" "}
              <span className="font-semibold">
                All files should be at least 720p and less than 4.0 GB.
              </span>
            </p>
          </>
        )}
      </div>
    );
  };


  const renderLibraryTab = () => {
    const filteredVideos = videoContent.libraryTab.videos.filter((video) =>
      video.filename
        .toLowerCase()
        .includes(videoContent.libraryTab.searchQuery.toLowerCase())
    );

    return (
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
        <div className="border-b border-gray-300">
          <div className="grid grid-cols-4 gap-2 md:gap-4 p-3 text-[16px] font-bold border-b border-gray-300">
            <div>Filename</div>
            <div>Type</div>
            <div>Status</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                Date <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div
                key={video.id}
                className="grid grid-cols-4 gap-2 md:gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 items-center"
              >
                <div className="truncate">{video.filename}</div>
                <div>{video.type}</div>
                <div className="text-sm font-medium text-green-800">
                  {video.status}
                </div>
                <div className="flex items-center justify-between">
                  <div>{video.date}</div>
                  <div className="text-indigo-600">
                    <button
                      onClick={() => selectVideo(video.id)}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="ml-2 text-indigo-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-7 text-center text-gray-500 text-sm">
              No results found.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper to render the content based on activeContentType
  const renderContent = () => {
    if (!activeContentType) return null;

    switch (activeContentType) {
      case "video":
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
                        ? "text-gray-800 font-bold border-b-3 border-gray-800"
                        : "text-gray-500 hover:text-gray-700 font-semibold"
                    }`}
                    onClick={() =>
                      setVideoContent({ ...videoContent, activeTab: tab.key })
                    }
                    disabled={videoUploading || isVideoUploading}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {videoContent.activeTab === "uploadVideo" ? (
                renderUploadTab()
              ) : (
                // Render the library tab with stored videos
                renderLibraryTab()
              )}
            </div>
          </div>
        );
      case "video-slide":
        return <VideoSlideMashupComponent />;
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

  // Simulate uploading a file for resources
  const triggerFileUpload = (contentType: ContentType) => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);

            // Add a new dummy file to the list with lecture association
            const filename =
              contentType === ContentType.VIDEO
                ? "2025-05-01-025523.webm"
                : "course_materials.pdf";

            // FIXED: Use the global add function instead of local setState
            if (addUploadedFile) {
              addUploadedFile({
                name: filename,
                size: contentType === ContentType.VIDEO ? "263.5 kB" : "1.2 MB",
                lectureId: lecture.id, // Associate with current lecture
              });
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const maxLength = 80;

  const hasExistingContent = (lecture: Lecture): boolean => {
    return Boolean(
      (lecture.videos && lecture.videos.length > 0) ||
      lecture.contentType === "article" ||
      videoContent.selectedVideoDetails !== null ||
      (articleContent.text && articleContent.text.trim() !== "")
    );
  };

  const isLoading = editLoading || deleteLoading;

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
          <div
            className={`flex items-center ${
              isExpanded && "border-b border-gray-500 "
            } px-3 py-2 `}
          >
            {/* ... existing header code ... */}
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
              <div
                className={`hidden sm:flex items-center space-x-1 transition-opacity duration-200 ${
                  isHovering ? "opacity-100" : "opacity-0"
                }`}
              ></div>

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
                  {/* This is the content button that changes label based on state */}
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
                <div className="">
                  <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
                </div>
              )}
            </div>
          </div>

          {/* Rest of the component remains the same - just truncating for brevity */}
          {/* Expanded content area - this is where we update the code */}
          {(isExpanded ||
            isResourceSectionActive ||
            isDescriptionSectionActive) && (
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
                  onLibraryItemSelect={handleLibraryItemSelect}
                  onSourceCodeSelect={handleSourceCodeSelect}
                  onExternalResourceAdd={handleExternalResourceAdd}
                />
              )}

              {/* Render Description Component when active */}
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

              {showContentTypeSelector &&
                !activeContentType &&
                !isResourceSectionActive &&
                !isDescriptionSectionActive && (
                  <ContentSelector
                    handleContentTypeSelect={handleContentTypeSelect}
                  />
                )}

              {activeContentType && renderContent()}

              {!showContentTypeSelector &&
                !activeContentType &&
                !isResourceSectionActive &&
                !isDescriptionSectionActive && (
                  <div className="p-4">
                    {/* This is where we add the selected video component */}
                    {videoContent.selectedVideoDetails && (
                      <div className="overflow-hidden border-b border-gray-400 mb-4">
                        <div className="flex flex-row justify-between sm:flex-row">
                          {/* Left side with thumbnail and video details */}
                          <div className="flex items-center py-3">
                            {/* Thumbnail */}
                            <div className="w-20 h-16 bg-black rounded overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src="https://via.placeholder.com/160x120/000000/FFFFFF/?text=Video"
                                alt={videoContent.selectedVideoDetails.filename}
                                className="w-full h-full object-cover"
                                onError={(
                                  e: React.SyntheticEvent<HTMLImageElement>
                                ) => {
                                  // Type-safe error handling for image loading
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://via.placeholder.com/160x120/000000/FFFFFF/?text=Video";
                                }}
                              />
                            </div>

                            {/* Video info */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                {videoContent.selectedVideoDetails.filename}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {videoContent.selectedVideoDetails.duration}
                              </p>
                              <button
                                onClick={handleEditContent}
                                className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium flex items-center mt-1"
                              >
                                <Edit3 className="w-3 h-3 mr-1" /> Edit Content
                              </button>
                            </div>
                          </div>

                          {/* Right side with Preview button and Downloadable toggle */}
                          <div className="flex flex-col gap-4 justify-end items-center py-3">
                            {/* Preview dropdown button */}
                            <div
                              className="relative inline-flex gap-4"
                              id="preview-dropdown"
                            >
                              <button
                                onClick={() =>
                                  setShowPreviewDropdown(!showPreviewDropdown)
                                }
                                className="bg-[#6D28D2] text-white text-sm font-medium ml-16 px-4 py-1.5 rounded hover:bg-[#7D28D2] flex items-center"
                                type="button"
                              >
                                Preview <ChevronDown className="ml-1 w-4 h-4" />
                              </button>

                              {/* Dropdown menu - using absolute positioning */}
                              {showPreviewDropdown && (
                                <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                  <ul>
                                    <li>
                                      <button
                                        onClick={() =>
                                          handlePreviewSelection("instructor")
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        type="button"
                                      >
                                        As Instructor
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        onClick={() =>
                                          handlePreviewSelection("student")
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        type="button"
                                      >
                                        As Student
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-800">
                                Downloadable:
                              </span>
                              <button
                                type="button"
                                onClick={toggleDownloadable}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  videoContent.selectedVideoDetails
                                    .isDownloadable
                                    ? "bg-[#6D28D2]"
                                    : "bg-gray-400"
                                }`}
                                aria-pressed={
                                  videoContent.selectedVideoDetails
                                    .isDownloadable
                                }
                                aria-label={
                                  videoContent.selectedVideoDetails
                                    .isDownloadable
                                    ? "Disable downloading"
                                    : "Enable downloading"
                                }
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    videoContent.selectedVideoDetails
                                      .isDownloadable
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display the lecture description if it exists */}
                    {lecture.description && (
                      <div className="mb-4 border-b border-gray-400 pb-2">
                        <div
                          className="text-gray-800 text-sm pt-1 pr-1 hover:outline-1 hover:outline-gray-400 border-gray-300 cursor-pointer "
                          onClick={(e) => {
                            e.stopPropagation();
                            if (toggleDescriptionEditor) {
                              toggleDescriptionEditor(
                                sectionId,
                                lecture.id,
                                lecture.description || ""
                              );
                            }
                          }}
                          dangerouslySetInnerHTML={{
                            __html: lecture.description,
                          }}
                        />
                      </div>
                    )}
                 
                    {/* Display Downloadable Materials section if files exist for this lecture */}
                    {currentLectureUploadedFiles.length > 0 && (
                      <div className="mb-4 border-b border-gray-400 pb-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">
                          Downloadable materials
                        </h3>
                        {currentLectureUploadedFiles.map((file, index) => (
                          <div
                            key={`uploaded-${file.name}-${file.lectureId}-${index}`} // More unique key
                            className="flex justify-between items-center py-1"
                          >
                            <div className="flex items-center text-gray-800">
                              <FileDown size={13} className="text-gray-800 mr-1" />
                              <span className="text-sm text-gray-800">
                                {file.name} ({file.size})
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (removeUploadedFile) {
                                  removeUploadedFile(file.name, lecture.id);
                                }
                              }}
                              className="text-gray-400 hover:bg-gray-200 p-2 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display Source Code section if files exist for this lecture - FIXED */}
                    {currentLectureSourceCodeFiles.length > 0 && (
                      <div className="mb-4 border-b border-gray-400 pb-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">
                          Source Code
                        </h3>
                        {currentLectureSourceCodeFiles.map((file, index) => (
                          <div
                            key={`source-code-${file.filename}-${file.lectureId}-${index}`} // Fixed unique key
                            className="flex justify-between items-center py-1"
                          >
                            <div className="flex items-center text-gray-800">
                              <span className="text-sm text-gray-800">
                                {file.filename || file.name}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (removeSourceCodeFile) {
                                  removeSourceCodeFile(file.name, lecture.id);
                                }
                              }}
                              className="text-gray-400 hover:bg-gray-200 p-2 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display External Resources section if files exist for this lecture - FIXED */}
                    {currentLectureExternalResources.length > 0 && (
                      <div className="mb-4 border-b border-gray-400 pb-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">
                          External Resources
                        </h3>
                        {currentLectureExternalResources.map((resource, index) => {
                          // Get the resource title, handling undefined cases
                          const resourceTitle = typeof resource.title === 'string' 
                            ? resource.title 
                            : resource.name || `Resource ${index + 1}`;
                            
                          return (
                            <div
                              key={`external-${resourceTitle}-${resource.lectureId}-${index}`} // Fixed unique key
                              className="flex justify-between items-center py-1"
                            >
                              <div className="flex items-center text-gray-800">
                                <SquareArrowOutUpRight size={13} className="mr-1 text-gray-800" />
                                <span className="text-sm text-gray-800">
                                  {resourceTitle}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  if (removeExternalResource) {
                                    removeExternalResource(resourceTitle, lecture.id);
                                  }
                                }}
                                className="text-gray-400 hover:bg-gray-200 p-2 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {articleContent.text &&
                      articleContent.text.trim() !== "" &&
                      !videoContent.selectedVideoDetails && (
                        <div className="overflow-hidden border-b border-gray-400 mb-4">
                          <div className="flex flex-row justify-between sm:flex-row items-start">
                            {/* Left side with article icon and details */}
                            <div className="flex items-center py-3">
                              {/* Article icon/thumbnail */}
                              <div className="w-24 h-20 bg-black rounded overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center">
                                <FileText size={60} className="text-white" />
                              </div>

                              {/* Article info */}
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                  Article
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {`${articleContent.text.length} characters`}
                                </p>
                                <button
                                  onClick={() => {
                                    setActiveContentType("article");
                                    if (!isExpanded && toggleContentSection) {
                                      toggleContentSection(
                                        sectionId,
                                        lecture.id
                                      );
                                    }
                                  }}
                                  className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium flex items-center mt-1"
                                >
                                  <Edit3 className="w-3 h-3 mr-1" /> Edit
                                  Content
                                </button>
                                <button
                                  onClick={() => {
                                    // Clear article content
                                    setArticleContent({ text: "" });
                                    // Set content type to video
                                    setActiveContentType("video");
                                    if (!isExpanded && toggleContentSection) {
                                      toggleContentSection(
                                        sectionId,
                                        lecture.id
                                      );
                                    }
                                  }}
                                  className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium"
                                >
                                  Replace With Video
                                </button>
                              </div>
                            </div>

                            {/* Right side with Preview button and Replace with Video link */}
                            <div className="flex flex-col gap-2 justify-end items-start py-3">
                              {/* Preview dropdown button */}
                              <div
                                className="relative inline-flex gap-4"
                                id="preview-dropdown"
                              >
                                <button
                                  onClick={() =>
                                    setShowPreviewDropdown(!showPreviewDropdown)
                                  }
                                  className="bg-[#6D28D2] text-white text-sm font-medium ml-16 px-4 py-1.5 rounded hover:bg-[#7D28D2] flex items-center"
                                  type="button"
                                >
                                  Preview{" "}
                                  <ChevronDown className="ml-1 w-4 h-4" />
                                </button>

                                {/* Dropdown menu - using absolute positioning */}
                                {showPreviewDropdown && (
                                  <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <ul>
                                      <li>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation(); // Stop propagation to prevent interference
                                            handlePreviewSelection(
                                              "instructor"
                                            );
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          type="button"
                                        >
                                          As Instructor
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation(); // Stop propagation to prevent interference
                                            handlePreviewSelection("student");
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          type="button"
                                        >
                                          As Student
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Replace with Video link */}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Description button - ONLY show if there's no description */}
                    {!lecture.description && !isDescriptionSectionActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (toggleDescriptionEditor) {
                            toggleDescriptionEditor(
                              sectionId,
                              lecture.id,
                              lecture.description || ""
                            );
                          }
                        }}
                        className="flex items-center gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50"
                        disabled={isLoading}
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
                        className={`flex items-center ${
                          !lecture.description ? "mt-2" : ""
                        } gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50`}
                        disabled={isLoading}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-bold">Resources</span>
                      </button>
                    )}

                    {/* Any additional content */}
                    {children}
                  </div>
                )}
            </div>
          )}
          {showVideoPreview && <VideoPreviewPage />}
        </>
      )}
    </div>
  );
}
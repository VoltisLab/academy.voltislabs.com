// import React, { useRef, useEffect, useState } from "react";
// import {
//   ContentItemType,
//   ContentType,
//   ResourceTabType,
//   ArticleContent,
//   TabInterface,
//   VideoSlideContent,
//   VideoContent,
//   StoredVideo,
//   Lecture,
//   EnhancedLecture,
//   ContentTypeDetector,
//   ExternalResourceItem,
//   SourceCodeFile,
//   SelectedVideoDetails,
//   LibraryFileWithSize,
// } from "@/lib/types";
// import {
//   Plus,
//   Trash2,
//   Edit3,
//   ChevronDown,
//   ChevronUp,
//   X,
//   FileText,
//   AlignJustify,
// } from "lucide-react";
// import AddResourceComponent from "./components/AddResourceComponent";
// import DescriptionEditorComponent from "./components/DescriptionEditorComponent";
// import "react-quill-new/dist/quill.snow.css";
// import { ContentSelector } from "./components/ContentSelector";
// import VideoSlideMashupComponent from "./components/VideoAndSlideMashup";
// import Article from "./components/Article";
// import { FaCircleCheck } from "react-icons/fa6";
// import toast from "react-hot-toast";
// import { FileUploadFunction } from "../../CourseSectionBuilder";
// import { uploadFile } from "@/services/fileUploadService";
// import VideoContentManager from "./components/VideoContentManager";
// import LectureContentDisplay from "./components/LectureContentDisplay";
// import { DeleteItemFn } from "../section/SectionItem";
// import { CourseSectionLecture } from "@/api/course/section/queries";
// import { BsTrash2Fill } from "react-icons/bs";

// // Updated LectureItemProps interface with async functions
// interface UpdatedLectureItemProps {
//   lecture: CourseSectionLecture;
//   lectureIndex: number;
//   totalLectures: number;
//   sectionId: string;
//   editingLectureId: string | null;
//   setEditingLectureId: (id: string | null) => void;
//   updateLectureName: (
//     sectionId: string,
//     lectureId: string,
//     newName: string
//   ) => Promise<void>;
//   deleteLecture: DeleteItemFn;
//   moveLecture: (
//     sectionId: string,
//     lectureId: string,
//     direction: "up" | "down"
//   ) => void;
//   updateLectureContent?: (
//     sectionId: string,
//     lectureId: string,
//     updatedLecture: EnhancedLecture
//   ) => void;
//   toggleContentSection?: (sectionId: string, lectureId: string) => void;
//   toggleAddResourceModal?: (sectionId: string, lectureId: string) => void;
//   toggleDescriptionEditor?: (
//     sectionId: string,
//     lectureId: string,
//     currentText: string
//   ) => void;
//   activeContentSection?: { sectionId: string; lectureId: string } | null;
//   activeResourceSection?: { sectionId: string; lectureId: string } | null;
//   activeDescriptionSection?: { sectionId: string; lectureId: string } | null;
//   isDragging: boolean;
//   handleDragStart: (
//     e: React.DragEvent,
//     sectionId: string,
//     lectureId?: string
//   ) => void;
//   handleDragOver: (e: React.DragEvent) => void;
//   handleDrop: (
//     e: React.DragEvent,
//     targetSectionId: string,
//     targetLectureId?: string
//   ) => void;
//   handleDragEnd?: () => void;
//   handleDragLeave?: () => void;
//   draggedLecture?: string | null;
//   dragTarget?: { sectionId: string | null; lectureId: string | null };
//   sections?: any[];
//   updateCurrentDescription?: (description: string) => void;
//   saveDescription?: () => Promise<void>;
//   currentDescription?: string;
//   children?: React.ReactNode;
//   allSections: any[];
//   globalUploadedFiles?: Array<{
//     name: string;
//     size: string;
//     lectureId: string;
//   }>;
//   globalSourceCodeFiles?: SourceCodeFile[];
//   globalExternalResources?: ExternalResourceItem[];
//   addUploadedFile?: (file: {
//     name: string;
//     size: string;
//     lectureId: string;
//   }) => void;
//   removeUploadedFile?: (fileName: string, lectureId: string) => void;
//   addSourceCodeFile?: (file: SourceCodeFile) => void;
//   removeSourceCodeFile?: (
//     fileName: string | undefined,
//     lectureId: string
//   ) => void;
//   addExternalResource?: (resource: ExternalResourceItem) => void;
//   removeExternalResource?: (title: string, lectureId: string) => void;
//   uploadVideoToBackend?: (
//     sectionId: string,
//     lectureId: string,
//     videoFile: File,
//     onProgress?: (progress: number) => void
//   ) => Promise<string | null>;
//   saveArticleToBackend?: (
//     sectionId: string,
//     lectureId: string,
//     articleContent: string
//   ) => Promise<string>;
//   videoUploading?: boolean;
//   videoUploadProgres?: number;
//   uploadFileToBackend?: FileUploadFunction;
//   courseId?: number;
// }

// export default function LectureItem(props: UpdatedLectureItemProps) {
//   const {
//     lecture,
//     lectureIndex,
//     sectionId,
//     editingLectureId,
//     setEditingLectureId,
//     updateLectureName,
//     deleteLecture,
//     toggleContentSection,
//     toggleAddResourceModal,
//     toggleDescriptionEditor,
//     activeContentSection,
//     activeResourceSection,
//     activeDescriptionSection,
//     isDragging,
//     handleDragStart,
//     handleDragOver,
//     handleDrop,
//     handleDragEnd,
//     handleDragLeave,
//     draggedLecture,
//     dragTarget,
//     sections = [],
//     updateCurrentDescription,
//     saveDescription,
//     currentDescription = "",
//     children,
//     allSections,
//     updateLectureContent,
//     globalUploadedFiles = [],
//     globalSourceCodeFiles = [],
//     globalExternalResources = [],
//     addUploadedFile,
//     removeUploadedFile,
//     addSourceCodeFile,
//     removeSourceCodeFile,
//     addExternalResource,
//     removeExternalResource,
//     uploadVideoToBackend,
//     saveArticleToBackend,
//     videoUploading = false,
//     videoUploadProgres = 0,
//     uploadFileToBackend,
//     courseId,
//   } = props;

//   const lectureNameInputRef = useRef<HTMLInputElement>(null);
//   const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const [content, setContent] = useState("");
//   const [htmlMode, setHtmlMode] = useState(false);
//   const [isVideoUploading, setIsVideoUploading] = useState(false);
//   const [videoUploadProgress, setVideoUploadProgress] =
//     useState(videoUploadProgres);
//   const [videoUploadComplete, setVideoUploadComplete] = useState(false);
//   const [showEditLectureForm, setShowEditLectureForm] =
//     useState<boolean>(false);
//   const [editLectureTitle, setEditLectureTitle] = useState<string>("");
//   const [editLoading, setEditLoading] = useState<boolean>(false);
//   const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
//   const lectureFormRef = useRef<HTMLDivElement>(null);
//   const [activeContentType, setActiveContentType] =
//     useState<ContentItemType | null>(null);
//   const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(
//     ResourceTabType.DOWNLOADABLE_FILE
//   );
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   // Add state for uploadedVideoUrl
//   const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

//   // Content state
//   const [videoContent, setVideoContent] = useState<VideoContent>({
//     uploadTab: { selectedFile: null },
//     libraryTab: {
//       searchQuery: "",
//       selectedVideo: null,
//       videos: [
//         {
//           id: "1",
//           filename: "Netflix.mp4",
//           type: "Video",
//           status: "Success",
//           date: "05/08/2025",
//           url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         },
//         {
//           id: "2",
//           filename: "Netflix.mp4",
//           type: "Video",
//           status: "Success",
//           date: "05/08/2025",
//           url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//         },
//         {
//           id: "3",
//           filename: "2025-05-01-025523.webm",
//           type: "Video",
//           status: "Success",
//           date: "05/08/2025",
//           url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//         },
//         {
//           id: "4",
//           filename: "Netflix.mp4",
//           type: "Video",
//           status: "Success",
//           date: "05/07/2025",
//           url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//         },
//         {
//           id: "5",
//           filename: "Netflix.mp4",
//           type: "Video",
//           status: "Success",
//           date: "05/07/2025",
//           url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//         },
//       ],
//     },
//     activeTab: "uploadVideo",
//     selectedVideoDetails: null,
//   });

//   const [videoSlideContent, setVideoSlideContent] = useState<VideoSlideContent>(
//     {
//       video: { selectedFile: null },
//       presentation: { selectedFile: null },
//       step: 1,
//     }
//   );

//   const [articleContent, setArticleContent] = useState<ArticleContent>({
//     text: "",
//   });

//   // Filtered resources for current lecture
//   const currentLectureUploadedFiles = globalUploadedFiles.filter(
//     (file) => file.lectureId === lecture.id
//   );
//   const currentLectureSourceCodeFiles = globalSourceCodeFiles.filter(
//     (file) => file.lectureId === lecture.id
//   );
//   const currentLectureExternalResources = globalExternalResources.filter(
//     (resource) => resource.lectureId === lecture.id
//   );

//   // Initialize edit form when opened
//   useEffect(() => {
//     if (showEditLectureForm) {
//       setEditLectureTitle(lecture?.title || "");
//     }
//   }, [showEditLectureForm, lecture?.title]);

//   // File upload function
//   const handleFileUpload: FileUploadFunction = async (
//     file: File,
//     fileType: "VIDEO" | "RESOURCE"
//   ) => {
//     if (uploadFileToBackend) {
//       return await uploadFileToBackend(file, fileType);
//     } else {
//       try {
//         const uploadedUrl = await uploadFile(file, fileType);
//         return uploadedUrl;
//       } catch (error) {
//         console.error("File upload failed:", error);
//         throw error;
//       }
//     }
//   };

//   // Handle save article
//   const handleSaveArticle = async (articleContent: string) => {
//     try {
//       if (saveArticleToBackend) {
//         await saveArticleToBackend(sectionId, lecture.id, articleContent);
//       }

//       setArticleContent({ text: articleContent });

//       if (videoContent.selectedVideoDetails) {
//         setVideoContent({
//           ...videoContent,
//           selectedVideoDetails: null,
//         });
//       }

//       if (updateLectureContent) {
//         const enhancedLecture = createEnhancedLectureForPreview();
//         const updatedLecture = ContentTypeDetector.updateLectureContentType(
//           enhancedLecture,
//           "article",
//           { text: articleContent }
//         );
//         updateLectureContent(sectionId, lecture.id, updatedLecture);
//       }

//       setActiveContentType(null);

//       if (
//         toggleContentSection &&
//         (!activeContentSection ||
//           activeContentSection.sectionId !== sectionId ||
//           activeContentSection.lectureId !== lecture.id)
//       ) {
//         toggleContentSection(sectionId, lecture.id);
//       }
//     } catch (error) {
//       console.error("Failed to save article to backend:", error);
//       toast.error("Failed to save article. Please try again.");
//     }
//   };

//   // Create enhanced lecture for preview
//   const createEnhancedLectureForPreview = (): EnhancedLecture => {
//     const hasRealVideoContent = !!(
//       videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url
//     );
//     const hasRealArticleContent = !!(
//       articleContent &&
//       articleContent.text &&
//       articleContent.text.trim() !== ""
//     );

//     const enhancedLecture: any = {
//       ...lecture,
//       hasVideoContent: hasRealVideoContent,
//       hasArticleContent: hasRealArticleContent,
//       articleContent: hasRealArticleContent ? articleContent : undefined,
//       videoDetails:
//         hasRealVideoContent && videoContent.selectedVideoDetails
//           ? videoContent.selectedVideoDetails
//           : undefined,
//       contentMetadata: {
//         createdAt: new Date(),
//         lastModified: new Date(),
//         ...(hasRealArticleContent && {
//           articleWordCount: articleContent.text.split(/\s+/).length,
//         }),
//         ...(hasRealVideoContent &&
//           videoContent.selectedVideoDetails?.duration && {
//             videoDuration: videoContent.selectedVideoDetails.duration,
//           }),
//       },
//     };

//     let detectedType:
//       | "article"
//       | "video"
//       | "quiz"
//       | "coding-exercise"
//       | "assignment";

//     if (hasRealArticleContent && !hasRealVideoContent) {
//       detectedType = "article";
//     } else if (hasRealVideoContent && !hasRealArticleContent) {
//       detectedType = "video";
//     } else if (hasRealArticleContent && hasRealVideoContent) {
//       console.warn(
//         "⚠️ Both article and video content exist - this is unexpected"
//       );
//       detectedType = "article";
//     } else {
//       detectedType =
//         (lecture?.title as
//           | "article"
//           | "video"
//           | "quiz"
//           | "coding-exercise"
//           | "assignment") || "video";
//     }

//     enhancedLecture.actualContentType = detectedType;
//     enhancedLecture.contentType = detectedType;

//     return enhancedLecture;
//   };

//   // Select video handler
//   const selectVideo = (videoId: string) => {
//     const selectedVideo = videoContent.libraryTab.videos.find(
//       (v) => v.id === videoId
//     );

//     if (selectedVideo) {
//       const selectedDetails: SelectedVideoDetails = {
//         id: selectedVideo.id,
//         filename: selectedVideo.filename,
//         duration: selectedVideo.duration,
//         thumbnailUrl:
//           "https://via.placeholder.com/160x120/000000/FFFFFF/?text=Netflix",
//         isDownloadable: false,
//         url: selectedVideo.url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//       };

//       setVideoContent({
//         ...videoContent,
//         libraryTab: {
//           ...videoContent.libraryTab,
//           selectedVideo: videoId,
//         },
//         selectedVideoDetails: selectedDetails,
//       });

//       setArticleContent({ text: "" });

//       if (updateLectureContent) {
//         const enhancedLecture = createEnhancedLectureForPreview();
//         const updatedLecture = ContentTypeDetector.updateLectureContentType(
//           enhancedLecture,
//           "video",
//           selectedDetails
//         );
//         updateLectureContent(sectionId, lecture.id, updatedLecture);
//       }

//       setActiveContentType(null);

//       if (
//         toggleContentSection &&
//         (!activeContentSection ||
//           activeContentSection.sectionId !== sectionId ||
//           activeContentSection.lectureId !== lecture.id)
//       ) {
//         toggleContentSection(sectionId, lecture.id);
//       }
//     }
//   };

//   // Delete video handler
//   const deleteVideo = (videoId: string) => {
//     setVideoContent({
//       ...videoContent,
//       libraryTab: {
//         ...videoContent.libraryTab,
//         videos: videoContent.libraryTab.videos.filter(
//           (video) => video.id !== videoId
//         ),
//         selectedVideo:
//           videoContent.libraryTab.selectedVideo === videoId
//             ? null
//             : videoContent.libraryTab.selectedVideo,
//       },
//     });
//   };

//   // Handle edit lecture
//   const handleEditLecture = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowEditLectureForm(true);
//   };

//   // Save lecture edit
//   const handleSaveLectureEdit = async () => {
//     if (editLectureTitle.trim()) {
//       try {
//         setEditLoading(true);
//         await updateLectureName(sectionId, lecture.id, editLectureTitle.trim());
//         setShowEditLectureForm(false);
//       } catch (error) {
//         console.error("Failed to save lecture edit:", error);
//       } finally {
//         setEditLoading(false);
//       }
//     }
//   };

//   // Cancel lecture edit
//   const handleCancelLectureEdit = () => {
//     setShowEditLectureForm(false);
//   };

//   // Handle key down for edit
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && editLectureTitle.trim()) {
//       e.preventDefault();
//       handleSaveLectureEdit();
//     } else if (e.key === "Escape") {
//       handleCancelLectureEdit();
//     }
//   };

//   // Delete lecture handler
//   const handleDeleteLecture = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       setDeleteLoading(true);
//       deleteLecture("lecture", lecture.id, sectionId);
//     } catch (error) {
//       console.error("Failed to delete lecture:", error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // Toggle downloadable
//   const toggleDownloadable = () => {
//     if (videoContent.selectedVideoDetails) {
//       setVideoContent({
//         ...videoContent,
//         selectedVideoDetails: {
//           ...videoContent.selectedVideoDetails,
//           isDownloadable: !videoContent.selectedVideoDetails.isDownloadable,
//         },
//       });
//     }
//   };

//   // Handle video file upload
//   const handleVideoFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>,
//     setUploadedVideoUrl?: (url: string) => void
//   ) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       const videoUrl = URL.createObjectURL(file);

//       setVideoContent({
//         ...videoContent,
//         uploadTab: { selectedFile: file },
//       });

//       setIsVideoUploading(true);
//       setVideoUploadProgress(0);
//       setVideoUploadComplete(false);

//       try {
//         if (uploadVideoToBackend) {
//           const backendVideoUrl = await uploadVideoToBackend(
//             sectionId,
//             lecture.id,
//             file,
//             (progress) => {
//               setVideoUploadProgress(progress);
//             }
//           );

//           if (backendVideoUrl) {
//             const videoId = `${file.name.replace(/\s+/g, "")}-${Date.now()}`;

//             const existingVideo = videoContent.libraryTab.videos.find(
//               (v) => v.filename === file.name
//             );

//             if (!existingVideo) {
//               const newVideo: StoredVideo = {
//                 id: videoId,
//                 filename: file.name,
//                 type: "Video",
//                 status: "Success",
//                 date: new Date().toLocaleDateString("en-US", {
//                   month: "2-digit",
//                   day: "2-digit",
//                   year: "numeric",
//                 }),
//                 url: backendVideoUrl,
//               };

//               setVideoContent((prev) => ({
//                 ...prev,
//                 libraryTab: {
//                   ...prev.libraryTab,
//                   videos: [newVideo, ...prev.libraryTab.videos],
//                 },
//               }));
//             }

//             // Set as the selected video for preview
//             setVideoContent((prev) => ({
//               ...prev,
//               selectedVideoDetails: {
//                 id: videoId,
//                 url: backendVideoUrl,
//                 filename: file.name,
//                 thumbnailUrl: "",
//                 isDownloadable: false,
//                 duration: "00:05", // Set if you have it, or leave as empty string
//               },
//             }));

//             setVideoUploadComplete(true);
//             setIsVideoUploading(false);

//             setVideoContent((prev) => ({
//               ...prev,
//               activeTab: "addFromLibrary",
//             }));

//             // Call the callback to set the uploaded video URL for preview
//             if (setUploadedVideoUrl) {
//               setUploadedVideoUrl(backendVideoUrl);
//             }

//             toast.success("Video uploaded successfully!");
//             // After setting selectedVideoDetails, close the upload video/add from library window
//             setShowContentTypeSelector(false);
//             setActiveContentType(null);
//           }
//         } else {
//           // Fallback simulation
//           const interval = setInterval(() => {
//             setVideoUploadProgress((prev) => {
//               if (prev >= 100) {
//                 clearInterval(interval);
//                 setTimeout(() => {
//                   setIsVideoUploading(false);
//                   setVideoUploadComplete(true);

//                   const videoId = `${file.name.replace(
//                     /\s+/g,
//                     ""
//                   )}-${Date.now()}`;

//                   const existingVideo = videoContent.libraryTab.videos.find(
//                     (v) => v.filename === file.name
//                   );

//                   if (!existingVideo) {
//                     const newVideo: StoredVideo = {
//                       id: videoId,
//                       filename: file.name,
//                       type: "Video",
//                       status: "Success",
//                       date: new Date().toLocaleDateString("en-US", {
//                         month: "2-digit",
//                         day: "2-digit",
//                         year: "numeric",
//                       }),
//                       url: videoUrl,
//                     };

//                     setVideoContent((prev) => ({
//                       ...prev,
//                       libraryTab: {
//                         ...prev.libraryTab,
//                         videos: [newVideo, ...prev.libraryTab.videos],
//                       },
//                     }));
//                   }

//                   // Set as the selected video for preview
//                   setVideoContent((prev) => ({
//                     ...prev,
//                     selectedVideoDetails: {
//                       id: videoId,
//                       url: videoUrl,
//                       filename: file.name,
//                       thumbnailUrl: "",
//                       isDownloadable: false,
//                       duration: "00:05", // Set if you have it, or leave as empty string
//                     },
//                   }));

//                   setVideoContent((prev) => ({
//                     ...prev,
//                     activeTab: "addFromLibrary",
//                   }));

//                   // Call the callback to set the uploaded video URL for preview
//                   if (setUploadedVideoUrl) {
//                     setUploadedVideoUrl(videoUrl);
//                   }
//                 }, 500);
//                 return 100;
//               }
//               return prev + 5;
//             });
//           }, 200);
//         }
//       } catch (error) {
//         console.error("Video upload failed:", error);
//         setIsVideoUploading(false);
//         setVideoUploadProgress(0);
//         setVideoUploadComplete(false);
//         toast.error("Failed to upload video. Please try again.");
//       }
//     }
//   };

//   // Handle content type selection
//   const handleContentTypeSelect = (contentType: ContentItemType) => {
//     setActiveContentType(contentType);
//     setShowContentTypeSelector(false);

//     if (contentType === "video") {
//       setArticleContent({ text: "" });

//       const existingVideos = videoContent.libraryTab.videos;
//       const existingSelectedVideoDetails = videoContent.selectedVideoDetails;

//       setVideoContent({
//         uploadTab: { selectedFile: null },
//         libraryTab: {
//           searchQuery: "",
//           selectedVideo: null,
//           videos: existingVideos,
//         },
//         activeTab: "uploadVideo",
//         selectedVideoDetails: existingSelectedVideoDetails,
//       });
//     } else if (contentType === "video-slide") {
//       setArticleContent({ text: "" });
//       setVideoSlideContent({
//         video: { selectedFile: null },
//         presentation: { selectedFile: null },
//         step: 1,
//       });
//     } else if (contentType === "article") {
//       setVideoContent({
//         ...videoContent,
//         selectedVideoDetails: null,
//       });
//       setArticleContent({ text: "" });
//     }
//   };

//   // Handle edit content
//   const handleEditContent = () => {
//     setActiveContentType("video");
//     setShowContentTypeSelector(false);

//     setVideoContent({
//       ...videoContent,
//       activeTab: "addFromLibrary",
//       selectedVideoDetails: videoContent.selectedVideoDetails,
//     });

//     if (
//       activeContentSection &&
//       activeContentSection.sectionId === sectionId &&
//       activeContentSection.lectureId === lecture.id
//     ) {
//       console.log(
//         "Section already expanded, just updating content type and tab"
//       );
//     } else if (toggleContentSection) {
//       toggleContentSection(sectionId, lecture.id);
//     }
//   };

//   // Resource handlers
//   const handleSourceCodeSelect = (file: LibraryFileWithSize) => {
//     if (addSourceCodeFile) {
//       addSourceCodeFile({
//         name: file.filename,
//         type: "SourceCode",
//         lectureId: lecture.id,
//         filename: file.filename,
//       });
//     }

//     if (toggleAddResourceModal) {
//       toggleAddResourceModal(sectionId, lecture.id);
//     }
//   };

//   const handleExternalResourceAdd = (
//     title: string,
//     url: string,
//     name: string
//   ) => {
//     if (addExternalResource) {
//       addExternalResource({
//         title: title,
//         url: url,
//         name: name,
//         lectureId: lecture.id,
//       });
//     }

//     if (toggleAddResourceModal) {
//       toggleAddResourceModal(sectionId, lecture.id);
//     }
//   };

//   const handleLibraryItemSelect = (item: LibraryFileWithSize) => {
//     if (addUploadedFile) {
//       addUploadedFile({
//         name: item.filename,
//         size: item.size || (item.type === "Video" ? "01:45" : "1.2 MB"),
//         lectureId: lecture.id,
//       });
//     }

//     if (toggleAddResourceModal) {
//       toggleAddResourceModal(sectionId, lecture.id);
//     }
//   };

//   // Trigger file upload simulation
//   const triggerFileUpload = (contentType: ContentType) => {
//     setIsUploading(true);
//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setTimeout(() => {
//             setIsUploading(false);
//             setUploadProgress(0);

//             const filename =
//               contentType === ContentType.VIDEO
//                 ? "2025-05-01-025523.webm"
//                 : "course_materials.pdf";

//             if (addUploadedFile) {
//               addUploadedFile({
//                 name: filename,
//                 size: contentType === ContentType.VIDEO ? "263.5 kB" : "1.2 MB",
//                 lectureId: lecture.id,
//               });
//             }
//           }, 500);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);
//   };

//   // Cleanup function
//   useEffect(() => {
//     return () => {
//       videoContent.libraryTab.videos.forEach((video) => {
//         if (video.url && video.url.startsWith("blob:")) {
//           URL.revokeObjectURL(video.url);
//         }
//       });

//       if (
//         videoContent.selectedVideoDetails?.url &&
//         videoContent.selectedVideoDetails.url.startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(videoContent.selectedVideoDetails.url);
//       }
//     };
//   }, []);

//   // Focus on lecture name input when editing
//   useEffect(() => {
//     if (editingLectureId === lecture.id && lectureNameInputRef.current) {
//       lectureNameInputRef.current.focus();
//     }
//   }, [editingLectureId, lecture.id]);

//   // Reset content type when section is collapsed
//   useEffect(() => {
//     const isExpanded =
//       activeContentSection?.sectionId === sectionId &&
//       activeContentSection?.lectureId === lecture.id;

//     if (!isExpanded) {
//       setActiveContentType(null);
//       setShowContentTypeSelector(false);
//     }
//   }, [activeContentSection, sectionId, lecture.id]);

//   // Determine lecture type label
//   const getLectureTypeLabel = (): string => {
//     const enhancedLecture = createEnhancedLectureForPreview();

//     let detectedType: string;
//     if (
//       ContentTypeDetector &&
//       typeof ContentTypeDetector.detectLectureContentType === "function"
//     ) {
//       detectedType =
//         ContentTypeDetector.detectLectureContentType(enhancedLecture);
//     } else {
//       detectedType = enhancedLecture.actualContentType || "video";
//     }

//     switch (detectedType) {
//       case "video":
//         return "Lecture";
//       case "article":
//         return "Article";
//       case "quiz":
//         return "Quiz";
//       case "coding-exercise":
//         return "Coding Exercise";
//       case "assignment":
//         return "Assignment";
//       default:
//         return "Lecture";
//     }
//   };

//   // Check if lecture has existing content
//   const hasExistingContent = (lecture: CourseSectionLecture): boolean => {
//     return Boolean(
//       (lecture.videoUrl && lecture.videoUrl.length > 0) ||
//         lecture.title === "article" ||
//         videoContent.selectedVideoDetails !== null ||
//         (articleContent.text && articleContent.text.trim() !== "")
//     );
//   };

//   // State flags
//   const isExpanded =
//     activeContentSection?.sectionId === sectionId &&
//     activeContentSection?.lectureId === lecture.id;

//   const isResourceSectionActive =
//     activeResourceSection?.sectionId === sectionId &&
//     activeResourceSection?.lectureId === lecture.id;

//   const isDescriptionSectionActive =
//     activeDescriptionSection?.sectionId === sectionId &&
//     activeDescriptionSection?.lectureId === lecture.id;

//   const isLoading = editLoading || deleteLoading;
//   const maxLength = 80;

//   // Render content based on activeContentType
//   const renderContent = () => {
//     if (!activeContentType) return null;

//     switch (activeContentType) {
//       case "video":
//         return (
//           <VideoContentManager
//             videoContent={videoContent}
//             setVideoContent={setVideoContent}
//             isVideoUploading={isVideoUploading}
//             videoUploadProgress={videoUploadProgress}
//             videoUploadComplete={videoUploadComplete}
//             setVideoUploadComplete={setVideoUploadComplete}
//             onVideoFileUpload={(e) =>
//               handleVideoFileUpload(e, setUploadedVideoUrl)
//             }
//             onVideoSelect={selectVideo}
//             onDeleteVideo={deleteVideo}
//             videoUploading={videoUploading}
//             onClose={() => {
//               setActiveContentType(null);
//               if (toggleContentSection) {
//                 toggleContentSection(sectionId, lecture.id);
//               }
//             }}
//             uploadedVideoUrl={uploadedVideoUrl}
//             setUploadedVideoUrl={setUploadedVideoUrl}
//           />
//         );
//       case "video-slide":
//         return (
//           <VideoSlideMashupComponent
//             sectionId={sectionId}
//             lectureId={lecture.id}
//             uploadVideoToBackend={uploadVideoToBackend}
//             uploadFileToBackend={handleFileUpload}
//           />
//         );
//       case "article":
//         return (
//           <Article
//             content={content}
//             setContent={setContent}
//             setHtmlMode={setHtmlMode}
//             htmlMode={htmlMode}
//             onSave={handleSaveArticle}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   useEffect(() => {
//     if (lecture.videoUrl) {
//       setVideoContent((prev) => ({
//         ...prev,
//         selectedVideoDetails: {
//           id: lecture.id,
//           url: lecture.videoUrl,
//           filename: lecture.title || "Lecture Video",
//           thumbnailUrl: "", // Set if you have it
//           isDownloadable: false,
//           duration: lecture.duration ? String(lecture.duration) : "", // Always a string
//         },
//       }));
//     }
//   }, [lecture.videoUrl, lecture.id, lecture.title, lecture.duration]);

//   return (
//     <div
//       className={`mb-3 bg-white border border-gray-400 ${
//         isExpanded && "border-b border-gray-500 "
//       }${draggedLecture === lecture.id ? "opacity-50" : ""} ${
//         dragTarget?.lectureId === lecture.id ? "border-2 border-indigo-500" : ""
//       }`}
//       draggable={true}
//       onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
//       onDragEnd={handleDragEnd}
//       onDragOver={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         handleDragOver(e);
//       }}
//       onDragLeave={handleDragLeave}
//       onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {showEditLectureForm ? (
//         <div
//           className="flex items-center justify-center"
//           onClick={() => setShowEditLectureForm(false)}
//         >
//           <div
//             ref={lectureFormRef}
//             className="bg-white p-6 rounded-lg w-full max-w-4xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center mb-4">
//               <FaCircleCheck
//                 color="black"
//                 size={14}
//                 className="shrink-0 text-white mr-2"
//               />
//               <div className="text-sm font-medium">
//                 Lecture {lectureIndex + 1}:
//               </div>
//               <div className="flex-1 ml-2">
//                 <input
//                   type="text"
//                   value={editLectureTitle}
//                   onChange={(e) => setEditLectureTitle(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 px-2 py-1 rounded-md"
//                   autoFocus
//                   maxLength={80}
//                   disabled={isLoading}
//                 />
//                 <div className="text-right text-sm text-gray-500 mt-1">
//                   {maxLength - editLectureTitle.length}
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 space-x-2">
//               <button
//                 onClick={handleCancelLectureEdit}
//                 className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveLectureEdit}
//                 disabled={!editLectureTitle.trim() || isLoading}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
//               >
//                 {editLoading ? "Saving..." : "Save Lecture"}
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Lecture Header */}
//           <div
//             className={`flex items-center ${
//               isExpanded && "border-b border-gray-500 "
//             } px-3 py-2 `}
//           >
//             <div className="flex-1 flex items-center">
//               <FaCircleCheck
//                 color="black"
//                 size={14}
//                 className="shrink-0 text-white mr-2"
//               />
//               {editingLectureId === lecture.id ? (
//                 <input
//                   ref={lectureNameInputRef}
//                   type="text"
//                   value={lecture.title}
//                   onChange={(e) =>
//                     updateLectureName(sectionId, lecture.id, e.target.value)
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       setEditingLectureId(null);
//                     }
//                   }}
//                   className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               ) : (
//                 <div className="text-sm sm:text-base text-gray-800 truncate max-w-full whitespace-nowrap overflow-hidden flex items-center">
//                   {getLectureTypeLabel()} {lectureIndex + 1}:{" "}
//                   <FileText
//                     size={15}
//                     className="ml-2 inline-block flex-shrink-0"
//                   />
//                   <span className="truncate overflow-hidden ml-1">
//                     {lecture.title}
//                   </span>
//                   {isHovering && !isLoading && (
//                     <div>
//                       <button
//                         onClick={handleEditLecture}
//                         className="p-1 text-gray-400 hover:text-gray-600"
//                         aria-label="Edit"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={handleDeleteLecture}
//                         className="p-1 text-gray-400 hover:text-red-600"
//                         aria-label="Delete"
//                         disabled={deleteLoading}
//                       >
//                         <Trash2
//                           className={`w-4 h-4 text-gray-400 hover:text-red-500  rounded ${
//                             deleteLoading ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                         />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center">
//               {!hasExistingContent(lecture) && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     if (!isResourceSectionActive && toggleContentSection) {
//                       toggleContentSection(sectionId, lecture.id);
//                       if (!isExpanded) {
//                         setShowContentTypeSelector(true);
//                       } else {
//                         setShowContentTypeSelector(false);
//                         setActiveContentType(null);
//                       }
//                     }
//                   }}
//                   className={`${
//                     (showContentTypeSelector && isExpanded) ||
//                     isResourceSectionActive ||
//                     activeContentType
//                       ? "text-gray-800 font-normal border-b-0 border-l border-t border-r border-gray-400 -mb-[12px] bg-white pb-2"
//                       : "text-[#6D28D2] font-medium border-[#6D28D2] hover:bg-indigo-50 rounded "
//                   } text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center ml-1 sm:ml-2 border`}
//                   disabled={isLoading}
//                 >
//                   {isResourceSectionActive ? (
//                     <>
//                       <span className="font-bold">Add Resource</span>
//                       <X
//                         className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (toggleAddResourceModal) {
//                             toggleAddResourceModal(sectionId, lecture.id);
//                           }
//                         }}
//                       />
//                     </>
//                   ) : activeContentType === "video" ? (
//                     <>
//                       <span className="font-bold">Add Video</span>
//                       <X
//                         className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActiveContentType(null);
//                           if (toggleContentSection) {
//                             toggleContentSection(sectionId, lecture.id);
//                           }
//                         }}
//                       />
//                     </>
//                   ) : activeContentType === "video-slide" ? (
//                     <>
//                       <span className="font-bold">
//                         Add Video & Slide Mashup
//                       </span>
//                       <X
//                         className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActiveContentType(null);
//                           if (toggleContentSection) {
//                             toggleContentSection(sectionId, lecture.id);
//                           }
//                         }}
//                       />
//                     </>
//                   ) : activeContentType === "article" ? (
//                     <>
//                       <span className="font-bold">Add Article</span>
//                       <X
//                         className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setActiveContentType(null);
//                           if (toggleContentSection) {
//                             toggleContentSection(sectionId, lecture.id);
//                           }
//                         }}
//                       />
//                     </>
//                   ) : showContentTypeSelector && isExpanded ? (
//                     <>
//                       <span className="font-bold">Select content type</span>
//                       <X
//                         className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setShowContentTypeSelector(false);
//                           if (toggleContentSection) {
//                             toggleContentSection(sectionId, lecture.id);
//                           }
//                         }}
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
//                       <span className="font-bold bg-red-500">Content</span>
//                     </>
//                   )}
//                 </button>
//               )}

//               <button
//                 className="p-1 text-gray-400 hover:text-gray-600 ml-1"
//                 onClick={(e) => {
//                   e.stopPropagation();

//                   if (toggleContentSection) {
//                     toggleContentSection(sectionId, lecture.id);

//                     if (isExpanded) {
//                       setShowContentTypeSelector(false);
//                       setActiveContentType(null);
//                     }
//                   }
//                 }}
//                 aria-label={isExpanded ? "Collapse" : "Expand"}
//                 disabled={isLoading}
//               >
//                 {isExpanded ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>
//               {isHovering && !isLoading && (
//                 <div>
//                   <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Expanded Content Area */}
//           {(isExpanded ||
//             isResourceSectionActive ||
//             isDescriptionSectionActive) && (
//             <div>
//               {/* Resource Component */}

//               {/* Resource Component */}
//               {isResourceSectionActive && (
//                 <AddResourceComponent
//                   activeContentSection={activeResourceSection}
//                   onClose={() => {
//                     if (toggleAddResourceModal) {
//                       toggleAddResourceModal(sectionId, lecture.id);
//                     }
//                   }}
//                   activeResourceTab={activeResourceTab}
//                   setActiveResourceTab={setActiveResourceTab}
//                   sections={sections}
//                   isUploading={isUploading}
//                   uploadProgress={uploadProgress}
//                   triggerFileUpload={triggerFileUpload}
//                   onLibraryItemSelect={handleLibraryItemSelect}
//                   onSourceCodeSelect={handleSourceCodeSelect}
//                   onExternalResourceAdd={handleExternalResourceAdd}
//                   // NEW: Add these required props
//                   lectureId={lecture.id}
//                   sectionId={sectionId}
//                 />
//               )}

//               {/* Description Component */}
//               {isDescriptionSectionActive &&
//                 updateCurrentDescription &&
//                 saveDescription && (
//                   <DescriptionEditorComponent
//                     activeDescriptionSection={activeDescriptionSection}
//                     onClose={() => {
//                       if (toggleDescriptionEditor) {
//                         toggleDescriptionEditor(
//                           sectionId,
//                           lecture.id,
//                           currentDescription
//                         );
//                       }
//                     }}
//                     currentDescription={currentDescription || ""}
//                     setCurrentDescription={updateCurrentDescription}
//                     saveDescription={saveDescription}
//                   />
//                 )}

//               {/* Content Type Selector */}
//               {showContentTypeSelector &&
//                 !activeContentType &&
//                 !isResourceSectionActive &&
//                 !isDescriptionSectionActive && (
//                   <ContentSelector
//                     handleContentTypeSelect={handleContentTypeSelect}
//                   />
//                 )}

//               {/* Content Renderer */}
//               {activeContentType && renderContent()}

//               {/* Content Display */}
//               {!showContentTypeSelector &&
//                 !activeContentType &&
//                 !isResourceSectionActive &&
//                 !isDescriptionSectionActive && (
//                   <LectureContentDisplay
//                     lecture={lecture}
//                     sectionId={sectionId}
//                     videoContent={videoContent}
//                     articleContent={articleContent}
//                     isExpanded={isExpanded}
//                     isResourceSectionActive={isResourceSectionActive}
//                     isDescriptionSectionActive={isDescriptionSectionActive}
//                     onEditContent={handleEditContent}
//                     onToggleDownloadable={toggleDownloadable}
//                     onToggleDescriptionEditor={toggleDescriptionEditor}
//                     onToggleAddResourceModal={toggleAddResourceModal}
//                     onSetActiveContentType={setActiveContentType}
//                     onToggleContentSection={toggleContentSection}
//                     currentLectureUploadedFiles={currentLectureUploadedFiles}
//                     currentLectureSourceCodeFiles={
//                       currentLectureSourceCodeFiles
//                     }
//                     currentLectureExternalResources={
//                       currentLectureExternalResources
//                     }
//                     removeUploadedFile={removeUploadedFile}
//                     removeSourceCodeFile={removeSourceCodeFile}
//                     removeExternalResource={removeExternalResource}
//                     globalUploadedFiles={globalUploadedFiles}
//                     globalSourceCodeFiles={globalSourceCodeFiles}
//                     globalExternalResources={globalExternalResources}
//                     allSections={allSections}
//                     children={children}
//                     courseId={courseId}
//                   />
//                 )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// import React, { useRef, useEffect, useState } from "react";
// import {
//   Trash2,
//   Edit3,
//   ChevronDown,
//   ChevronUp,
//   Move,
//   Plus,
//   AlignJustify,
//   FileText,
// } from "lucide-react";
// import {
//   Lecture,
//   ContentItemType,
//   ExtendedLecture,
//   EnhancedLecture,
//   SourceCodeFile,
//   ExternalResourceItem,
//   ContentType,
// } from "@/lib/types";
// // Import the components
// import { ActionButtons } from "./ActionButtons";
// import LectureItem from "../lecture/LectureItem";
// import AssignmentItem from "../assignment/AssignmentItem";
// import AssignmentForm from "../assignment/AssignmentForm";
// import { apolloClient } from "@/lib/apollo-client";
// import QuizForm from "../quiz/QuizForm";
// import QuizItem from "../quiz/QuizItem";
// import CodingExerciseForm from "../code/CodingExcerciseForm";
// import CodingExerciseItem from "../code/CodingExcerciseItem";
// import PracticeItem from "../practice/PracticeItem";
// import PracticeForm from "../practice/PracticeForm";
// import { FaHamburger } from "react-icons/fa";
// import { useSections } from "@/hooks/useSection";
// import { FileUploadFunction } from "../../CourseSectionBuilder";
// import { CREATE_ASSIGNMENT } from "@/api/assignment/mutation";
// import { useAssignmentService } from "@/services/useAssignmentService";
// import { useQuizOperations } from "@/services/quizService";
// import {
//   CourseSection,
//   CourseSectionAssignnments,
//   CourseSectionLecture,
//   CourseSectionQuiz,
// } from "@/api/course/section/queries";

// export type DeleteItemFn = (
//   type: "section" | "lecture",
//   id: string,
//   sectionId?: string
// ) => void;

// // Updated SectionItemProps interface with the missing property
// interface SectionItemProps {
//   fetchSectionData?: any;
//   setNewassignment?: React.Dispatch<React.SetStateAction<number | undefined>>;
//   setNewQuizId?: React.Dispatch<React.SetStateAction<number | undefined>>;
//   newQuizId?: number;
//   section: CourseSection;
//   index: number;
//   totalSections: number;
//   editingSectionId: string | null;
//   setEditingSectionId: (id: string | null) => void;
//   editingLectureId: string | null;
//   setEditingLectureId: (id: string | null) => void;
//   updateSectionName: (
//     sectionId: string,
//     newName: string,
//     objective?: string
//   ) => Promise<void>;
//   updateLectureName: (
//     sectionId: string,
//     lectureId: string,
//     newName: string
//   ) => Promise<void>;
//   deleteSection: DeleteItemFn;
//   deleteLecture: DeleteItemFn;
//   deleteAssignment: (sectionId: string, lectureId: string) => Promise<void>;
//   moveSection: (sectionId: string, direction: "up" | "down") => void;
//   moveLecture: (
//     sectionId: string,
//     lectureId: string,
//     direction: "up" | "down"
//   ) => void;
//   toggleSectionExpansion: (sectionId: string) => void;
//   toggleContentSection: (sectionId: string, lectureId: string) => void;
//   toggleAddResourceModal: (sectionId: string, lectureId: string) => void;
//   toggleDescriptionEditor: (
//     sectionId: string,
//     lectureId: string,
//     currentText: string
//   ) => void;
//   saveDescription?: (
//     sectionId: string,
//     lectureId: number,
//     description: string
//   ) => Promise<void>;
//   activeContentSection: { sectionId: string; lectureId: string } | null;
//   isDragging: boolean;
//   handleDragStart: (
//     e: React.DragEvent,
//     sectionId: string,
//     lectureId?: string
//   ) => void;
//   handleDragEnd?: () => void;
//   handleDragOver: (e: React.DragEvent) => void;
//   handleDragLeave?: () => void;
//   handleDrop: (
//     e: React.DragEvent,
//     targetSectionId: string,
//     targetLectureId?: string
//   ) => void;
//   addLecture: (
//     sectionId: string,
//     contentType: ContentItemType,
//     title?: string,
//     description?: string
//   ) => Promise<string>;
//   deleteLocalQuiz: (sectionId: string, quizId: string) => void;
//   addCurriculumItem: (sectionId: string) => void;
//   updateQuizQuestions?: (
//     sectionId: string,
//     quizId: number,
//     questions: any[]
//   ) => void;

//   // New prop for practice exercises
//   savePracticeCode?: (
//     sectionId: string,
//     lectureId: string,
//     code: string,
//     language: string
//   ) => void;
//   children?: React.ReactNode;
//   // Props for enhanced drag and drop
//   draggedSection?: string | null;
//   draggedLecture?: string | null;
//   dragTarget?: {
//     sectionId: string | null;
//     lectureId: string | null;
//   };
//   // Add the missing property for opening coding exercise modal
//   openCodingExerciseModal?: (sectionId: string, lectureId: string) => void;
//   onEditAssignment: (assignmentData: ExtendedLecture) => void;
//   // Add this new prop
//   allSections: Array<{
//     id: string;
//     name: string;
//     lectures: Lecture[];
//     quizzes: any[];
//     assignments: any[];
//     codingExercises: any[];
//     isExpanded: boolean;
//   }>;
//   // New props for quiz functionality
//   addQuiz?: (
//     sectionId: string,
//     title: string,
//     description?: string
//   ) => Promise<string>;

//   updateQuiz?: (
//     sectionId: string,
//     quizId: string,
//     title: string,
//     description: string
//   ) => Promise<void>;

//   // FIXED: Add global resource props
//   globalUploadedFiles?: Array<{
//     name: string;
//     size: string;
//     lectureId: string;
//   }>;
//   globalSourceCodeFiles?: SourceCodeFile[];
//   globalExternalResources?: ExternalResourceItem[];
//   addUploadedFile?: (file: {
//     name: string;
//     size: string;
//     lectureId: string;
//   }) => void;
//   removeUploadedFile?: (fileName: string, lectureId: string) => void;
//   addSourceCodeFile?: (file: SourceCodeFile) => void;
//   removeSourceCodeFile?: (
//     fileName: string | undefined,
//     lectureId: string
//   ) => void;
//   addExternalResource?: (resource: ExternalResourceItem) => void;
//   removeExternalResource?: (title: string, lectureId: string) => void;

//   // NEW: Loading state prop
//   isLoading?: boolean;

//   // NEW: Backend integration props
//   uploadVideoToBackend?: (
//     sectionId: string,
//     lectureId: string,
//     videoFile: File,
//     onProgress?: (progress: number) => void
//   ) => Promise<string | null>;
//   saveArticleToBackend?: (
//     sectionId: string,
//     lectureId: string,
//     articleContent: string
//   ) => Promise<string>;
//   videoUploading?: boolean;
//   videoUploadProgress?: number;
//   uploadFileToBackend?: FileUploadFunction;
//   courseId?: number;
// }

// export default function SectionItem({
//   fetchSectionData,
//   section,
//   setNewassignment,
//   setNewQuizId,
//   newQuizId,
//   index,
//   totalSections,
//   editingSectionId,
//   setEditingSectionId,
//   updateSectionName,
//   deleteSection,
//   moveSection,
//   toggleSectionExpansion,
//   isDragging,
//   handleDragStart,
//   handleDragEnd,
//   handleDragOver,
//   handleDragLeave,
//   handleDrop,
//   addLecture,
//   addCurriculumItem,
//   deleteLocalQuiz,
//   updateQuizQuestions,
//   savePracticeCode,
//   children,
//   draggedSection,
//   draggedLecture,
//   dragTarget,
//   saveDescription,
//   openCodingExerciseModal,
//   onEditAssignment,
//   allSections,
//   addQuiz,
//   updateQuiz,
//   editingLectureId,
//   setEditingLectureId,
//   updateLectureName,
//   deleteLecture,
//   deleteAssignment,
//   moveLecture,
//   toggleContentSection,
//   toggleAddResourceModal,
//   toggleDescriptionEditor,
//   activeContentSection,
//   // FIXED: Receive global resource props
//   globalUploadedFiles = [],
//   globalSourceCodeFiles = [],
//   globalExternalResources = [],
//   addUploadedFile,
//   removeUploadedFile,
//   addSourceCodeFile,
//   removeSourceCodeFile,
//   addExternalResource,
//   removeExternalResource,
//   // NEW: Receive loading state
//   isLoading = false,
//   uploadVideoToBackend,
//   videoUploading,
//   videoUploadProgress,
//   saveArticleToBackend,
//   uploadFileToBackend,
//   courseId,
// }: SectionItemProps) {
//   const sectionNameInputRef = useRef<HTMLInputElement>(null);
//   // State for toggling action buttons
//   const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
//   const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
//   const [showQuizForm, setShowQuizForm] = useState<boolean>(false);
//   const [isHovering, setIsHovering] = useState<boolean>(false);
//   const [showCodingExerciseForm, setShowCodingExerciseForm] =
//     useState<boolean>(false);
//   const [showPracticeForm, setShowPracticeForm] = useState<boolean>(false);
//   const [showEditForm, setShowEditForm] = useState<boolean>(false);
//   const [editTitle, setEditTitle] = useState<string>("");
//   const [editObjective, setEditObjective] = useState<string>("");

//   // Added states to track active sections for resources and descriptions
//   const [activeResourceSection, setActiveResourceSection] = useState<{
//     sectionId: string;
//     lectureId: string;
//   } | null>(null);
//   const [activeDescriptionSection, setActiveDescriptionSection] = useState<{
//     sectionId: string;
//     lectureId: string;
//   } | null>(null);
//   const [currentDescription, setCurrentDescription] = useState<string>("");

//   useEffect(() => {
//     if (editingSectionId === section.id && sectionNameInputRef.current) {
//       sectionNameInputRef.current.focus();
//     }
//   }, [editingSectionId, section.id]);

//   useEffect(() => {
//     if (showEditForm) {
//       setEditTitle(section.title);
//       setEditObjective(section.description || "");
//     }
//   }, [showEditForm, section.title, section.description]);

//   const startEditingSection = (e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     // Set initial values when opening the form
//     console.log("section===", section);
//     setEditTitle(section.title);
//     setEditObjective(section.description || "");
//     setShowEditForm(true);
//   };

//   const handleSaveEdit = async () => {
//     if (editTitle.trim()) {
//       try {
//         // Call the async update function with current values
//         await updateSectionName(section.id, editTitle, editObjective);
//         setShowEditForm(false);
//       } catch (error) {
//         console.error("Failed to save section edit:", error);
//         // Error is already handled in the service with toast
//       }
//     }
//   };

//   // Handler for curriculum button click
//   const handleCurriculumButtonClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowActionButtons((prev) => !prev); // Toggle action buttons
//     setShowAssignmentForm(false); // Hide assignment form when toggling action buttons
//     setShowQuizForm(false); // Hide quiz form when toggling action buttons
//   };

//   // Handler for adding an assignment
//   const { createAssignment } = useAssignmentService();
//   const { setSections, addLecture: addLocalLecture } = useSections([]);

//   const handleAddAssignment = async (sectionId: string, title: string) => {
//     try {
//       // Use the service method instead of apolloClient directly
//       const response = await createAssignment({
//         sectionId: Number(sectionId),
//         title,
//       });

//       if (response.createAssignment) {
//         setNewassignment?.(Number(response.createAssignment.assignment.id));
//       }

//       if (response.createAssignment.success) {
//         // await addLecture(sectionId, "assignment", title);
//         await fetchSectionData();
//         setShowAssignmentForm(false);
//         // Add to local state with backend ID
//         const backendLectureId = response.createAssignment.assignment.id;
//         const localLectureId = await addLocalLecture(
//           sectionId,
//           "assignment",
//           title
//         );

//         // Update the local lecture with the backend ID
//         setSections((prevSections) =>
//           prevSections.map((section) => {
//             if (section.id === sectionId) {
//               return {
//                 ...section,
//                 assignments: section.lectures.map((lecture) =>
//                   lecture.id === localLectureId
//                     ? { ...lecture, id: backendLectureId }
//                     : lecture
//                 ),
//               };
//             }
//             return section;
//           })
//         );

//         return backendLectureId;
//       }

//       return "";
//       // Then add the lecture
//     } catch (error) {
//       console.error("Failed to create assignment:", error);
//       // Error and toast already handled in the service
//     }
//   };

//   const { createQuiz, loading: quizOperationLoading } = useQuizOperations();
//   // Enhanced handler for adding a quiz - uses addQuiz instead of addLecture
//   const handleAddQuiz = async (
//     sectionId: string,
//     title: string,
//     description?: string
//   ) => {
//     try {
//       if (addQuiz) await addQuiz(sectionId, title, description);
//       setShowQuizForm(false);
//       await fetchSectionData();
//     } catch (error) {
//       console.error("Failed to create quiz:", error);
//     }
//   };

//   // Handler for editing a quiz
//   const handleEditQuiz = async (
//     sectionId: string,
//     quizId: string,
//     title: string,
//     description: string
//   ) => {
//     console.log("SectionItem handling quiz edit:", {
//       sectionId,
//       quizId,
//       title,
//       description,
//     });

//     if (updateQuiz) {
//       await updateQuiz(sectionId, quizId, title, description);
//     }
//   };

//   // Add handler for adding a coding exercise
//   const handleAddCodingExercise = async (sectionId: string, title: string) => {
//     try {
//       // Add the lecture with coding-exercise content type
//       await addLecture(sectionId, "coding-exercise", title);
//       setShowCodingExerciseForm(false);
//     } catch (error) {
//       console.error("Failed to add coding exercise:", error);
//       // Error is already handled in the service with toast
//     }
//   };
//   // Enhanced lecture adding handler that properly handles title
//   const handleAddLecture = async (
//     sectionId: string,
//     contentType: ContentItemType,
//     title?: string
//   ) => {
//     console.log("SectionItem handling lecture add:", {
//       sectionId,
//       contentType,
//       title,
//     });

//     if (contentType === "assignment") {
//       setShowAssignmentForm(true);
//       setShowQuizForm(false);
//       setShowCodingExerciseForm(false);
//       setShowPracticeForm(false);
//     } else if (contentType === "quiz") {
//       setShowQuizForm(true);
//       setShowAssignmentForm(false);
//       setShowCodingExerciseForm(false);
//       setShowPracticeForm(false);
//     } else if (contentType === "coding-exercise") {
//       setShowCodingExerciseForm(true);
//       setShowAssignmentForm(false);
//       setShowQuizForm(false);
//       setShowPracticeForm(false);
//     } else if (contentType === "practice") {
//       setShowPracticeForm(true);
//       setShowAssignmentForm(false);
//       setShowQuizForm(false);
//       setShowCodingExerciseForm(false);
//     } else {
//       try {
//         // Make sure to always pass the title parameter to addLecture
//         await addLecture(sectionId, contentType, title);
//       } catch (error) {
//         console.error("Failed to add lecture:", error);
//         // Error is already handled in the service with toast
//       }
//     }

//     setShowActionButtons(false);
//   };

//   const handleSaveDescription = async () => {
//     if (!activeDescriptionSection || !saveDescription) return;

//     await saveDescription(
//       activeDescriptionSection.sectionId,
//       Number(activeDescriptionSection.lectureId),
//       currentDescription
//     );

//     // Update UI state to reflect the saved description
//     setActiveDescriptionSection(null);
//   };

//   const handleAddPractice = async (
//     sectionId: string,
//     title: string,
//     description: string
//   ) => {
//     try {
//       // Add the lecture with practice content type
//       await addLecture(sectionId, "practice", title);

//       // If description is provided, update it
//       if (description) {
//         const sections = [...section.lectures];
//         const lectureIndex = sections.findIndex(
//           (lecture) => lecture.title === title
//         );
//         if (lectureIndex !== -1) {
//           sections[lectureIndex].description = description;
//         }
//       }

//       setShowPracticeForm(false);
//     } catch (error) {
//       console.error("Failed to add practice:", error);
//       // Error is already handled in the service with toast
//     }
//   };

//   // Custom toggleAddResourceModal that updates local state
//   const handleToggleAddResourceModal = (
//     sectionId: string,
//     lectureId: string
//   ) => {
//     // Check if we're toggling the same lecture
//     if (
//       activeResourceSection &&
//       activeResourceSection.sectionId === sectionId &&
//       activeResourceSection.lectureId === lectureId
//     ) {
//       // Toggle off
//       setActiveResourceSection(null);
//     } else {
//       // Toggle on for a new lecture
//       setActiveResourceSection({ sectionId, lectureId });
//       // Make sure description section is closed
//       setActiveDescriptionSection(null);
//     }

//     // Also call the parent toggle if it exists
//     if (toggleAddResourceModal) {
//       toggleAddResourceModal(sectionId, lectureId);
//     }
//   };

//   // Custom toggleDescriptionEditor that updates local state
//   // Custom toggleDescriptionEditor that updates local state
//   const handleToggleDescriptionEditor = (
//     sectionId: string,
//     lectureId: string,
//     currentText: string = ""
//   ) => {
//     // Check if we're toggling the same lecture
//     if (
//       activeDescriptionSection &&
//       activeDescriptionSection.sectionId === sectionId &&
//       activeDescriptionSection.lectureId === lectureId
//     ) {
//       // Toggle off
//       setActiveDescriptionSection(null);
//     } else {
//       // Toggle on for a new lecture
//       setActiveDescriptionSection({ sectionId, lectureId });
//       if (updateCurrentDescription) {
//         updateCurrentDescription(currentText);
//       }
//       // Make sure resource section is closed
//       setActiveResourceSection(null);
//     }

//     // Also call the parent toggle if it exists
//     if (toggleDescriptionEditor) {
//       toggleDescriptionEditor(sectionId, lectureId, currentText);
//     }
//   };

//   // Handle description update
//   const updateCurrentDescription = (description: string) => {
//     setCurrentDescription(description);
//   };

//   const [enhancedLectures, setEnhancedLectures] = useState<
//     Record<string, EnhancedLecture>
//   >({});
//   const allSectionsWithEnhanced = allSections.map((section) => ({
//     ...section,
//     lectures: section.lectures.map((lecture) => {
//       const enhanced = enhancedLectures[lecture.id];
//       return enhanced ? { ...lecture, ...enhanced } : lecture;
//     }),
//   }));

//   // Handler to update lecture content
//   const updateLectureContent = (
//     sectionId: string,
//     lectureId: string,
//     updatedLecture: EnhancedLecture
//   ) => {
//     // Store the enhanced lecture data
//     setEnhancedLectures((prev) => ({
//       ...prev,
//       [lectureId]: updatedLecture,
//     }));
//   };

//   // Calculate content type specific indices
//   const getContentTypeIndex = (
//     currentIndex: number,
//     contentType: string
//   ): number => {
//     let typeIndex = 0;
//     for (let i = 0; i <= currentIndex; i++) {
//       if (
//         section.lectures[i]?.title === contentType ||
//         (!section.lectures[i]?.title && contentType === "video")
//       ) {
//         if (i === currentIndex) {
//           return typeIndex;
//         }
//         typeIndex++;
//       }
//     }
//     return typeIndex;
//   };

//   // Render lecture items based on their content type

//   const renderAssignmentItem = (
//     assignment: CourseSectionAssignnments,
//     assignmentIndex: number
//   ) => {
//     return (
//       <AssignmentItem
//         key={assignment.id}
//         lecture={assignment}
//         lectureIndex={assignmentIndex} // Use assignment-specific index
//         totalLectures={section?.assignment?.length}
//         sectionId={section?.id}
//         editingLectureId={editingLectureId}
//         setEditingLectureId={setEditingLectureId}
//         updateLectureName={updateLectureName}
//         deleteLecture={deleteAssignment}
//         moveLecture={moveLecture}
//         handleDragStart={handleDragStart}
//         handleDragOver={handleDragOver}
//         handleDrop={handleDrop}
//         isDragging={isDragging}
//         handleDragEnd={handleDragEnd}
//         handleDragLeave={handleDragLeave}
//         draggedLecture={draggedLecture}
//         dragTarget={dragTarget}
//         allSections={allSections}
//         onEditAssignment={onEditAssignment}
//       />
//     );
//   };

//   const renderLectureItem = (
//     lecture: CourseSectionLecture,
//     lectureIndex: number
//   ) => {
//     return (
//       <LectureItem
//         key={lecture.id}
//         lecture={lecture}
//         lectureIndex={lectureIndex}
//         totalLectures={section?.lectures?.length}
//         sectionId={section?.id}
//         editingLectureId={editingLectureId}
//         setEditingLectureId={setEditingLectureId}
//         updateLectureName={updateLectureName}
//         deleteLecture={deleteLecture}
//         moveLecture={moveLecture}
//         toggleContentSection={toggleContentSection}
//         toggleAddResourceModal={handleToggleAddResourceModal}
//         toggleDescriptionEditor={handleToggleDescriptionEditor}
//         activeContentSection={activeContentSection}
//         activeResourceSection={activeResourceSection}
//         activeDescriptionSection={activeDescriptionSection}
//         isDragging={isDragging}
//         handleDragStart={handleDragStart}
//         handleDragOver={handleDragOver}
//         handleDrop={handleDrop}
//         handleDragEnd={handleDragEnd}
//         handleDragLeave={handleDragLeave}
//         draggedLecture={draggedLecture}
//         dragTarget={dragTarget}
//         sections={allSections}
//         updateCurrentDescription={updateCurrentDescription}
//         saveDescription={handleSaveDescription}
//         currentDescription={currentDescription}
//         allSections={allSectionsWithEnhanced}
//         updateLectureContent={updateLectureContent}
//         globalUploadedFiles={globalUploadedFiles}
//         globalSourceCodeFiles={globalSourceCodeFiles}
//         globalExternalResources={globalExternalResources}
//         addUploadedFile={addUploadedFile}
//         removeUploadedFile={removeUploadedFile}
//         addSourceCodeFile={addSourceCodeFile}
//         removeSourceCodeFile={removeSourceCodeFile}
//         addExternalResource={addExternalResource}
//         removeExternalResource={removeExternalResource}
//         // NEW: Pass the backend functions
//         uploadVideoToBackend={uploadVideoToBackend}
//         saveArticleToBackend={saveArticleToBackend}
//         videoUploading={videoUploading}
//         videoUploadProgres={videoUploadProgress}
//         courseId={courseId}
//       />
//     );
//   };
//   const renderQuizItem = (
//     lecture: CourseSectionQuiz,
//     typeSpecificIndex: number
//   ) => {
//     return (
//       <QuizItem
//         fetchSectionData={fetchSectionData}
//         key={lecture.id}
//         lecture={lecture}
//         newQuizId={newQuizId}
//         lectureIndex={typeSpecificIndex}
//         totalLectures={section?.quiz?.length}
//         sectionId={section.id}
//         editingLectureId={editingLectureId}
//         setEditingLectureId={setEditingLectureId}
//         updateLectureName={updateLectureName}
//         deleteLecture={deleteLecture}
//         deleteLocalQuiz={deleteLocalQuiz}
//         moveLecture={moveLecture}
//         handleDragStart={handleDragStart}
//         handleDragOver={handleDragOver}
//         handleDrop={handleDrop}
//         toggleContentSection={toggleContentSection}
//         updateQuizQuestions={updateQuizQuestions}
//         sections={allSections}
//         onEditQuiz={handleEditQuiz}
//         allSections={allSectionsWithEnhanced}
//         enhancedLectures={enhancedLectures}
//         uploadedFiles={globalUploadedFiles}
//         sourceCodeFiles={globalSourceCodeFiles}
//         externalResources={globalExternalResources}
//         courseId={courseId}
//       />
//     );
//   };

//   const renderCodingItem = (
//     lecture: CourseSectionAssignnments,
//     typeSpecificIndex: number
//   ) => {
//     return (
//       <CodingExerciseItem
//         key={lecture.id}
//         lecture={lecture}
//         lectureIndex={typeSpecificIndex} // Use coding-exercise-specific index
//         totalLectures={section?.codingExercises?.length}
//         sectionId={section.id}
//         editingLectureId={editingLectureId}
//         setEditingLectureId={setEditingLectureId}
//         updateLectureName={updateLectureName}
//         deleteLecture={deleteLecture}
//         moveLecture={moveLecture}
//         handleDragStart={handleDragStart}
//         handleDragOver={handleDragOver}
//         handleDrop={handleDrop}
//         isDragging={isDragging}
//         handleDragEnd={handleDragEnd}
//         handleDragLeave={handleDragLeave}
//         draggedLecture={draggedLecture}
//         dragTarget={dragTarget}
//         allSections={allSections}
//         // Add the required prop here
//         customEditHandler={(lectureId) => {
//           if (openCodingExerciseModal) {
//             openCodingExerciseModal(section.id, lectureId);
//           }
//         }}
//       />
//     );
//   };
//   const renderPractice = (
//     lecture: CourseSectionAssignnments,
//     typeSpecificIndex: number
//   ) => {
//     return (
//       <PracticeItem
//         key={lecture.id}
//         lecture={lecture}
//         lectureIndex={typeSpecificIndex} // Use practice-specific index
//         totalLectures={section?.practiceSet?.length}
//         sectionId={section.id}
//         editingLectureId={editingLectureId}
//         setEditingLectureId={setEditingLectureId}
//         updateLectureName={updateLectureName}
//         deleteLecture={deleteLecture}
//         moveLecture={moveLecture}
//         savePracticeCode={savePracticeCode}
//         handleDragStart={handleDragStart}
//         handleDragOver={handleDragOver}
//         handleDrop={handleDrop}
//         isDragging={isDragging}
//         handleDragEnd={handleDragEnd}
//         handleDragLeave={handleDragLeave}
//         draggedLecture={draggedLecture}
//         dragTarget={dragTarget}
//         allSections={allSections}
//       />
//     );
//   };

//   return (
//     <div
//       className={`border border-gray-300 overflow-hidden bg-white ${
//         draggedSection === section.id ? "opacity-50" : ""
//       } ${
//         dragTarget?.sectionId === section.id && !dragTarget?.lectureId
//           ? "border-2 border-indigo-500"
//           : ""
//       }`}
//       draggable={!showEditForm}
//       onDragStart={(e) => handleDragStart(e, section.id)}
//       onDragEnd={handleDragEnd}
//       onDragOver={(e) => handleDragOver(e)}
//       onDragLeave={handleDragLeave}
//       onDrop={(e) => handleDrop(e, section.id)}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       <div className="bg-gray-100 pb-5">
//         {/* Section header - with hover state for buttons */}
//         <div
//           className="flex justify-between items-center bg-gray-100 cursor-pointer w-full"
//           onClick={() => toggleSectionExpansion(section.id)}
//         >
//           {showEditForm ? (
//             <div className="m-4 flex-1 w-full bg-white p-2 border border-gray-400">
//               <div className="flex items-center mb-2 w-full ">
//                 <div className="w-16">
//                   <span className="text-sm font-bold text-gray-800">
//                     Section:
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     placeholder="Demo Section"
//                     className="w-full border border-gray-400 rounded px-3 py-1 focus:outline-none focus:border-2 focus:border-[#6D28D2]"
//                     maxLength={80}
//                     ref={sectionNameInputRef}
//                     disabled={isLoading}
//                   />
//                   <div className="text-right text-xs text-gray-500 mt-1">
//                     {editTitle.length}/80
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4 ml-16">
//                 <div className="mb-2">
//                   <span className="text-sm font-medium text-gray-800">
//                     What will students be able to do at the end of this section?
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={editObjective}
//                   onChange={(e) => setEditObjective(e.target.value)}
//                   placeholder="Demo Section description"
//                   className="w-full border border-gray-400 rounded px-3 py-1 focus:outline-none focus:border-2 focus:border-[#6D28D2]"
//                   maxLength={200}
//                   disabled={isLoading}
//                 />
//                 <div className="text-right text-xs text-gray-500 mt-1">
//                   {editObjective.length}/200
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditForm(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSaveEdit}
//                   className="px-4 py-2 text-sm font-medium bg-[#6D28D2] text-white rounded hover:bg-[#7B3FE4] disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={!editTitle.trim() || isLoading}
//                 >
//                   {isLoading ? "Saving..." : "Save Section"}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-row justify-between w-full p-2">
//               <div className="flex items-center space-x-3 mt-4 w-full">
//                 <h3 className="text-[15px] tracking-tight text-[#16161d] font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
//                   Unpublished Section: <FileText size={15} className="ml-2" />{" "}
//                   <span className="font-normal">{section?.title}</span>
//                 </h3>

//                 {/* Edit and Delete buttons only visible on hover */}
//                 {isHovering && !isLoading && (
//                   <>
//                     <button
//                       onClick={(e) => startEditingSection(e)}
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <Edit3 className="w-3 h-3" />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteSection("section", section?.id);
//                       }}
//                       className="text-gray-500 hover:text-red-600"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </>
//                 )}
//               </div>

//               {isHovering && !isLoading && (
//                 <div className="flex items-center space-x-2">
//                   {/* <div> kkkkkkkkmmm </div> */}
//                   <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {section && (
//           <div className="p-2 bg-gray-100 relative">
//             {/* Render lectures and assignments */}

//             {section?.lectures?.map(
//               (lecture: CourseSectionLecture, lectureIndex: number) => {
//                 return renderLectureItem(lecture, lectureIndex);
//               }
//             )}

//             {section?.assignment?.map(
//               (
//                 assignment: CourseSectionAssignnments,
//                 assignmentIndex: number
//               ) => {
//                 return renderAssignmentItem(assignment, assignmentIndex);
//               }
//             )}
//             {section?.quiz?.map(
//               (quiz: CourseSectionQuiz, quizIndex: number) => {
//                 return renderQuizItem(quiz, quizIndex);
//               }
//             )}

//             {section?.codingExercises?.map(
//               (code: CourseSectionAssignnments, codeIndex: number) => {
//                 return renderCodingItem(code, codeIndex);
//               }
//             )}
//             {section?.practiceSet?.map(
//               (practice: CourseSectionAssignnments, practiceIndex: number) => {
//                 return renderPractice(practice, practiceIndex);
//               }
//             )}
//             {/* Assignment Form */}
//             {showAssignmentForm && (
//               <AssignmentForm
//                 sectionId={section?.id}
//                 onAddAssignment={handleAddAssignment}
//                 onCancel={() => setShowAssignmentForm(false)}
//               />
//             )}

//             {showPracticeForm && (
//               <PracticeForm
//                 sectionId={section.id}
//                 onAddPractice={handleAddPractice}
//                 onCancel={() => setShowPracticeForm(false)}
//               />
//             )}

//             {showCodingExerciseForm && (
//               <CodingExerciseForm
//                 sectionId={section.id}
//                 onAddCodingExercise={handleAddCodingExercise}
//                 onCancel={() => setShowCodingExerciseForm(false)}
//                 isAddingCodingExercise={isLoading}
//               />
//             )}

//             {/* Enhanced Quiz Form */}
//             {showQuizForm && (
//               <QuizForm
//                 sectionId={section.id}
//                 onAddQuiz={handleAddQuiz}
//                 onCancel={() => setShowQuizForm(false)}
//                 isEdit={false}
//                 loading={quizOperationLoading}
//               />
//             )}

//             {/* Render any additional children */}
//             {children}

//             {/* Show action buttons when toggled */}
//             {/* Updated Curriculum & Action Buttons UI */}
//             <div className="ml-2 mt-3 relative">
//               {!showActionButtons ? (
//                 <button
//                   onClick={handleCurriculumButtonClick}
//                   className="-mx-1.5 w-36 flex items-center text-[#6D28D2] border border-[#6D28D2] bg-white hover:bg-indigo-50 hover:border-[#6D28D2] px-1 py-2 rounded-sm text-sm font-bold"
//                   disabled={isLoading}
//                 >
//                   <Plus className="w-4 h-4 mr-1 text-xs" color="#666" />{" "}
//                   Curriculum item
//                 </button>
//               ) : (
//                 <div className="relative">
//                   {/* X button to close */}
//                   <button
//                     onClick={() => setShowActionButtons(false)}
//                     className="absolute -top-3 cursor-pointer left-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>

//                   {/* Action Buttons */}
//                   <div className="bg-white border-inset border border-gray-200 rounded-md ml-8">
//                     <ActionButtons
//                       sectionId={section.id}
//                       onAddLecture={handleAddLecture}
//                       onShowTypeSelector={() => {
//                         // For the lecture button - directly add a video lecture
//                         handleAddLecture(section.id, "video");
//                         setShowActionButtons(false);
//                       }}
//                       isLoading={isLoading}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { Plus } from "lucide-react";
// import {
//   ContentType,
//   SourceCodeFile,
//   ExternalResourceItem,
//   ExtendedLecture,
//   ContentItemType,
//   Lecture,
// } from "@/lib/types";
// import { useSections } from "@/hooks/useSection";
// import { useFileUpload } from "@/hooks/useFileUpload";
// import { useModal } from "@/hooks/useModal";
// import { useSectionService } from "@/services/useSectionService";
// import { useLectureService } from "@/services/useLectureService";
// import { ContentTypeSelector } from "./ContentTypeSelector";
// import SectionItem from "./components/section/SectionItem";
// import { useCourseSectionsUpdate } from "@/services/courseSectionsService";
// import SectionForm from "./components/section/SectionForm";
// import NewFeatureAlert from "./NewFeatureAlert";
// import InfoBox from "./InfoBox";
// import CodingExerciseCreator from "./components/code/CodingExcerciseCreator";
// import AssignmentEditor from "./components/assignment/AssignmentEditor";
// import { uploadFile } from "@/services/fileUploadService";

// export interface FileUploadFunction {
//   (file: File, fileType: "VIDEO" | "RESOURCE"): Promise<string | null>;
// }
// import { useAssignmentService } from "@/services/useAssignmentService";
// import { ConfirmationModal } from "@/components/modals/DeleteConfirmationModal";

// interface CourseBuilderProps {
//   onSaveNext?: () => void;
//   courseId: number | undefined;
//   currentAssignment: {
//     sectionId: string;
//     lectureId: string;
//     data: ExtendedLecture;
//   } | null;
//   setCurrentAssignment: any;
// }

// const CourseBuilder: React.FC<CourseBuilderProps> = ({
//   onSaveNext,
//   courseId,
//   currentAssignment,
//   setCurrentAssignment,
// }) => {
//   const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
//   const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
//   const [showContentTypeSelector, setShowContentTypeSelector] =
//     useState<boolean>(false);
//   const [currentDescription, setCurrentDescription] = useState<string>("");
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const [showSectionForm, setShowSectionForm] = useState<boolean>(false);
//   const [draggedSection, setDraggedSection] = useState<string | null>(null);
//   const [draggedLecture, setDraggedLecture] = useState<string | null>(null);
//   const [showInfoBox, setShowInfoBox] = useState<boolean>(true);
//   const [showNewFeatureAlert, setShowNewFeatureAlert] = useState<boolean>(true);
//   const [newAssinment, setNewassignment] = useState<number | undefined>(
//     undefined
//   );
//   const [newQuizId, setNewQuizId] = useState<number | undefined>(undefined);

//   const [dragTarget, setDragTarget] = useState<{
//     sectionId: string | null;
//     lectureId: string | null;
//   }>({ sectionId: null, lectureId: null });

//   // FIXED: Add global resource state management
//   const [globalUploadedFiles, setGlobalUploadedFiles] = useState<
//     Array<{ name: string; size: string; lectureId: string }>
//   >([]);
//   const [globalSourceCodeFiles, setGlobalSourceCodeFiles] = useState<
//     SourceCodeFile[]
//   >([]);
//   const [globalExternalResources, setGlobalExternalResources] = useState<
//     ExternalResourceItem[]
//   >([]);

//   // Existing coding exercise modal state
//   const [showCodingExerciseCreator, setShowCodingExerciseCreator] =
//     useState<boolean>(false);
//   const [currentCodingExercise, setCurrentCodingExercise] = useState<{
//     sectionId: string;
//     lectureId: string;
//   } | null>(null);

//   // NEW: Assignment editor state
//   const [showAssignmentEditor, setShowAssignmentEditor] =
//     useState<boolean>(false);

//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     type: "section" | "lecture" | null;
//     id: string | null;
//     sectionId?: string | null;
//   }>({
//     isOpen: false,
//     type: null,
//     id: null,
//     sectionId: null,
//   });

//   const [isDeleting, setIsDeleting] = useState(false);

//   // Trigger delete confirmation
//   const handleDeleteClick = (
//     type: "section" | "lecture",
//     id: string,
//     sectionId?: string
//   ) => {
//     setDeleteModal({
//       isOpen: true,
//       type,
//       id,
//       sectionId,
//     });
//   };

//   // Handle confirmed deletion
//   const handleConfirmDelete = async () => {
//     if (!deleteModal.id || !deleteModal.type) return;

//     setIsDeleting(true);

//     try {
//       if (deleteModal.type === "section") {
//         await handleDeleteSection(deleteModal.id);
//       } else if (deleteModal.type === "lecture" && deleteModal.sectionId) {
//         await handleDeleteLecture(deleteModal.sectionId, deleteModal.id);
//       }
//     } catch (error) {
//       console.error("Deletion failed:", error);
//       // Optionally show error message
//     } finally {
//       setIsDeleting(false);
//       setDeleteModal({
//         isOpen: false,
//         type: null,
//         id: null,
//         sectionId: null,
//       });
//     }
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     if (!isDeleting) {
//       setDeleteModal({
//         isOpen: false,
//         type: null,
//         id: null,
//         sectionId: null,
//       });
//     }
//   };

//   // Services for backend operations
//   const {
//     getCourseSections,
//     createSection,
//     updateSection,
//     deleteSection,
//     loading: sectionLoading,
//     error: sectionError,
//   } = useSectionService();
//   const {
//     createLecture,
//     updateLecture,
//     deleteLecture,
//     loading: lectureLoading,
//     error: lectureError,
//   } = useLectureService();

//   const {
//     fetchSectionData,
//     sections,
//     setSections,
//     addSection: addLocalSection,
//     addLecture: addLocalLecture,
//     deleteSection: deleteLocalSection,
//     deleteLecture: deleteLocalLecture,
//     addQuiz,
//     toggleSectionExpansion,
//     updateSectionName: updateLocalSectionName,
//     updateLectureName: updateLocalLectureName,
//     moveSection,
//     moveLecture,
//     updateLectureContent,
//     updateQuizQuestions,
//     saveDescription: saveSectionDescription,
//     updateLectureWithUploadedContent,
//     handleLectureDrop,
//     savePracticeCode,
//     updateQuiz,
//     uploadVideoToBackend,
//     saveArticleToBackend,
//     videoUploading,
//     videoUploadProgress,
//     mainSectionData,
//     setMainSectionData,
//   } = useSections([], courseId);

//   const contentSectionModal = useModal();

//   const {
//     isUploading,
//     uploadProgress,
//     fileInputRef,
//     triggerFileUpload,
//     handleFileSelection,
//   } = useFileUpload(updateLectureWithUploadedContent, () => {});

//   const {
//     updateCourseSections,
//     loading: mutationLoading,
//     error: mutationError,
//   } = useCourseSectionsUpdate();

//   // FIXED: Add resource management functions
//   const addUploadedFile = (file: {
//     name: string;
//     size: string;
//     lectureId: string;
//   }) => {
//     setGlobalUploadedFiles((prev) => [...prev, file]);
//   };

//   const removeUploadedFile = (fileName: string, lectureId: string) => {
//     setGlobalUploadedFiles((prev) =>
//       prev.filter(
//         (file) => !(file.name === fileName && file.lectureId === lectureId)
//       )
//     );
//   };

//   const addSourceCodeFile = (file: SourceCodeFile) => {
//     setGlobalSourceCodeFiles((prev) => {
//       // Prevent duplicates by checking both name and filename
//       const isDuplicate = prev.some(
//         (existingFile) =>
//           (existingFile.name === file.name ||
//             existingFile.filename === file.filename ||
//             existingFile.name === file.filename ||
//             existingFile.filename === file.name) &&
//           existingFile.lectureId === file.lectureId
//       );

//       if (isDuplicate) {
//         return prev;
//       }

//       return [...prev, file];
//     });
//   };

//   const removeSourceCodeFile = (
//     fileName: string | undefined,
//     lectureId: string
//   ) => {
//     setGlobalSourceCodeFiles((prev) =>
//       prev.filter((file) => {
//         // Check BOTH name AND filename properties
//         const nameMatch = file.name === fileName || file.filename === fileName;
//         const lectureMatch = file.lectureId === lectureId;

//         // Return true to keep, false to remove
//         return !(nameMatch && lectureMatch);
//       })
//     );
//   };

//   const uploadFileToBackend: FileUploadFunction = async (
//     file: File,
//     fileType: "VIDEO" | "RESOURCE"
//   ) => {
//     try {
//       const uploadedUrl = await uploadFile(file, fileType);
//       return uploadedUrl;
//     } catch (error) {
//       console.error(`Failed to upload ${fileType} file:`, error);
//       toast.error(
//         `Failed to upload ${fileType.toLowerCase()} file. Please try again.`
//       );
//       throw error;
//     }
//   };

//   const addExternalResource = (resource: ExternalResourceItem) => {
//     setGlobalExternalResources((prev) => [...prev, resource]);
//   };

//   const removeExternalResource = (title: string, lectureId: string) => {
//     setGlobalExternalResources((prev) =>
//       prev.filter(
//         (resource) =>
//           !(resource.title === title && resource.lectureId === lectureId)
//       )
//     );
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: globalThis.MouseEvent) => {
//       // Fix for the closest method by casting to Element instead of Node
//       const target = e.target as Element;
//       if (editingSectionId && !target.closest(".section-edit")) {
//         setEditingSectionId(null);
//       }

//       if (editingLectureId && !target.closest(".lecture-edit")) {
//         setEditingLectureId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [editingSectionId, editingLectureId]);

//   const [activeContentSection, setActiveContentSection] = useState<{
//     sectionId: string;
//     lectureId: string;
//   } | null>(null);

//   const [activeDescriptionSection, setActiveDescriptionSection] = useState<{
//     sectionId: string;
//     lectureId: string;
//   } | null>(null);
//   // Function to fetch section data and update state
//   // const fetchSectionData = async () => {
//   //   try {
//   //     const data = await dataFromSection();
//   //     setMainSectionData(data?.courseSections);
//   //     return data;
//   //   } catch (error) {
//   //     console.error("Error fetching section data:", error);
//   //     return null;
//   //   }
//   // };

//   // useEffect to refetch when `dataFromSection` changes
//   // useEffect(() => {
//   //   console.log("This is a sign");
//   //   const fetchData = async () => {
//   //     await fetchSectionData();
//   //   };
//   //   fetchData();
//   // }, [dataFromSection]);

//   // NEW: Backend-integrated section creation
//   const handleAddSection = async (title: string, objective: string) => {
//     try {
//       if (!courseId) {
//         toast.error("Course ID is required to create a section");
//         return;
//       }

//       // Calculate order (position) - new section goes at the end
//       const order = sections.length;

//       // Create section on backend
//       const response = await createSection({
//         courseId: Number(courseId),
//         order: order,
//         title: title,
//         description: objective || "",
//       });

//       if (response.createSection.success) {
//         // Add to local state with backend ID
//         await fetchSectionData();
//         const backendSectionId = response.createSection.section.id;
//         // addLocalSection(title, objective);

//         // Update the local section with the backend ID
//         setSections((prevSections) =>
//           prevSections.map((section, index) =>
//             index === prevSections.length - 1
//               ? { ...section, id: backendSectionId }
//               : section
//           )
//         );

//         setShowSectionForm(false);
//         return backendSectionId;
//       }
//     } catch (error) {
//       console.error("Failed to create section:", error);
//       // Error is already handled in the service with toast
//     }
//   };

//   // NEW: Backend-integrated lecture creation
//   const handleAddLecture = async (
//     sectionId: string,
//     contentType: ContentItemType,
//     title?: string
//   ): Promise<string> => {
//     try {
//       console.log("Yepppp yep", sectionId);
//       // Create lecture on backend
//       const response = await createLecture({
//         sectionId: Number(sectionId),
//         title: title || "New Lecture",
//       });

//       if (response.createLecture.success) {
//         // Add to local state with backend ID
//         await fetchSectionData();
//         const backendLectureId = response.createLecture.lecture.id;
//         // const localLectureId = addLocalLecture(sectionId, contentType, title);

//         // Update the local lecture with the backend ID
//         // setSections((prevSections) =>
//         //   prevSections.map((section) => {
//         //     if (section.id === sectionId) {
//         //       return {
//         //         ...section,
//         //         lectures: section.lectures.map((lecture) =>
//         //           lecture.id === localLectureId
//         //             ? { ...lecture, id: backendLectureId }
//         //             : lecture
//         //         ),
//         //       };
//         //     }
//         //     return section;
//         //   })
//         // );

//         console.log("Heerrrrrsaarrrrrrrrrrr", backendLectureId);

//         return backendLectureId;
//       }

//       return "";
//     } catch (error) {
//       console.error("Failed to create lecture:", error);
//       // Error is already handled in the service with toast
//       return "";
//     }
//   };

//   const [hasCreatedIntro, setHasCreatedIntro] = useState(false);
//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     const initializeCourse = async () => {
//       if (!courseId || !isInitializing) return;

//       try {
//         const data = await fetchSectionData();

//         // If sections already exist or we've already created intro, skip
//         if ((data?.courseSections?.length as number) > 0 || hasCreatedIntro) {
//           setIsInitializing(false);
//           return;
//         }

//         // Create introduction section and lecture
//         const sectionId = await handleAddSection("Introduction", "");
//         await handleAddLecture(sectionId as string, "video", "Introduction");

//         // Mark as completed
//         setHasCreatedIntro(true);
//         setIsInitializing(false);
//       } catch (error) {
//         console.error("Initialization error:", error);
//         setIsInitializing(false);
//       }
//     };

//     // Add initial delay before starting initialization
//     const initTimeout = setTimeout(initializeCourse, 50);

//     // Cleanup timeout if component unmounts
//     return () => clearTimeout(initTimeout);
//     // initializeCourse();
//   }, []);

//   console.log("sectionmain===", mainSectionData);

//   // NEW: Backend-integrated section update
//   const updateSectionName = async (
//     sectionId: string,
//     newName: string,
//     objective?: string
//   ) => {
//     try {
//       // Find the section to get its current order
//       const sectionIndex = sections.findIndex(
//         (section) => section.id === sectionId
//       );
//       if (sectionIndex === -1) {
//         toast.error("Section not found");
//         return;
//       }

//       // Update on backend
//       await updateSection({
//         sectionId: Number(sectionId),
//         order: sectionIndex, // Use current position as order
//         title: newName,
//         description: objective || "",
//       });

//       // Update local state
//       await fetchSectionData();
//       updateLocalSectionName(sectionId, newName, objective);
//     } catch (error) {
//       console.error("Failed to update section:", error);
//       // Error is already handled in the service with toast
//     }
//   };

//   // NEW: Backend-integrated section deletion
//   const handleDeleteSection = async (sectionId: string) => {
//     try {
//       // Delete on backend
//       await deleteSection({
//         sectionId: Number(sectionId),
//       });

//       // Delete from local state
//       await fetchSectionData();
//       deleteLocalSection(sectionId);
//     } catch (error) {
//       console.error("Failed to delete section:", error);
//       // Error is already handled in the service with toast
//     }
//   };

//   // NEW: Backend-integrated lecture update
//   const updateLectureName = async (
//     sectionId: string,
//     lectureId: string,
//     newName: string
//   ) => {
//     try {
//       // Update on backend
//       await updateLecture({
//         lectureId: Number(lectureId),
//         title: newName,
//       });
//       await fetchSectionData();

//       // Update local state
//       updateLocalLectureName(sectionId, lectureId, newName);
//     } catch (error) {
//       console.error("Failed to update lecture:", error);
//       // Error is already handled in the service with toast
//     }
//   };

//   // NEW: Backend-integrated lecture deletion
//   const handleDeleteLecture = async (sectionId: string, lectureId: string) => {
//     console.log("Deleting lectureeeeeeeeee", sectionId, lectureId);
//     try {
//       // Delete on backend
//       await deleteLecture({
//         lectureId: Number(lectureId),
//       });
//       await fetchSectionData();
//       // Delete from local state
//       deleteLocalLecture(sectionId, lectureId);
//     } catch (error) {
//       console.error("Failed to delete lecture:", error);
//       // Error is already handled in the service with toast
//     }
//   };
//   // function to delete assignment
//   const { deleteAssignment } = useAssignmentService();
//   const handleDeleteAssignment = async (
//     sectionId: string,
//     lectureId: string
//   ) => {
//     try {
//       await deleteAssignment({
//         assignmentId: Number(lectureId),
//       });
//       await fetchSectionData();
//     } catch (error) {
//       console.log("failed to delete Assignment", error);
//     }
//   };

//   // Existing coding exercise handlers
//   const handleOpenCodingExerciseModal = (
//     sectionId: string,
//     lectureId: string
//   ) => {
//     setCurrentCodingExercise({ sectionId, lectureId });
//     setShowCodingExerciseCreator(true);
//   };

//   const handleSaveCodingExercise = async (updatedLecture: any) => {
//     if (!currentCodingExercise) return;
//     try {
//       await updateLecture({
//         lectureId: Number(updatedLecture.id),
//         title: updatedLecture.name,
//       });

//       setSections(
//         sections.map((section) => {
//           if (section.id === currentCodingExercise.sectionId) {
//             return {
//               ...section,
//               lectures: section.lectures.map((lecture) =>
//                 lecture.id === updatedLecture.id
//                   ? {
//                       ...lecture,
//                       name: updatedLecture.name || lecture.name,
//                       codeLanguage: updatedLecture.codeLanguage,
//                       version: updatedLecture.version,
//                     }
//                   : lecture
//               ),
//             };
//           }
//           return section;
//         })
//       );

//       await fetchSectionData();
//       setShowCodingExerciseCreator(false);
//       setCurrentCodingExercise(null);
//       toast.success("Coding exercise updated successfully!");
//     } catch (error) {
//       console.error("Failed to update coding exercise:", error);
//       toast.error("Failed to update coding exercise.");
//     }
//   };

//   // NEW: Assignment editor handlers
//   const handleOpenAssignmentEditor = (assignmentData: ExtendedLecture) => {
//     // Find the section and lecture IDs
//     let foundSectionId = "";
//     let foundLectureId = assignmentData.id;

//     for (const section of sections) {
//       const lecture = section.lectures.find((l) => l.id === assignmentData.id);
//       if (lecture) {
//         foundSectionId = section.id;
//         break;
//       }
//     }

//     setCurrentAssignment({
//       sectionId: foundSectionId,
//       lectureId: foundLectureId,
//       data: {
//         ...assignmentData,
//         isPublished:
//           assignmentData.isPublished !== undefined
//             ? assignmentData.isPublished
//             : false,
//       },
//     });
//     setShowAssignmentEditor(true);
//   };

//   const handleSaveAssignment = (updatedAssignment: ExtendedLecture) => {
//     if (!currentAssignment) return;

//     // Update the sections state with the assignment changes
//     setSections(
//       sections.map((section) => {
//         if (section.id === currentAssignment.sectionId) {
//           return {
//             ...section,
//             lectures: section.lectures.map((lecture) =>
//               lecture.id === updatedAssignment.id
//                 ? {
//                     ...lecture,
//                     name:
//                       updatedAssignment.assignmentTitle ||
//                       updatedAssignment.name ||
//                       lecture.name,
//                     title:
//                       updatedAssignment.assignmentTitle ||
//                       updatedAssignment.title ||
//                       lecture.title,
//                     description:
//                       updatedAssignment.assignmentDescription ||
//                       lecture.description,
//                     // Add all the assignment-specific fields
//                     assignmentTitle: updatedAssignment.assignmentTitle,
//                     assignmentDescription:
//                       updatedAssignment.assignmentDescription,
//                     estimatedDuration: updatedAssignment.estimatedDuration,
//                     durationUnit: updatedAssignment.durationUnit,
//                     assignmentInstructions: updatedAssignment.instructions,
//                     instructionalVideo: updatedAssignment.instructionalVideo,
//                     downloadableResource:
//                       updatedAssignment.downloadableResource,
//                     assignmentQuestions: updatedAssignment.assignmentQuestions,
//                     solutionVideo: updatedAssignment.solutionVideo,
//                     isPublished: updatedAssignment.isPublished,
//                   }
//                 : lecture
//             ),
//           };
//         }
//         return section;
//       })
//     );

//     // Show success message
//     // await fetchSectionData()
//     toast.success("Assignment updated successfully!");
//   };

//   const handleCloseAssignmentEditor = () => {
//     setShowAssignmentEditor(false);
//     setCurrentAssignment(null);
//   };

//   const toggleDescriptionEditor = (
//     sectionId: string,
//     lectureId: string,
//     description?: string
//   ) => {
//     if (
//       activeDescriptionSection &&
//       activeDescriptionSection.sectionId === sectionId &&
//       activeDescriptionSection.lectureId === lectureId
//     ) {
//       setActiveDescriptionSection(null);

//       if (description !== undefined && description.trim() !== "") {
//         if (
//           !activeContentSection ||
//           activeContentSection.sectionId !== sectionId ||
//           activeContentSection.lectureId !== lectureId
//         ) {
//           setActiveContentSection({ sectionId, lectureId });
//         }
//       }
//     } else {
//       setActiveDescriptionSection({ sectionId, lectureId });
//       setCurrentDescription(description || "");
//     }
//   };

//   const toggleAddResourceModal = (sectionId: string, lectureId: string) => {
//     contentSectionModal.toggle(sectionId, lectureId);
//   };

//   // Rest of your existing handlers (handleDragStart, handleDragEnd, etc.) remain the same...
//   const handleDragStart = (
//     e: React.DragEvent,
//     sectionId: string,
//     lectureId?: string
//   ) => {
//     e.stopPropagation();
//     setIsDragging(true);

//     if (lectureId) {
//       setDraggedLecture(lectureId);
//       e.dataTransfer.setData("lectureId", lectureId);
//     } else {
//       setDraggedSection(sectionId);
//     }

//     e.dataTransfer.setData("sectionId", sectionId);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//     setDraggedSection(null);
//     setDraggedLecture(null);
//     setDragTarget({ sectionId: null, lectureId: null });
//   };

//   const handleDragOver = (
//     e: React.DragEvent,
//     targetSectionId: string,
//     targetLectureId?: string
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     e.dataTransfer.dropEffect = "move";

//     setDragTarget({
//       sectionId: targetSectionId,
//       lectureId: targetLectureId || null,
//     });
//   };

//   const handleDrop = (
//     e: React.DragEvent,
//     targetSectionId: string,
//     targetLectureId?: string
//   ) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const sourceSectionId = e.dataTransfer.getData("sectionId");
//     const sourceLectureId = e.dataTransfer.getData("lectureId");

//     if (!sourceSectionId) return;

//     if (sourceLectureId && sourceLectureId.trim() !== "") {
//       handleLectureDrop(
//         sourceSectionId,
//         sourceLectureId,
//         targetSectionId,
//         targetLectureId
//       );
//       return;
//     }

//     if (!targetLectureId) {
//       const sourceIndex = sections.findIndex((s) => s.id === sourceSectionId);
//       const targetIndex = sections.findIndex((s) => s.id === targetSectionId);

//       if (
//         sourceIndex === -1 ||
//         targetIndex === -1 ||
//         sourceIndex === targetIndex
//       ) {
//         return;
//       }

//       const newSections = [...sections];
//       const [movedSection] = newSections.splice(sourceIndex, 1);
//       newSections.splice(targetIndex, 0, movedSection);

//       setSections(newSections);
//       toast.success("Section moved successfully");
//     }
//   };

//   //new assignment

//   const handleDragLeave = () => {
//     setDragTarget({ sectionId: null, lectureId: null });
//   };

//   const getFormattedSectionsForPreview = () => {
//     return sections.map((section) => {
//       // Separate content by type
//       const lectures = section.lectures.filter(
//         (lecture) =>
//           !lecture.contentType ||
//           lecture.contentType === "video" ||
//           lecture.contentType === "article"
//       );

//       const quizzes = section.lectures
//         .filter((lecture) => lecture.contentType === "quiz")
//         .map((lecture) => ({
//           id: lecture.id,
//           name: lecture.name || lecture.title || "Quiz",
//           description: lecture.description || "",
//           questions: lecture.questions || [],
//           duration: "10min",
//           contentType: "quiz",
//         }));

//       const assignments = section.lectures
//         .filter((lecture) => lecture.contentType === "assignment")
//         .map((lecture) => ({
//           id: lecture.id,
//           name: lecture.name || lecture.title || "Assignment",
//           description: lecture.description || "",
//           duration: lecture.estimatedDuration
//             ? `${lecture.estimatedDuration}${lecture.durationUnit || "min"}`
//             : "30min",
//           contentType: "assignment",
//         }));

//       const codingExercises = section.lectures
//         .filter((lecture) => lecture.contentType === "coding-exercise")
//         .map((lecture) => ({
//           id: lecture.id,
//           name: lecture.name || lecture.title || "Coding Exercise",
//           description: lecture.description || "",
//           duration: "15min",
//           contentType: "coding-exercise",
//         }));

//       return {
//         id: section.id,
//         name: section.name,
//         lectures: lectures,
//         quizzes: quizzes,
//         assignments: assignments,
//         codingExercises: codingExercises,
//         isExpanded: section.isExpanded !== false,
//       };
//     });
//   };

//   const findLecture = (sectionId: string, lectureId: string) => {
//     const section = sections.find((s) => s.id === sectionId);
//     if (!section) return null;

//     return section.lectures.find((l) => l.id === lectureId) || null;
//   };

//   // NEW: Check if assignment editor is open and render it
//   if (showAssignmentEditor && currentAssignment) {
//     return (
//       <AssignmentEditor
//         newAssinment={newAssinment}
//         initialData={currentAssignment.data}
//         onClose={handleCloseAssignmentEditor}
//         onSave={handleSaveAssignment}
//       />
//     );
//   }

//   const isLoading = sectionLoading || lectureLoading;

//   return (
//     <div className="xl:max-w-5xl max-w-full mx-auto shadow-xl">
//       <div className="flex justify-between items-center mb-4 border-b px-10 border-gray-300 pb-5">
//         <h1 className="text-xl font-bold text-gray-800">Curriculum</h1>
//         <button className="px-3 py-1.5 bg-white text-[#6D28D2] border border-[#6D28D2] rounded-md text-sm font-medium hover:bg-indigo-50">
//           Bulk Uploader
//         </button>
//       </div>
//       <div className="p-4 pb-4 shadow-xl px-10">
//         <div className="mt-8">
//           {showInfoBox && <InfoBox onDismiss={() => setShowInfoBox(false)} />}

//           <div className="text-sm text-gray-700 mb-2">
//             Start putting together your course by creating sections, lectures
//             and practice (quizzes, coding exercises and assignments).
//           </div>
//           <div className="text-sm text-gray-700 mb-4">
//             <span>
//               Start putting together your course by creating sections, lectures
//               and practice activities{" "}
//             </span>
//             <span className="text-[#6D28D2]">
//               (quizzes, coding exercises and assignments)
//             </span>
//             <span>. Use your </span>
//             <span className="text-[#6D28D2]">course outline</span>
//             <span>
//               {" "}
//               to structure your content and label your sections and lectures
//               clearly. If you're intending to offer your course for free, the
//               total length of video content must be less than 2 hours.
//             </span>
//           </div>

//           {showNewFeatureAlert && (
//             <NewFeatureAlert onDismiss={() => setShowNewFeatureAlert(false)} />
//           )}
//           <button
//             onClick={() => setShowSectionForm(true)}
//             className="relative w-16 h-8 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-r-[45px]"
//             aria-label="Add section"
//             disabled={isLoading}
//           >
//             <Plus className="h-6 w-6 text-gray-500" />
//           </button>
//         </div>
//         <div className="bg-white border border-gray-200 mb-6 mt-20">
//           {mainSectionData?.length > 0 ? (
//             mainSectionData?.map((section: any, index: number) => (
//               <SectionItem
//                 fetchSectionData={fetchSectionData}
//                 setNewassignment={setNewassignment}
//                 setNewQuizId={setNewQuizId}
//                 newQuizId={newQuizId}
//                 deleteAssignment={handleDeleteAssignment}
//                 key={section.id}
//                 section={section}
//                 index={index}
//                 totalSections={mainSectionData?.length}
//                 editingSectionId={editingSectionId}
//                 setEditingSectionId={setEditingSectionId}
//                 updateSectionName={updateSectionName}
//                 deleteSection={handleDeleteClick}
//                 moveSection={moveSection}
//                 toggleSectionExpansion={toggleSectionExpansion}
//                 isDragging={isDragging}
//                 handleDragStart={handleDragStart}
//                 handleDragEnd={handleDragEnd}
//                 handleDragOver={(e) => handleDragOver(e, section.id)}
//                 handleDragLeave={handleDragLeave}
//                 handleDrop={(e) => handleDrop(e, section.id)}
//                 addLecture={handleAddLecture}
//                 addQuiz={addQuiz}
//                 deleteLocalQuiz={deleteLocalLecture}
//                 editingLectureId={editingLectureId}
//                 setEditingLectureId={setEditingLectureId}
//                 updateLectureName={updateLectureName}
//                 deleteLecture={handleDeleteClick}
//                 moveLecture={moveLecture}
//                 toggleContentSection={contentSectionModal.toggle}
//                 toggleAddResourceModal={toggleAddResourceModal}
//                 toggleDescriptionEditor={toggleDescriptionEditor}
//                 activeContentSection={contentSectionModal.activeSection}
//                 addCurriculumItem={() => setShowContentTypeSelector(true)}
//                 savePracticeCode={savePracticeCode}
//                 draggedSection={draggedSection}
//                 draggedLecture={draggedLecture}
//                 dragTarget={dragTarget}
//                 saveDescription={saveSectionDescription}
//                 openCodingExerciseModal={handleOpenCodingExerciseModal}
//                 onEditAssignment={handleOpenAssignmentEditor}
//                 allSections={getFormattedSectionsForPreview()}
//                 updateQuiz={updateQuiz}
//                 globalUploadedFiles={globalUploadedFiles}
//                 globalSourceCodeFiles={globalSourceCodeFiles}
//                 globalExternalResources={globalExternalResources}
//                 addUploadedFile={addUploadedFile}
//                 removeUploadedFile={removeUploadedFile}
//                 addSourceCodeFile={addSourceCodeFile}
//                 removeSourceCodeFile={removeSourceCodeFile}
//                 addExternalResource={addExternalResource}
//                 removeExternalResource={removeExternalResource}
//                 isLoading={isLoading}
//                 // Backend integration props
//                 // NEW: Pass the new backend functions
//                 uploadVideoToBackend={uploadVideoToBackend}
//                 saveArticleToBackend={saveArticleToBackend}
//                 videoUploading={videoUploading}
//                 videoUploadProgress={videoUploadProgress}
//                 // NEW: Pass file upload function
//                 uploadFileToBackend={uploadFileToBackend}
//                 courseId={courseId}
//               />
//             ))
//           ) : (
//             <div className="flex justify-center border border-gray-400 bg-gray-100 items-center min-h-10 ">
//               {/* This is an empty state for when there are no sections */}
//             </div>
//           )}

//           {showContentTypeSelector && (
//             <div className="absolute z-10 left-0 mt-2">
//               <ContentTypeSelector
//                 sectionId={
//                   mainSectionData?.length > 0
//                     ? mainSectionData[mainSectionData?.length - 1].id
//                     : ""
//                 }
//                 onSelect={handleAddLecture}
//                 onClose={() => setShowContentTypeSelector(false)}
//               />
//             </div>
//           )}
//         </div>

//         {showSectionForm && (
//           <div className="pb-20">
//             <SectionForm
//               onAddSection={handleAddSection}
//               onCancel={() => setShowSectionForm(false)}
//               isLoading={isLoading}
//             />
//           </div>
//         )}

//         {!showSectionForm && (
//           <button
//             onClick={() => setShowSectionForm(true)}
//             className="inline-flex items-center mb-8 px-3 py-1.5 border border-[#6D28D2] text-[#6D28D2] bg-white rounded text-sm font-bold hover:bg-indigo-50"
//             disabled={isLoading}
//           >
//             <Plus className="h-4 w-4 mr-1" color="#666" />
//             Section
//           </button>
//         )}

//         {/* Save & Next button for curriculum step */}
//         <div className="flex justify-end mt-8">
//           <button
//             className="bg-[#2E2C6F] text-white font-medium text-sm px-6 py-2 rounded-md hover:bg-[#25235a]"
//             onClick={() => {
//               // You may want to add validation or save logic here before calling onSaveNext
//               if (onSaveNext) onSaveNext();
//             }}
//             disabled={isLoading}
//           >
//             Save & Next
//           </button>
//         </div>
//       </div>

//       {/* Hidden file input for file uploads */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={(e) => {
//           if (!contentSectionModal.activeSection) return;

//           const contentType = fileInputRef.current
//             ?.getAttribute("accept")
//             ?.includes("video")
//             ? ContentType.VIDEO
//             : ContentType.FILE;

//           handleFileSelection(
//             e,
//             contentType,
//             contentSectionModal.activeSection.sectionId,
//             contentSectionModal.activeSection.lectureId
//           );
//         }}
//         className="hidden"
//       />

//       {/* Existing coding exercise modal */}
//       {showCodingExerciseCreator && currentCodingExercise && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-auto">
//           <CodingExerciseCreator
//             lectureId={currentCodingExercise.lectureId}
//             onClose={() => {
//               setShowCodingExerciseCreator(false);
//               setCurrentCodingExercise(null);
//             }}
//             onSave={handleSaveCodingExercise}
//             initialData={
//               findLecture(
//                 currentCodingExercise.sectionId,
//                 currentCodingExercise.lectureId
//               ) ?? undefined
//             }
//             isUpdating={lectureLoading}
//           />
//         </div>
//       )}

//       <ConfirmationModal
//         isOpen={deleteModal.isOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmDelete}
//         title={
//           deleteModal.type === "section" ? "Delete Section" : "Delete Lecture"
//         }
//         message={
//           deleteModal.type === "section"
//             ? "Are you sure you want to delete this section? All lectures within it will also be deleted."
//             : "Are you sure you want to delete this lecture?"
//         }
//         isLoading={isDeleting}
//       />
//     </div>
//   );
// };

// export default CourseBuilder;

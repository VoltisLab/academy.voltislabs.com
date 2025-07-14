import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  FileText,
  FileDown,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  VideoContent,
  ArticleContent,
  Lecture,
  EnhancedLecture,
  SelectedVideoDetails,
  SourceCodeFile,
  ExternalResourceItem,
  ContentTypeDetector,
  PreviewSection,
} from "@/lib/types";
import StudentCoursePreview from "./StudentCoursePreview";
import InstructorVideoPreview from "./InstructorVideoPreview";
import Link from "next/link";
import { CourseSectionLecture } from "@/api/course/section/queries";

export type ExpansionType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

interface LectureContentDisplayProps {
  lecture: CourseSectionLecture;
  sectionId: string;
  videoContent: VideoContent;
  articleContent: ArticleContent;
  isExpanded: boolean;
  isResourceSectionActive: boolean;
  isDescriptionSectionActive: boolean;
  onEditContent: () => void;
  onToggleDownloadable: () => void;
  onToggleDescriptionEditor?: (
    sectionId: string,
    lectureId: string,
    currentText: string
  ) => void;
  onToggleAddResourceModal?: (sectionId: string, lectureId: string) => void;
  onSetActiveContentType: (type: "article") => void;
  onToggleContentSection?: (sectionId: string, lectureId: string) => void;
  // Resource props
  currentLectureUploadedFiles: Array<{
    name: string;
    size: string;
    lectureId: string;
  }>;
  currentLectureSourceCodeFiles: SourceCodeFile[];
  currentLectureExternalResources: ExternalResourceItem[];
  removeUploadedFile?: (fileName: string, lectureId: string) => void;
  removeSourceCodeFile?: (
    fileName: string | undefined,
    lectureId: string
  ) => void;
  removeExternalResource?: (title: string, lectureId: string) => void;
  // Global arrays for preview
  globalUploadedFiles: Array<{ name: string; size: string; lectureId: string }>;
  globalSourceCodeFiles: SourceCodeFile[];
  globalExternalResources: ExternalResourceItem[];
  allSections: PreviewSection[];
  children?: React.ReactNode;
  courseId?: number;
  resourceExpansion?: ExpansionType;
  descriptionExpansion?: ExpansionType;
}

const LectureContentDisplay: React.FC<LectureContentDisplayProps> = ({
  lecture,
  sectionId,
  videoContent,
  articleContent,
  isExpanded,
  isResourceSectionActive,
  isDescriptionSectionActive,
  onEditContent,
  onToggleDownloadable,
  onToggleDescriptionEditor,
  onToggleAddResourceModal,
  onSetActiveContentType,
  onToggleContentSection,
  currentLectureUploadedFiles,
  currentLectureSourceCodeFiles,
  currentLectureExternalResources,
  removeUploadedFile,
  removeSourceCodeFile,
  removeExternalResource,
  globalUploadedFiles,
  globalSourceCodeFiles,
  globalExternalResources,
  allSections,
  children,
  courseId,
  resourceExpansion,
  descriptionExpansion,
}) => {
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "instructor" | "student" | null
  >(null);
  const [previewContentType, setPreviewContentType] = useState<string>("video");

  console.log(currentLectureUploadedFiles);

  // Create enhanced lecture for preview
  const createEnhancedLectureForPreview = (): EnhancedLecture => {
    const hasRealVideoContent = !!(
      videoContent.selectedVideoDetails && videoContent.selectedVideoDetails.url
    );
    const hasRealArticleContent = !!(
      articleContent &&
      articleContent.text &&
      articleContent.text.trim() !== ""
    );

    const enhancedLecture: any = {
      ...lecture,
      hasVideoContent: hasRealVideoContent,
      hasArticleContent: hasRealArticleContent,
      articleContent: hasRealArticleContent ? articleContent : undefined,
      videoDetails:
        hasRealVideoContent && videoContent.selectedVideoDetails
          ? videoContent.selectedVideoDetails
          : undefined,
      contentMetadata: {
        createdAt: new Date(),
        lastModified: new Date(),
        ...(hasRealArticleContent && {
          articleWordCount: articleContent.text.split(/\s+/).length,
        }),
        ...(hasRealVideoContent &&
          videoContent.selectedVideoDetails?.duration && {
            videoDuration: videoContent.selectedVideoDetails.duration,
          }),
      },
      attachedFiles: [],
      videos: [],
    };

    let detectedType:
      | "article"
      | "video"
      | "quiz"
      | "coding-exercise"
      | "assignment";

    if (hasRealArticleContent && !hasRealVideoContent) {
      detectedType = "article";
    } else if (hasRealVideoContent && !hasRealArticleContent) {
      detectedType = "video";
    } else if (hasRealArticleContent && hasRealVideoContent) {
      console.warn(
        "⚠️ Both article and video content exist - this is unexpected"
      );
      detectedType = "article";
    } else {
      detectedType =
        (lecture.title as
          | "article"
          | "video"
          | "quiz"
          | "coding-exercise"
          | "assignment") || "video";
    }

    enhancedLecture.actualContentType = detectedType;
    enhancedLecture.contentType = detectedType;

    return enhancedLecture;
  };

  // Create enhanced sections
  const createEnhancedSections = () => {
    if (!allSections || allSections.length === 0) {
      return allSections;
    }

    return allSections.map((section) => ({
      ...section,
      lectures:
        section.lectures?.map((lec) => {
          const lectureUploadedFiles = globalUploadedFiles.filter(
            (file) => file.lectureId === lec.id
          );
          const lectureSourceCodeFiles = globalSourceCodeFiles.filter(
            (file) => file.lectureId === lec.id
          );
          const lectureExternalResources = globalExternalResources.filter(
            (resource) => resource.lectureId === lec.id
          );

          let enhancedLecture: EnhancedLecture;

          if (lec.id === lecture.id) {
            enhancedLecture = createEnhancedLectureForPreview();
          } else {
            const existingEnhanced = lec as EnhancedLecture;

            if (existingEnhanced.actualContentType) {
              enhancedLecture = existingEnhanced;
            } else {
              let hasVideoContent = false;
              let hasArticleContent = false;
              let actualContentType = lec.contentType || "video";
              // Robustly extract article content from lec
              const articleContent =
                (lec as any).articleContent ||
                ((lec as any).lectureNotes
                  ? { text: (lec as any).lectureNotes }
                  : undefined) ||
                (lec.description ? { text: lec.description } : undefined);
              if (
                articleContent &&
                typeof articleContent.text === "string" &&
                articleContent.text.trim() !== ""
              ) {
                hasArticleContent = true;
                actualContentType = "article";
              }
              if (lec.contentType === "article") {
                hasArticleContent = true;
                actualContentType = "article";
              } else if (lec.contentType === "video" || !lec.contentType) {
                hasVideoContent = true;
                actualContentType = "video";
              } else {
                actualContentType = lec.contentType;
              }

              enhancedLecture = {
                ...lec,
                actualContentType: actualContentType as any,
                hasVideoContent,
                hasArticleContent,
                articleContent,
                contentMetadata: {
                  createdAt: new Date(),
                  lastModified: new Date(),
                },
              };
            }
          }

          enhancedLecture.lectureResources = {
            uploadedFiles: lectureUploadedFiles,
            sourceCodeFiles: lectureSourceCodeFiles,
            externalResources: lectureExternalResources,
          };

          return enhancedLecture;
        }) || [],
    }));
  };

  const handlePreviewSelection = (mode: "instructor" | "student"): void => {
    const enhancedLecture = createEnhancedLectureForPreview();

    let detectedContentType: string;
    if (
      ContentTypeDetector &&
      typeof ContentTypeDetector.detectLectureContentType === "function"
    ) {
      detectedContentType =
        ContentTypeDetector.detectLectureContentType(enhancedLecture);
    } else {
      detectedContentType = enhancedLecture.actualContentType || "video";
    }

    setPreviewMode(mode);
    setShowPreviewDropdown(false);
    setPreviewContentType(detectedContentType);

    setTimeout(() => {
      setShowVideoPreview(true);
    }, 50);
  };

  const isArticleContent = (): boolean => {
    return (
      !!(
        articleContent &&
        articleContent.text &&
        articleContent.text.trim() !== ""
      ) && !videoContent.selectedVideoDetails
    );
  };

  // Handle clicking outside preview dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!showPreviewDropdown) return;

      const dropdownElement = document.getElementById("preview-dropdown");
      const target = event.target as Node;

      if (dropdownElement && !dropdownElement.contains(target)) {
        setShowPreviewDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPreviewDropdown]);

  const VideoPreviewPage: React.FC = () => {
    const enhancedLecture = createEnhancedLectureForPreview();
    const enhancedSections = createEnhancedSections();

    const hasArticleContent =
      !!(
        articleContent &&
        articleContent.text &&
        articleContent.text.trim() !== ""
      ) && !videoContent.selectedVideoDetails;

    const [activeItemId] = useState<string>(lecture.id);
    const [activeItemType] = useState<string>(
      hasArticleContent
        ? "article"
        : previewContentType || enhancedLecture.actualContentType || "video"
    );

    if (previewMode === "student") {
      return (
        <StudentCoursePreview
          videoContent={videoContent}
          articleContent={articleContent}
          setShowVideoPreview={setShowVideoPreview}
          lecture={enhancedLecture}
          uploadedFiles={globalUploadedFiles}
          sourceCodeFiles={globalSourceCodeFiles}
          externalResources={globalExternalResources}
          section={{
            id: "all-sections",
            name: "All Sections",
            sections: enhancedSections,
          }}
        />
      );
    }

    const currentSection = enhancedSections.find(
      (section) => section.id === sectionId
    ) || {
      id: sectionId,
      name: "Section",
      lectures: [enhancedLecture],
      quizzes: [],
      assignments: [],
      codingExercises: [],
      isExpanded: true,
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

  return (
    <div className="p-4">
      {/* Selected Video Display */}
      {videoContent.selectedVideoDetails && (
        <div className="overflow-hidden border-b border-gray-400 mb-4">
          <div className="flex flex-row justify-between sm:flex-row">
            <div className="flex items-center py-3">
              <div className="w-20 h-16 bg-black rounded overflow-hidden mr-3 flex-shrink-0">
                <img
                  src="/thumbnail_default.png"
                  alt={videoContent.selectedVideoDetails.filename}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "thumbnail_default.png";
                  }}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {videoContent.selectedVideoDetails.filename}
                </h3>
                <p className="text-xs text-gray-500">
                  {videoContent.selectedVideoDetails.duration}
                </p>
                <button
                  onClick={onEditContent}
                  className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium flex items-center mt-1"
                >
                  <Edit3 className="w-3 h-3 mr-1" /> Edit Content
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-end items-center py-3">
              <div className="relative inline-flex gap-4" id="preview-dropdown">
                <button
                  onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
                  className="bg-[#6D28D2] text-white text-sm font-medium ml-16 px-4 py-1.5 rounded hover:bg-[#7D28D2] flex items-center"
                  type="button"
                >
                  Preview <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                {showPreviewDropdown && (
                  <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <ul>
                      <Link
                        href={`/preview/lecture/${courseId}/${sectionId}/${lecture.id}`}
                      >
                        <li>
                          <button
                            // onClick={() => handlePreviewSelection("student")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Instructor
                          </button>
                        </li>
                      </Link>

                      <Link
                        href={`/preview/lecture/${courseId}/${sectionId}/${lecture.id}`}
                      >
                        <li>
                          <button
                            // onClick={() => handlePreviewSelection("student")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Student
                          </button>
                        </li>
                      </Link>
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
                  onClick={onToggleDownloadable}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    videoContent.selectedVideoDetails.isDownloadable
                      ? "bg-[#6D28D2]"
                      : "bg-gray-400"
                  }`}
                  aria-pressed={
                    videoContent.selectedVideoDetails.isDownloadable
                  }
                  aria-label={
                    videoContent.selectedVideoDetails.isDownloadable
                      ? "Disable downloading"
                      : "Enable downloading"
                  }
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      videoContent.selectedVideoDetails.isDownloadable
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

      {/* Article Content Display */}
      {lecture.notes && !videoContent.selectedVideoDetails && (
        <div className="overflow-hidden border-b border-gray-400 mb-4">
          <div className="flex flex-row justify-between sm:flex-row items-start">
            <div className="flex items-center py-3">
              <div className="w-24 h-20 bg-black rounded overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center">
                <FileText size={60} className="text-white" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">Article</h3>
                <p className="text-xs text-gray-500">
                  {`${lecture.notes.length} characters`}
                </p>
                <button
                  onClick={() => {
                    onSetActiveContentType("article");
                    if (!isExpanded && onToggleContentSection) {
                      onToggleContentSection(sectionId, lecture.id);
                    }
                  }}
                  className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium flex items-center mt-1"
                >
                  <Edit3 className="w-3 h-3 mr-1" /> Edit Content
                </button>
                <button
                  onClick={() => {
                    // This would need to be handled by parent component
                    console.log("Replace with video clicked");
                  }}
                  className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium"
                >
                  Replace With Video
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-end items-start py-3">
              <div className="relative inline-flex gap-4" id="preview-dropdown">
                <button
                  onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
                  className="bg-[#6D28D2] text-white text-sm font-medium ml-16 px-4 py-1.5 rounded hover:bg-[#7D28D2] flex items-center"
                  type="button"
                >
                  Preview <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                {showPreviewDropdown && (
                  <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <ul>
                      <li>
                        <Link
                          href={`/preview/lecture/${courseId}/${sectionId}/${lecture.id}`}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Instructor
                          </button>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/preview/lecture/${courseId}/${sectionId}/${lecture.id}`}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Student
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lecture Description */}
      {lecture.description && (
        <div className="mb-4 border-b border-gray-400 pb-2">
          <div
            className="text-gray-800 text-sm pt-1 pr-1 hover:outline-1 hover:outline-gray-400 border-gray-300 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleDescriptionEditor) {
                onToggleDescriptionEditor(
                  sectionId,
                  lecture.id,
                  lecture.description || ""
                );
                descriptionExpansion?.open();
              }
            }}
            dangerouslySetInnerHTML={{ __html: lecture.description }}
          />
        </div>
      )}

      {/* Downloadable Materials */}
      {currentLectureUploadedFiles.length > 0 && (
        <div className="mb-4 border-b border-gray-400 pb-2">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            Downloadable materials
          </h3>
          {currentLectureUploadedFiles.map((file, index) => (
            <div
              key={`uploaded-${file.name}-${file.lectureId}-${index}`}
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

      {/* Source Code */}
      {currentLectureSourceCodeFiles.length > 0 && (
        <div className="mb-4 border-b border-gray-400 pb-2">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Source Code</h3>
          {currentLectureSourceCodeFiles.map((file, index) => (
            <div
              key={`source-code-${file.filename}-${file.lectureId}-${index}`}
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

      {/* External Resources */}
      {currentLectureExternalResources.length > 0 && (
        <div className="mb-4 border-b border-gray-400 pb-2">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            External Resources
          </h3>
          {currentLectureExternalResources.map((resource, index) => {
            const resourceTitle =
              typeof resource.title === "string"
                ? resource.title
                : resource.name || `Resource ${index + 1}`;

            return (
              <div
                key={`external-${resourceTitle}-${resource.lectureId}-${index}`}
                className="flex justify-between items-center py-1"
              >
                <div className="flex items-center text-gray-800">
                  <SquareArrowOutUpRight
                    size={13}
                    className="mr-1 text-gray-800"
                  />
                  <span className="text-sm text-gray-800">{resourceTitle}</span>
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

      {/* Description Button */}
      {!lecture.description && !isDescriptionSectionActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleDescriptionEditor) {
              onToggleDescriptionEditor(
                sectionId,
                lecture.id,
                lecture.description || ""
              );
            }
            descriptionExpansion?.open();
          }}
          className="flex items-center gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-bold">Description</span>
        </button>
      )}

      {/* Resource Button */}
      {!isResourceSectionActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleAddResourceModal) {
              onToggleAddResourceModal(sectionId, lecture.id);
            }
            resourceExpansion?.open();
            console.log("Hey");
          }}
          className={`flex items-center ${
            !lecture.description ? "mt-2" : ""
          } gap-2 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-[#6D28D2] font-medium border border-[#6D28D2] rounded-sm hover:bg-gray-50`}
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-bold">Resources</span>
        </button>
      )}

      {children}

      {/* Video Preview Modal */}
      {showVideoPreview && <VideoPreviewPage />}
    </div>
  );
};

export default LectureContentDisplay;

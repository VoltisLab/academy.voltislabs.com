"use client";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  Edit,
  Code,
  Search,
  FileDown,
  SquareArrowOutUpRight,
  X,
  FolderOpen,
} from "lucide-react";
import {
  Lecture,
  SourceCodeFile,
  ExternalResourceItem,
  ExternalResource,
  AttachedFile,
  EnhancedLecture,
  ContentTypeDetector,
} from "@/lib/types";
import { useParams } from "next/navigation";

// Define the ContentItemType properly
type ContentItemType =
  | "video"
  | "article"
  | "quiz"
  | "assignment"
  | "coding-exercise";

interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  duration?: string;
  hasResources?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  lectureResources?: {
    uploadedFiles: Array<{ name: string; size: string; lectureId: string }>;
    sourceCodeFiles: SourceCodeFile[];
    externalResources: ExternalResourceItem[];
  };
  description?: string;
  actualContentType?: string;
  hasVideoContent?: boolean;
  hasArticleContent?: boolean;
}

interface SectionWithItems {
  id: string;
  name: string;
  contentItems: ContentItem[];
  isExpanded: boolean;
  totalDuration: string;
  completedItems: number;
  totalItems: number;
}

interface StudentPreviewSidebarProps {
  currentLectureId: string;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectItem?: (
    itemId: string,
    itemType: string,
    courseId: string,
    sectionId: string
  ) => void;
  sections?: Array<{
    id: string;
    name: string;
    lectures?: Lecture[];
    quizzes?: Array<{
      title: string;
      id: string;
      name: string;
      description?: string;
      questions?: any[];
      duration?: string;
      contentType?: string;
    }>;
    assignments?: Array<{
      title: string;
      id: string;
      name: string;
      description?: string;
      duration?: string;
      contentType?: string;
    }>;
    codingExercises?: Array<{
      id: string;
      name: string;
      description?: string;
      duration?: string;
      contentType?: string;
    }>;
    isExpanded?: boolean;
  }>;
  uploadedFiles?: Array<{ name: string; size: string; lectureId?: string }>;
  sourceCodeFiles?: SourceCodeFile[];
  externalResources?: (ExternalResource | ExternalResourceItem)[];
}

const StudentPreviewSidebar: React.FC<StudentPreviewSidebarProps> = ({
  currentLectureId,
  setShowVideoPreview,
  sections = [],
  onSelectItem,
  // Remove these unused props for resource mapping
  // uploadedFiles = [],
  // sourceCodeFiles = [],
  // externalResources = [],
}) => {
  // State for managing which resource dropdowns are open
  const [openResourcesDropdowns, setOpenResourcesDropdowns] = useState<
    Record<string, boolean>
  >({});
  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  // State for processed sections with their items
  const [processedSections, setProcessedSections] = useState<
    SectionWithItems[]
  >([]);

  // Helper to convert ExternalResource to ExternalResourceItem
  const convertExternalResource = (
    resource: ExternalResource | ExternalResourceItem
  ): ExternalResourceItem => {
    if (typeof (resource as any).title === "string") {
      return resource as ExternalResourceItem;
    }
    const externalResource = resource as ExternalResource;
    return {
      title:
        typeof externalResource.title === "string"
          ? externalResource.title
          : externalResource.name,
      url: externalResource.url,
      name: externalResource.name,
      lectureId: externalResource.lectureId,
      filename: (externalResource as any).filename,
    };
  };

  const detectLectureContentType = (lecture: Lecture): string => {
    const enhancedLecture = lecture as EnhancedLecture;
    if (
      lecture.contentType === "quiz" ||
      enhancedLecture.actualContentType === "quiz"
    ) {
      return "quiz";
    }
    if (
      lecture.contentType === "assignment" ||
      enhancedLecture.actualContentType === "assignment"
    ) {
      return "assignment";
    }
    if (
      lecture.contentType === "coding-exercise" ||
      enhancedLecture.actualContentType === "coding-exercise"
    ) {
      return "coding-exercise";
    }
    if (ContentTypeDetector) {
      const detectedType =
        ContentTypeDetector.detectLectureContentType(enhancedLecture);
      if (detectedType !== "unknown" && detectedType !== "video") {
        return detectedType;
      }
    }
    if (
      enhancedLecture.hasArticleContent ||
      (enhancedLecture.articleContent &&
        enhancedLecture.articleContent.text &&
        enhancedLecture.articleContent.text.trim().length > 0)
    ) {
      return "article";
    }
    if (enhancedLecture.hasVideoContent || enhancedLecture.videoDetails) {
      return "video";
    }
    if (lecture.contentType === "article") {
      return "article";
    }
    return "video";
  };
  
  const params = useParams();
  const courseId = Array.isArray(params?.courseId)
    ? params?.courseId[0]
    : params?.courseId;
const type = params?.type;       

  const createResourceMap = () => {
    const resourcesByLectureId: Record<
      string,
      {
        uploadedFiles: Array<{ name: string; size: string; lectureId: string }>;
        sourceCodeFiles: SourceCodeFile[];
        externalResources: ExternalResourceItem[];
      }
    > = {};

    uploadedFiles.forEach((file) => {
      if (file.lectureId) {
        if (!resourcesByLectureId[file.lectureId]) {
          resourcesByLectureId[file.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        resourcesByLectureId[file.lectureId].uploadedFiles.push({
          name: file.name,
          size: file.size,
          lectureId: file.lectureId,
        });
      }
    });

    sourceCodeFiles.forEach((file) => {
      if (file.lectureId) {
        if (!resourcesByLectureId[file.lectureId]) {
          resourcesByLectureId[file.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        resourcesByLectureId[file.lectureId].sourceCodeFiles.push(file);
      }
    });

    externalResources.forEach((resource) => {
      if (resource.lectureId) {
        if (!resourcesByLectureId[resource.lectureId]) {
          resourcesByLectureId[resource.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        const convertedResource = convertExternalResource(resource);
        resourcesByLectureId[resource.lectureId].externalResources.push(
          convertedResource
        );
      }
    });

    return resourcesByLectureId;
  };


  useEffect(() => {
    if (!sections || sections.length === 0) {
      setProcessedSections([]);
      return;
    }

    // No need to build a global resource map; use lecture.resources directly
    const initialExpandedState: Record<string, boolean> = {};
    if (type === "lecture") {
      sections.forEach((section) => {
        initialExpandedState[section.id] = section.isExpanded !== true;
      });
    } else {
      sections.forEach((section) => {
        initialExpandedState[section.id] = section.isExpanded !== false;
      });
    }
    setExpandedSections(initialExpandedState);

    const formatted = sections.map((section, sectionIndex) => {
      const contentItems: ContentItem[] = [];
      // Process lectures
      if (section.lectures && section.lectures.length > 0) {
        section.lectures.forEach((lecture, index) => {
          const detectedContentType = detectLectureContentType(lecture);
          // --- Use lecture.resources directly ---
          const resources = lecture.resources || [];
          const lectureResources = {
            uploadedFiles: resources
              .filter((r: any) => r.type === "DOWNLOADABLE_FILES")
              .map((r: any) => ({
                name: r.title,
                size: "", // Add size if available
                lectureId: lecture.id,
              })),
            sourceCodeFiles: resources
              .filter((r: any) => r.type === "SOURCE_CODE")
              .map((r: any) => ({
                name: r.title,
                url: r.url,
                lectureId: lecture.id,
              })),
            externalResources: resources
              .filter((r: any) => r.type === "EXTERNAL_RESOURCES")
              .map((r: any) => ({
                title: r.title,
                name: r.title,
                url: r.url,
                lectureId: lecture.id,
              })),
          };
          const hasResources =
            lectureResources.uploadedFiles.length > 0 ||
            lectureResources.sourceCodeFiles.length > 0 ||
            lectureResources.externalResources.length > 0;

          const contentItem: ContentItem = {
            id: lecture.id,
            name: lecture.title || `Lecture ${index + 1}`,
            type: detectedContentType as ContentItemType,
            duration: lecture.duration || "2min",
            hasResources: hasResources,
            isCompleted: lecture.isCompleted || false,
            isActive: lecture.id === currentLectureId,
            lectureResources: lectureResources,
            description: lecture.description,
            actualContentType: detectedContentType,
            hasVideoContent: detectedContentType === "video",
            hasArticleContent: detectedContentType === "article",
          };
          contentItems.push(contentItem);
        });
      }

      if (section.quizzes && section.quizzes.length > 0) {
        section.quizzes.forEach((quiz, index) => {
          contentItems.push({
            id: quiz.id,
            name: quiz?.title || `Quiz ${index + 1}`,
            type: "quiz",
            duration: quiz.duration || "10min",
            isCompleted: false,
            isActive: quiz.id === currentLectureId,
            hasResources: false,
            lectureResources: {
              uploadedFiles: [],
              sourceCodeFiles: [],
              externalResources: [],
            },
            description: quiz.description,
            actualContentType: "quiz",
          });
        });
      }

      if (section.assignments && section.assignments.length > 0) {
        section.assignments.forEach((assignment, index) => {
          contentItems.push({
            id: assignment.id,
            name: assignment?.title || `Assignment ${index + 1}`,
            type: "assignment",
            duration: assignment.duration || "30min",
            isCompleted: false,
            isActive: assignment.id === currentLectureId,
            hasResources: false,
            lectureResources: {
              uploadedFiles: [],
              sourceCodeFiles: [],
              externalResources: [],
            },
            description: assignment.description,
            actualContentType: "assignment",
          });
        });
      }

      if (section.codingExercises && section.codingExercises.length > 0) {
        section.codingExercises.forEach((exercise, index) => {
          contentItems.push({
            id: exercise.id,
            name: exercise.name || `Coding Exercise ${index + 1}`,
            type: "coding-exercise",
            duration: exercise.duration || "15min",
            isCompleted: false,
            isActive: exercise.id === currentLectureId,
            hasResources: false,
            lectureResources: {
              uploadedFiles: [],
              sourceCodeFiles: [],
              externalResources: [],
            },
            description: exercise.description,
            actualContentType: "coding-exercise",
          });
        });
      }

      const totalItems = contentItems.length;
      const completedItems = contentItems.filter(
        (item) => item.isCompleted
      ).length;

      const totalDurationMinutes = contentItems.reduce((total, item) => {
        const durationMatch = item.duration?.match(/(\d+)/);
        if (durationMatch && durationMatch[1]) {
          return total + parseInt(durationMatch[1], 10);
        }
        return total + 2;
      }, 0);

      const processedSection = {
        id: section.id,
        name: section.name || "Untitled Section",
        contentItems,
        isExpanded: initialExpandedState[section.id],
        totalDuration: `${totalDurationMinutes}min`,
        completedItems,
        totalItems,
      };

      return processedSection;
    });

    setProcessedSections(formatted);
  }, [sections]);

  // Toggle a section's expanded state
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Toggle a resource dropdown
  const toggleResourcesDropdown = (itemId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setOpenResourcesDropdowns((prev) => {
      const newState = { ...prev };
      newState[itemId] = !prev[itemId];
      return newState;
    });
  };

  // --- THE FIX: Toggle completed status for a content item ---
  const handleToggleCompleted = (sectionId: string, itemId: string) => {
    setProcessedSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              contentItems: section.contentItems.map((item) =>
                item.id === itemId
                  ? { ...item, isCompleted: !item.isCompleted }
                  : item
              ),
            }
          : section
      )
    );
  };

  


  const handleSelectItem = (
    itemId: string,
    itemType: string,
    sectionId: string
  ) => {
    const typeToSend =
      itemType === "video" || itemType === "article"
        ? "lecture"
        : itemType;
    window.location.href = `/preview/${typeToSend}/${courseId}/${sectionId}/${itemId}`;
  };

  const getContentIcon = (item: ContentItem) => {
    const contentType = item.actualContentType || item.type;
    switch (contentType) {
      case "video":
        return <Play className="w-3 h-3 mr-1" />;
      case "article":
        return <FileText className="w-3 h-3 mr-1" />;
      case "quiz":
        return <Search className="w-3 h-3 mr-1" />;
      case "assignment":
        return <Edit className="w-3 h-3 mr-1" />;
      case "coding-exercise":
        return <Code className="w-3 h-3 mr-1" />;
      default:
        return <FileText className="w-3 h-3 mr-1" />;
    }
  };

  const ResourcesDropdown: React.FC<{
    item: ContentItem;
    isOpen: boolean;
    toggleOpen: (e?: React.MouseEvent) => void;
  }> = ({ item, isOpen, toggleOpen }) => {
    const contentType = item.actualContentType || item.type;
    if (contentType !== "video" && contentType !== "article") return null;

    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      toggleOpen(e);
    };

    const resources = item.lectureResources;
    if (!resources) return null;

    const hasUploadedFiles = resources.uploadedFiles.length > 0;
    const hasSourceCode = resources.sourceCodeFiles.length > 0;
    const hasExternalResources = resources.externalResources.length > 0;

    const totalResourceCount =
      resources.uploadedFiles.length +
      resources.sourceCodeFiles.length +
      resources.externalResources.length;

    if (totalResourceCount === 0) {
      return null;
    }

    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleButtonClick}
          className="flex items-center text-xs text-[#6D28D2] hover:text-[#6D28D2] border-[#6D28D2] border rounded px-2 py-1 font-medium"
          type="button"
        >
          <div className="flex flex-row gap-1 items-center">
            <FolderOpen size={14} />
            <span>Resources</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 ml-1" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-1" />
          )}
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 max-h-48 overflow-y-auto">
              {/* Uploaded Files */}
              {hasUploadedFiles && (
                <div className="mb-2">
                  {resources.uploadedFiles.map((file, index) => (
                    <div
                      key={`dl-${index}`}
                      className="flex items-center py-1 px-2 hover:bg-gray-50"
                    >
                      <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">
                        {file.name} {file.size && `(${file.size})`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Source Code Files */}
              {hasSourceCode && (
                <div className="mb-2">
                  {resources.sourceCodeFiles.map((file, index) => (
                    <div
                      key={`sc-${index}`}
                      className="flex items-center py-1 px-2 hover:bg-gray-50"
                    >
                      <Code className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">
                        {file.name || file.filename}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* External Resources */}
              {hasExternalResources && (
                <div>
                  {resources.externalResources.map((resource, index) => (
                    <div
                      key={`er-${index}`}
                      className="flex items-center py-1 px-2 hover:bg-gray-50"
                    >
                      <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                      <a
                        href={resource.url}
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {resource.title}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  console.log("pooooo", processedSections)
    console.log("pooooo2", sections)


  return (
    <div className="w-[24vw] bg-white border-l border-gray-200 flex flex-col h-full text-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 px-4 py-2">
        <h2 className="font-bold text-gray-700 text-sm">Course content</h2>
        <button
          onClick={() => setShowVideoPreview(false)}
          className="text-gray-500 hover:text-gray-700"
          type="button"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {processedSections.map((section, index) => (
          <div key={section.id} className="border-b border-gray-400 bg-gray-50">
            {/* Section header - clickable to toggle */}
            <div className="px-4 py-3">
              <div
                className="flex justify-between items-center mb-2 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="font-bold text-sm">
                  Section {index + 1}: {section.name}
                </h3>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {section.completedItems}/{section.totalItems} |{" "}
                {section.totalDuration}
              </p>
            </div>

            {/* Section content items - only show if expanded */}
            {expandedSections[section.id] &&
              section.contentItems &&
              section.contentItems.length > 0 && (
                <div>
                  {section.contentItems.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className={`px-4 py-2 ${
                        item.isActive
                          ? "bg-gray-200 "
                          : "hover:bg-gray-50 bg-white"
                      } cursor-pointer hover:bg-gray-200`}
                      onClick={() =>
                        handleSelectItem(item.id, item.type, section.id)
                      }
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          className="mt-1 mr-3"
                          checked={item.isCompleted}
                          onChange={e =>
                            handleToggleCompleted(section.id, item.id)
                          }
                          aria-label="Mark as complete"
                          onClick={e => e.stopPropagation()} // prevent checkbox click from triggering lecture selection
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {itemIndex + 1}. {item.name}
                            </p>
                          </div>
                          {(item.actualContentType === "video" ||
                            item.actualContentType === "article") && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs">
                                <span className="text-gray-800 font-bold">
                                  {getContentIcon(item)}
                                </span>
                                <span>{item.duration}</span>
                              </div>
                              {item.hasResources && (
                                <ResourcesDropdown
                                  item={item}
                                  isOpen={!!openResourcesDropdowns[item.id]}
                                  toggleOpen={e =>
                                    toggleResourcesDropdown(item.id, e)
                                  }
                                />
                              )}
                            </div>
                          )}
                          {item.actualContentType !== "video" &&
                            item.actualContentType !== "article" && (
                              <div className="flex items-center text-xs">
                                <span className="text-gray-800 font-bold">
                                  {getContentIcon(item)}
                                </span>
                                <span>{item.duration}</span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPreviewSidebar;

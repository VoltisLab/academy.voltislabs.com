import { useState, useEffect } from 'react';
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
  FolderOpen
} from "lucide-react";
import { Lecture, SourceCodeFile, ExternalResourceItem, AttachedFile, EnhancedLecture, ContentTypeDetector } from '@/lib/types';

// Define the ContentItemType properly
type ContentItemType = 'video' | 'article' | 'quiz' | 'assignment' | 'coding-exercise';

// Define the ContentItem interface
interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  duration?: string;
  hasResources?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  attachedFiles?: AttachedFile[];
  externalResources?: ExternalResourceItem[];
  sourceCodeFiles?: SourceCodeFile[];
  description?: string;
  // ENHANCED: Add content type detection info
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
  onSelectItem?: (itemId: string, itemType: string) => void;
  sections?: Array<{
    id: string;
    name: string;
    lectures?: Lecture[];
    quizzes?: Array<{
      id: string;
      name: string;
      description?: string;
      questions?: any[];
      duration?: string;
      contentType?: string;
    }>;
    assignments?: Array<{
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
  uploadedFiles?: Array<{name: string, size: string, lectureId?: string}>;
  sourceCodeFiles?: SourceCodeFile[];
  externalResources?: Array<{
    title: string | React.ReactNode;
    url: string;
    name: string;
    lectureId?: string;
  }>;
}

const StudentPreviewSidebar: React.FC<StudentPreviewSidebarProps> = ({
  currentLectureId,
  setShowVideoPreview,
  sections = [],
  uploadedFiles = [],
  sourceCodeFiles = [],
  externalResources = [],
  onSelectItem
}) => {
  // State for managing which resource dropdowns are open
  const [openResourcesDropdowns, setOpenResourcesDropdowns] = useState<Record<string, boolean>>({});
  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  // State for processed sections with their items
  const [processedSections, setProcessedSections] = useState<SectionWithItems[]>([]);

  // FIXED: Enhanced content type detector function for lectures
  const detectLectureContentType = (lecture: Lecture): string => {
    const enhancedLecture = lecture as EnhancedLecture;
    
    console.log(`🔍 Detecting content type for lecture ${lecture.id}:`, {
      lectureName: lecture.name,
      contentType: lecture.contentType,
      actualContentType: enhancedLecture.actualContentType,
      hasVideoContent: enhancedLecture.hasVideoContent,
      hasArticleContent: enhancedLecture.hasArticleContent,
      videoDetails: !!enhancedLecture.videoDetails,
      articleContent: !!enhancedLecture.articleContent?.text
    });
    
    // Priority 1: Check if it's explicitly a quiz
    if (lecture.contentType === 'quiz' || enhancedLecture.actualContentType === 'quiz') {
      return 'quiz';
    }
    
    // Priority 2: Check if it's explicitly an assignment
    if (lecture.contentType === 'assignment' || enhancedLecture.actualContentType === 'assignment') {
      return 'assignment';
    }
    
    // Priority 3: Check if it's explicitly a coding exercise
    if (lecture.contentType === 'coding-exercise' || enhancedLecture.actualContentType === 'coding-exercise') {
      return 'coding-exercise';
    }
    
    // Priority 4: Use ContentTypeDetector if available
    if (ContentTypeDetector) {
      const detectedType = ContentTypeDetector.detectLectureContentType(enhancedLecture);
      if (detectedType !== 'unknown' && detectedType !== 'video') {
        console.log(`✅ ContentTypeDetector result: ${detectedType}`);
        return detectedType;
      }
    }
    
    // Priority 5: Check enhanced lecture properties for article content
    if (enhancedLecture.hasArticleContent || 
        (enhancedLecture.articleContent && enhancedLecture.articleContent.text && enhancedLecture.articleContent.text.trim().length > 0)) {
      console.log(`✅ Detected as article based on content`);
      return 'article';
    }
    
    // Priority 6: Check enhanced lecture properties for video content
    if (enhancedLecture.hasVideoContent || enhancedLecture.videoDetails) {
      console.log(`✅ Detected as video based on content`);
      return 'video';
    }
    
    // Priority 7: Check explicit content type
    if (lecture.contentType === 'article') {
      console.log(`✅ Explicit article content type`);
      return 'article';
    }
    
    // Priority 8: Default to video for regular lectures
    console.log(`⚠️ Defaulting to video for lecture ${lecture.id}`);
    return 'video';
  };

  // FIXED: Better resource aggregation function
  const aggregateLectureResources = (lecture: Lecture) => {
    const enhancedLecture = lecture as EnhancedLecture;
    const lectureAttachedFiles: AttachedFile[] = [];
    const lectureSourceCodeFiles: SourceCodeFile[] = [];
    const lectureExternalResources: ExternalResourceItem[] = [];

    // Check if resources are embedded in the enhanced lecture
    if ((enhancedLecture as any).uploadedFiles && Array.isArray((enhancedLecture as any).uploadedFiles)) {
      (enhancedLecture as any).uploadedFiles.forEach((file: any) => {
        if (file && file.name) {
          lectureAttachedFiles.push({
            url: file.url || "",
            name: file.name,
            size: file.size || ""
          });
        }
      });
    }
    
    if ((enhancedLecture as any).sourceCodeFiles && Array.isArray((enhancedLecture as any).sourceCodeFiles)) {
      lectureSourceCodeFiles.push(...(enhancedLecture as any).sourceCodeFiles);
    }
    
    if ((enhancedLecture as any).externalResources && Array.isArray((enhancedLecture as any).externalResources)) {
      lectureExternalResources.push(...(enhancedLecture as any).externalResources);
    }

    // Also check passed resources as fallback/additional
    uploadedFiles.forEach(file => {
      if (file.lectureId === lecture.id && !lectureAttachedFiles.find(f => f.name === file.name)) {
        lectureAttachedFiles.push({
          url: "",
          name: file.name,
          size: file.size
        });
      }
    });

    sourceCodeFiles.forEach(file => {
      if (file.lectureId === lecture.id && !lectureSourceCodeFiles.find(f => (f.name || f.filename) === (file.name || file.filename))) {
        lectureSourceCodeFiles.push(file);
      }
    });

    externalResources.forEach(resource => {
      if (resource.lectureId === lecture.id && !lectureExternalResources.find(r => r.name === resource.name)) {
        lectureExternalResources.push({
          title: typeof resource.title === 'string' ? resource.title : resource.name,
          url: resource.url,
          name: resource.name
        });
      }
    });

    return {
      attachedFiles: lectureAttachedFiles,
      sourceCodeFiles: lectureSourceCodeFiles,
      externalResources: lectureExternalResources
    };
  };

  // Update the useEffect that processes sections
  useEffect(() => {
    console.log("StudentPreviewSidebar - Processing sections:", {
      sectionsCount: sections.length,
      uploadedFilesCount: uploadedFiles.length,
      sourceCodeFilesCount: sourceCodeFiles.length,
      externalResourcesCount: externalResources.length,
      currentLectureId
    });
    
    if (!sections || sections.length === 0) {
      console.log("StudentPreviewSidebar - No sections to process");
      setProcessedSections([]);
      return;
    }
    
    // Initialize expanded state for all sections
    const initialExpandedState: Record<string, boolean> = {};
    sections.forEach(section => {
      initialExpandedState[section.id] = section.isExpanded !== false;
    });
    setExpandedSections(initialExpandedState);

    // Process sections to format for sidebar display
    const formatted = sections.map((section, sectionIndex) => {
      console.log(`Processing section ${sectionIndex}:`, {
        sectionId: section.id,
        sectionName: section.name,
        lecturesCount: section.lectures?.length || 0
      });

      const contentItems: ContentItem[] = [];
      
      // Process lectures
      if (section.lectures && section.lectures.length > 0) {
        section.lectures.forEach((lecture, index) => {
          // FIXED: Use the improved content type detection
          const detectedContentType = detectLectureContentType(lecture);
          
          // FIXED: Use the improved resource aggregation
          const resources = aggregateLectureResources(lecture);
          const hasResources = resources.attachedFiles.length > 0 || 
                              resources.sourceCodeFiles.length > 0 || 
                              resources.externalResources.length > 0;

          console.log(`🎯 Processing lecture ${lecture.id}:`, {
            lectureId: lecture.id,
            lectureName: lecture.name,
            detectedContentType,
            hasResources,
            resourceCounts: {
              attachedFiles: resources.attachedFiles.length,
              sourceCodeFiles: resources.sourceCodeFiles.length,
              externalResources: resources.externalResources.length
            }
          });
          
          const contentItem: ContentItem = {
            id: lecture.id,
            name: lecture.name || lecture.title || `Lecture ${index + 1}`,
            type: detectedContentType as ContentItemType,
            duration: lecture.duration || '2min',
            hasResources: hasResources,
            isCompleted: lecture.isCompleted || false,
            isActive: lecture.id === currentLectureId,
            attachedFiles: resources.attachedFiles,
            externalResources: resources.externalResources,
            sourceCodeFiles: resources.sourceCodeFiles,
            description: lecture.description,
            actualContentType: detectedContentType,
            hasVideoContent: detectedContentType === 'video',
            hasArticleContent: detectedContentType === 'article'
          };
          
          contentItems.push(contentItem);
        });
      }
      
      // Process other content types (quizzes, assignments, etc.)
      if (section.quizzes && section.quizzes.length > 0) {
        section.quizzes.forEach((quiz, index) => {
          contentItems.push({
            id: quiz.id,
            name: quiz.name || `Quiz ${index + 1}`,
            type: 'quiz',
            duration: quiz.duration || '10min',
            isCompleted: false,
            isActive: quiz.id === currentLectureId,
            hasResources: false,
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: [],
            description: quiz.description,
            actualContentType: 'quiz'
          });
        });
      }
      
      if (section.assignments && section.assignments.length > 0) {
        section.assignments.forEach((assignment, index) => {
          contentItems.push({
            id: assignment.id,
            name: assignment.name || `Assignment ${index + 1}`,
            type: 'assignment',
            duration: assignment.duration || '30min',
            isCompleted: false,
            isActive: assignment.id === currentLectureId,
            hasResources: false,
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: [],
            description: assignment.description,
            actualContentType: 'assignment'
          });
        });
      }
      
      if (section.codingExercises && section.codingExercises.length > 0) {
        section.codingExercises.forEach((exercise, index) => {
          contentItems.push({
            id: exercise.id,
            name: exercise.name || `Coding Exercise ${index + 1}`,
            type: 'coding-exercise',
            duration: exercise.duration || '15min',
            isCompleted: false,
            isActive: exercise.id === currentLectureId,
            hasResources: false,
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: [],
            description: exercise.description,
            actualContentType: 'coding-exercise'
          });
        });
      }
      
      // Calculate totals
      const totalItems = contentItems.length;
      const completedItems = contentItems.filter(item => item.isCompleted).length;
      
      // Calculate total duration
      const totalDurationMinutes = contentItems.reduce((total, item) => {
        const durationMatch = item.duration?.match(/(\d+)/);
        if (durationMatch && durationMatch[1]) {
          return total + parseInt(durationMatch[1], 10);
        }
        return total + 2;
      }, 0);

      const processedSection = {
        id: section.id,
        name: section.name || 'Untitled Section',
        contentItems,
        isExpanded: initialExpandedState[section.id],
        totalDuration: `${totalDurationMinutes}min`,
        completedItems,
        totalItems
      };

      console.log(`✅ Processed section ${section.id} summary:`, {
        name: processedSection.name,
        totalItems: processedSection.contentItems.length,
        itemsWithResources: processedSection.contentItems.filter(item => item.hasResources).length,
        contentTypes: processedSection.contentItems.reduce((acc, item) => {
          acc[item.actualContentType || item.type] = (acc[item.actualContentType || item.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
      
      return processedSection;
    });
    
    setProcessedSections(formatted);
  }, [sections, currentLectureId, uploadedFiles, sourceCodeFiles, externalResources]);

  // Toggle a section's expanded state
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Toggle a resource dropdown
  const toggleResourcesDropdown = (itemId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setOpenResourcesDropdowns(prev => {
      const newState = { ...prev };
      newState[itemId] = !prev[itemId];
      return newState;
    });
  };

  // FIXED: Handle selecting an item with proper content type detection
  const handleSelectItem = (itemId: string) => {
    const selectedItem = processedSections
      .flatMap(section => section.contentItems)
      .find(item => item.id === itemId);
    
    if (selectedItem) {
      // FIXED: Use actualContentType for accurate content type
      const contentType = selectedItem.actualContentType || selectedItem.type;
      
      console.log('🎯 Selected item:', {
        itemId,
        itemName: selectedItem.name,
        originalType: selectedItem.type,
        actualContentType: selectedItem.actualContentType,
        finalContentType: contentType,
        hasVideoContent: selectedItem.hasVideoContent,
        hasArticleContent: selectedItem.hasArticleContent
      });
      
      if (onSelectItem) {
        onSelectItem(itemId, contentType);
      }
    } else {
      console.error('❌ Item not found:', itemId);
      setShowVideoPreview(false);
    }
  };

  // FIXED: Get icon for content type with better detection
  const getContentIcon = (item: ContentItem) => {
    const contentType = item.actualContentType || item.type;
    
    switch (contentType) {
      case 'video':
        return <Play className="w-3 h-3 mr-1" />;
      case 'article':
        return <FileText className="w-3 h-3 mr-1" />;
      case 'quiz':
        return <Search className="w-3 h-3 mr-1" />;
      case 'assignment':
        return <Edit className="w-3 h-3 mr-1" />;
      case 'coding-exercise':
        return <Code className="w-3 h-3 mr-1" />;
      default:
        return <FileText className="w-3 h-3 mr-1" />;
    }
  };

  // FIXED: Resources dropdown component with better resource detection
  const ResourcesDropdown: React.FC<{
    item: ContentItem;
    isOpen: boolean;
    toggleOpen: (e?: React.MouseEvent) => void;
  }> = ({ item, isOpen, toggleOpen }) => {
    // Show for lectures (video/article) with resources
    const contentType = item.actualContentType || item.type;
    if (contentType !== 'video' && contentType !== 'article') return null;
    
    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      toggleOpen(e);
    };
    
    // FIXED: More robust resource checking
    const hasAttachedFiles = item.attachedFiles && item.attachedFiles.length > 0;
    const hasSourceCode = item.sourceCodeFiles && item.sourceCodeFiles.length > 0;
    const hasExternalResources = item.externalResources && item.externalResources.length > 0;
    
    const totalResourceCount = (item.attachedFiles?.length || 0) + 
                             (item.sourceCodeFiles?.length || 0) + 
                             (item.externalResources?.length || 0);
    
    console.log(`🗂️ ResourcesDropdown for ${item.id} (${item.name}):`, {
      hasAttachedFiles,
      attachedFilesCount: item.attachedFiles?.length || 0,
      hasSourceCode,
      sourceCodeCount: item.sourceCodeFiles?.length || 0,
      hasExternalResources,
      externalResourcesCount: item.externalResources?.length || 0,
      totalResourceCount,
      isOpen,
      shouldShow: totalResourceCount > 0,
      hasResources: item.hasResources
    });
    
    // Don't show if no resources
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
          <div className='flex flex-row gap-1 items-center'>
            <FolderOpen size={14} />
            <span>Resources ({totalResourceCount})</span>
          </div>
          {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </button>
        
        {isOpen && (
          <div 
            className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 max-h-48 overflow-y-auto">
              {/* Attached Files */}
              {hasAttachedFiles && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Downloadable Files</div>
                  {item.attachedFiles!.map((file, index) => (
                    <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name} {file.size && `(${file.size})`}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Source Code Files */}
              {hasSourceCode && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Source Code</div>
                  {item.sourceCodeFiles!.map((file, index) => (
                    <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <Code className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name || file.filename}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* External Resources */}
              {hasExternalResources && (
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">External Links</div>
                  {item.externalResources!.map((resource, index) => (
                    <div key={`er-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                      <a 
                        href={resource.url} 
                        className="text-sm text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {typeof resource.title === 'string' ? resource.title : resource.name}
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

  return (
    <div className="w-[20vw] bg-white border-l border-gray-200 flex flex-col fixed top-0 right-0 h-full text-gray-700">
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
                <h3 className="font-bold text-sm">Section {index+1}: {section.name}</h3>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {section.completedItems}/{section.totalItems} | {section.totalDuration}
              </p>
            </div>
            
            {/* Section content items - only show if expanded */}
            {expandedSections[section.id] && section.contentItems.length > 0 && (
              <div className="">
                {section.contentItems.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className={`px-4 py-2 ${
                      item.isActive 
                        ? 'bg-gray-200 ' 
                        : 'hover:bg-gray-50 bg-white'
                    } cursor-pointer hover:bg-gray-200`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        className="mt-1 mr-3" 
                        checked={item.isCompleted}
                        onChange={() => {}}
                        aria-label="Mark as complete"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {itemIndex + 1}. {item.name}
                          </p>
                        </div>
                        {/* FIXED: Show duration and resources for video/article content */}
                        {(item.actualContentType === "video" || item.actualContentType === "article") && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs">
                              <span className='text-gray-800 font-bold'>{getContentIcon(item)}</span>
                              <span>{item.duration}</span>
                            </div>
                            
                            {/* FIXED: Show resources dropdown for lectures with resources */}
                            {item.hasResources && (
                              <ResourcesDropdown 
                                item={item}
                                isOpen={!!openResourcesDropdowns[item.id]}
                                toggleOpen={(e) => toggleResourcesDropdown(item.id, e)}
                              />
                            )}
                          </div>
                        )}
                        {/* For other content types, show basic info */}
                        {item.actualContentType !== "video" && item.actualContentType !== "article" && (
                          <div className="flex items-center text-xs">
                            <span className='text-gray-800 font-bold'>{getContentIcon(item)}</span>
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
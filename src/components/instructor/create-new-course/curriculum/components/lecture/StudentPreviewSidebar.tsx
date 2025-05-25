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
import { Lecture, SourceCodeFile, ExternalResourceItem, AttachedFile } from '@/lib/types';

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

  // Process the sections data when the component loads or sections change
useEffect(() => {
  console.log("StudentPreviewSidebar - Processing sections:", {
    sectionsCount: sections.length,
    sections: sections,
    uploadedFilesCount: uploadedFiles.length,
    sourceCodeFilesCount: sourceCodeFiles.length,
    externalResourcesCount: externalResources.length,
    currentLectureId
  });
  
  // Early return if no sections
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
      lecturesCount: section.lectures?.length || 0,
      quizzesCount: section.quizzes?.length || 0,
      assignmentsCount: section.assignments?.length || 0,
      codingExercisesCount: section.codingExercises?.length || 0
    });

    const contentItems: ContentItem[] = [];
    
    // Add regular lectures (video/article content)
    if (section.lectures && section.lectures.length > 0) {
      section.lectures.forEach((lecture, index) => {
        console.log(`Processing lecture ${lecture.id}:`, {
          lectureId: lecture.id,
          lectureName: lecture.name,
          lectureContentType: lecture.contentType
        });

        // Find resources for this lecture - FIXED EXTERNAL RESOURCES FILTER
        const lectureAttachedFiles: AttachedFile[] = uploadedFiles
          .filter(file => file.lectureId === lecture.id)
          .map(file => ({
            url: "", 
            name: file.name,
            size: file.size
          }));

        const lectureSourceCodeFiles = sourceCodeFiles.filter(file => file.lectureId === lecture.id);

        // FIXED: The bug was here - it was filtering by resource.lectureId === resource.lectureId instead of lecture.id
        const lectureExternalResources: ExternalResourceItem[] = externalResources
          .filter(resource => resource.lectureId === lecture.id) // FIXED THIS LINE
          .map(resource => ({
            title: typeof resource.title === 'string' ? resource.title : resource.name,
            url: resource.url,
            name: resource.name
          }));

        const hasResources = lectureAttachedFiles.length > 0 || 
                            lectureSourceCodeFiles.length > 0 || 
                            lectureExternalResources.length > 0;

        console.log(`Lecture ${lecture.id} resources:`, {
          attachedFiles: lectureAttachedFiles.length,
          sourceCodeFiles: lectureSourceCodeFiles.length,
          externalResources: lectureExternalResources.length,
          hasResources: hasResources
        });
        
        contentItems.push({
          id: lecture.id,
          name: lecture.name || lecture.title || `Lecture ${index + 1}`,
          type: (lecture.contentType as ContentItemType) || 'video',
          duration: lecture.duration || '2min',
          hasResources: hasResources,
          isCompleted: lecture.isCompleted || false,
          isActive: lecture.id === currentLectureId,
          attachedFiles: lectureAttachedFiles,
          externalResources: lectureExternalResources,
          sourceCodeFiles: lectureSourceCodeFiles,
          description: lecture.description
        });
      });
    }
    
    // Add quizzes
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
          description: quiz.description
        });
      });
    }
    
    // Add assignments
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
          description: assignment.description
        });
      });
    }
    
    // Add coding exercises
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
          description: exercise.description
        });
      });
    }
    
    // Calculate totals
    const totalItems = contentItems.length;
    const completedItems = contentItems.filter(item => item.isCompleted).length;
    
    // Calculate total duration in minutes
    const totalDurationMinutes = contentItems.reduce((total, item) => {
      const durationMatch = item.duration?.match(/(\d+)/);
      if (durationMatch && durationMatch[1]) {
        return total + parseInt(durationMatch[1], 10);
      }
      return total + 2; // Default duration
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

    console.log(`Processed section ${section.id}:`, {
      name: processedSection.name,
      contentItemsCount: processedSection.contentItems.length,
      isExpanded: processedSection.isExpanded,
      totalDuration: processedSection.totalDuration,
      contentItems: processedSection.contentItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        hasResources: item.hasResources,
        resourcesCount: {
          attached: item.attachedFiles?.length || 0,
          source: item.sourceCodeFiles?.length || 0,
          external: item.externalResources?.length || 0
        }
      }))
    });
    
    return processedSection;
  });
  
  console.log("StudentPreviewSidebar - Final processed sections:", formatted);
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

  // Handle selecting an item
  const handleSelectItem = (itemId: string) => {
    const selectedItem = processedSections
      .flatMap(section => section.contentItems)
      .find(item => item.id === itemId);
    
    if (selectedItem) {
      console.log('Selected item:', itemId, 'with type:', selectedItem.type);
      
      if (onSelectItem) {
        onSelectItem(itemId, selectedItem.type);
      }
    } else {
      console.error('Item not found:', itemId);
      setShowVideoPreview(false);
    }
  };

  // Get icon for content type
  const getContentIcon = (type: ContentItemType) => {
    switch (type) {
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

  // Resources dropdown component
  const ResourcesDropdown: React.FC<{
  item: ContentItem;
  isOpen: boolean;
  toggleOpen: (e?: React.MouseEvent) => void;
}> = ({ item, isOpen, toggleOpen }) => {
  // Only show for lectures (video/article) with resources
  if (item.type !== 'video' && item.type !== 'article') return null;
  if (!item.hasResources) return null;
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleOpen(e);
  };
  
  // Check if there are actually resources to display
  const hasAttachedFiles = item.attachedFiles && item.attachedFiles.length > 0;
  const hasSourceCode = item.sourceCodeFiles && item.sourceCodeFiles.length > 0;
  const hasExternalResources = item.externalResources && item.externalResources.length > 0;
  
  if (!hasAttachedFiles && !hasSourceCode && !hasExternalResources) {
    return null;
  }

  console.log(`ResourcesDropdown for ${item.id}:`, {
    hasAttachedFiles,
    attachedFilesCount: item.attachedFiles?.length || 0,
    hasSourceCode,
    sourceCodeCount: item.sourceCodeFiles?.length || 0,
    hasExternalResources,
    externalResourcesCount: item.externalResources?.length || 0,
    isOpen
  });
  
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={handleButtonClick}
        className="flex items-center text-xs text-[#6D28D2] hover:text-[#6D28D2] border-[#6D28D2] border rounded px-2 py-1 font-medium"
        type="button"
      >
        <div className=' flex flex-row gap-1'>
          <FolderOpen size={14} />
          <span>Resources</span>
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
            {hasAttachedFiles && item.attachedFiles!.map((file, index) => (
              <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">{file.name} {file.size && `(${file.size})`}</span>
              </div>
            ))}
            
            {/* Source Code Files */}
            {hasSourceCode && item.sourceCodeFiles!.map((file, index) => (
              <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                <Code className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">{file.name || file.filename}</span>
              </div>
            ))}
            
            {/* External Resources */}
            {hasExternalResources && item.externalResources!.map((resource, index) => (
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
  {processedSections.map((section, index )=> (
    <div key={section.id} className="border-b border-gray-400 bg-gray-50">
      {/* Section header - clickable to toggle */}
      <div className="px-4 py-3">
        <div 
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => toggleSection(section.id)}
        >
          <h3 className="font-bold text-sm">Section{index+1}: {section.name}</h3>
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
          {section.contentItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`px-4 py-2 ${
                item.isActive 
                  ? 'bg-gray-200 ' 
                  : 'hover:bg-gray-50 bg-white'
              } cursor-pointer hover:bg-gray-200  `}
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
                      {index + 1}. {item.name}
                    </p>
                  </div>
                  {item.type === "video" || item.type === "article" ? (
                    <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs ">
                      <span className='text-gray-800 font-bold'>{getContentIcon(item.type)}</span>
                      <span>{item.duration}</span>
                    </div>
                    
                    {/* Show resources dropdown for lectures with resources */}
                    {item.hasResources && (item.type === 'video' || item.type === 'article') && (
                      <ResourcesDropdown 
                        item={item}
                        isOpen={!!openResourcesDropdowns[item.id]}
                        toggleOpen={(e) => toggleResourcesDropdown(item.id, e)}
                      />
                    )}
                  </div>
                  ) : ""}
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
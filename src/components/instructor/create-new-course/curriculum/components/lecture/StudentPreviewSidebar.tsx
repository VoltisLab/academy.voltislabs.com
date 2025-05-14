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
  FolderOpen
} from "lucide-react";
import { Lecture, Section, SourceCodeFile, ExternalResourceItem, AttachedFile } from '@/lib/types';

// Define the ContentItemType properly
type ContentItemType = 'video' | 'article' | 'quiz' | 'assignment' | 'coding-exercise';

// Define the ContentItem interface that will be used throughout the component
interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  duration?: string;
  hasResources?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  // Resource references - these will be populated from props
  attachedFiles?: AttachedFile[];
  externalResources?: ExternalResourceItem[];
  sourceCodeFiles?: SourceCodeFile[];
}

interface SectionWithItems {
  id: string;
  name: string;
  contentItems: ContentItem[];
  isExpanded: boolean;
  totalDuration: string;
  completedItems: number;
}

interface StudentPreviewSidebarProps {
  currentLectureId: string;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectItem?: (itemId: string, itemType: string) => void;
  sections?: Array<{
    id: string;
    name: string;
    lectures: Lecture[];
    quizzes?: Array<{id: string, name: string}>;
    assignments?: Array<{id: string, name: string}>;
    codingExercises?: Array<{id: string, name: string}>;
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
  // State for managing which sections are expanded (default to true for all)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  // State for processed sections with their items
  const [processedSections, setProcessedSections] = useState<SectionWithItems[]>([]);

  // Process the sections data when the component loads or sections change
  useEffect(() => {
    // Initialize all sections as expanded
    const initialExpandedState: Record<string, boolean> = {};
    sections.forEach(section => {
      initialExpandedState[section.id] = true;
    });
    setExpandedSections(initialExpandedState);

    // Process sections to format for sidebar display
    const formatted = sections.map(section => {
      // Gather all content items for this section - only include what actually exists
      const contentItems: ContentItem[] = [];
      
      // Only add lectures if they exist
      if (section.lectures && section.lectures.length > 0) {
        section.lectures.forEach((lecture, index) => {
          // UPDATED APPROACH: If first lecture, include all resources without lectureId
          const isFirstLecture = index === 0;
          
          // Find attached files for this lecture from uploadedFiles
          const lectureAttachedFiles: AttachedFile[] = Array.isArray(uploadedFiles) 
            ? uploadedFiles
                .filter(file => {
                  // If lectureId exists, match it; otherwise, include all files for first lecture
                  return file.lectureId === lecture.id || (isFirstLecture && !file.lectureId);
                })
                .map(file => ({
                  url: "", // Since we don't have URLs in uploadedFiles
                  name: file.name,
                  size: file.size
                }))
            : [];

          // Find source code files for this lecture from sourceCodeFiles
          const lectureSourceCodeFiles = Array.isArray(sourceCodeFiles) 
            ? sourceCodeFiles.filter(file => {
                return file.lectureId === lecture.id || (isFirstLecture && !file.lectureId);
              })
            : [];

          // Find external resources for this lecture from externalResources
          const lectureExternalResources = Array.isArray(externalResources) 
            ? externalResources.filter(resource => {
                return resource.lectureId === lecture.id || (isFirstLecture && !resource.lectureId);
              })
            : [];

          // Check if this lecture has any resources
          const hasAttachedFiles = lectureAttachedFiles.length > 0;
          const hasSourceCodeFiles = lectureSourceCodeFiles.length > 0;
          const hasExternalResources = lectureExternalResources.length > 0;
          const hasResources = hasAttachedFiles || hasSourceCodeFiles || hasExternalResources;
          
          // Determine content type from the lecture
          let contentType: ContentItemType = (lecture.contentType as ContentItemType) || 'video';
          
          contentItems.push({
            id: lecture.id,
            name: lecture.name || `Lecture ${index + 1}`,
            type: contentType,
            duration: lecture.duration || '1min',
            hasResources: hasResources,
            isCompleted: lecture.isCompleted || false,
            isActive: lecture.id === currentLectureId,
            attachedFiles: lectureAttachedFiles,
            externalResources: lectureExternalResources,
            sourceCodeFiles: lectureSourceCodeFiles
          });
        });
      }
      
      // Only add quizzes if they exist
      if (section.quizzes && section.quizzes.length > 0) {
        section.quizzes.forEach((quiz, index) => {
          contentItems.push({
            id: quiz.id,
            name: quiz.name || `Quiz ${index + 1}`,
            type: 'quiz',
            duration: '10min',
            isCompleted: false,
            isActive: false,
            hasResources: false, // Quizzes don't have resources by default
            // FIXED: Don't add any resources to quizzes
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: []
          });
        });
      }
      
      // Only add assignments if they exist
      if (section.assignments && section.assignments.length > 0) {
        section.assignments.forEach((assignment, index) => {
          contentItems.push({
            id: assignment.id,
            name: assignment.name || `Assignment ${index + 1}`,
            type: 'assignment',
            duration: '30min',
            isCompleted: false,
            isActive: false,
            hasResources: false, // Assignments don't have resources by default
            // FIXED: Don't add any resources to assignments
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: []
          });
        });
      }
      
      // Only add coding exercises if they exist
      if (section.codingExercises && section.codingExercises.length > 0) {
        section.codingExercises.forEach((exercise, index) => {
          contentItems.push({
            id: exercise.id,
            name: exercise.name || `Coding Exercise ${index + 1}`,
            type: 'coding-exercise',
            duration: '15min',
            isCompleted: false,
            isActive: false,
            hasResources: false, // Coding exercises don't have resources by default
            // FIXED: Don't add any resources to coding exercises
            attachedFiles: [],
            externalResources: [],
            sourceCodeFiles: []
          });
        });
      }
      
      // Calculate total duration and completed items from the actual items
      const totalItems = contentItems.length;
      const completedItems = contentItems.filter(item => item.isCompleted).length;
      
      // Calculate total duration in minutes
      const totalDurationMinutes = contentItems.reduce((total, item) => {
        // Parse the duration string to extract minutes
        const durationMatch = item.duration?.match(/(\d+)min/);
        if (durationMatch && durationMatch[1]) {
          return total + parseInt(durationMatch[1], 10);
        }
        return total;
      }, 0);
      
      return {
        id: section.id,
        name: section.name || 'Untitled Section',
        contentItems,
        isExpanded: true,
        totalDuration: `${totalDurationMinutes}min`,
        completedItems
      };
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

  // Toggle a resource dropdown with proper event handling
  const toggleResourcesDropdown = (itemId: string, e?: React.MouseEvent) => {
    // Prevent any event bubbling to parent elements
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Force update with new object to ensure React detects the change
    setOpenResourcesDropdowns(prev => {
      const newState = { ...prev };
      newState[itemId] = !prev[itemId];
      return newState;
    });
  };

  // Handle selecting an item (when a user clicks on a lecture, quiz, etc.)
const handleSelectItem = (itemId: string) => {
  // Find the selected item
  const selectedItem = processedSections
    .flatMap(section => section.contentItems)
    .find(item => item.id === itemId);
  
  if (selectedItem) {
    console.log('Selected item:', itemId, 'with type:', selectedItem.type);
    
    // Always keep the preview window open regardless of item type
    
    // If we have a callback, use it
    if (onSelectItem) {
      onSelectItem(itemId, selectedItem.type);
    }
    // Remove the else clause that was closing the preview
  } else {
    console.error('Item not found:', itemId);
    // Only close the preview if the item wasn't found at all
    setShowVideoPreview(false);
  }
};

  // Define the ResourcesDropdown component with consolidated resources
  const ResourcesDropdown: React.FC<{
    item: ContentItem;
    isOpen: boolean;
    toggleOpen: (e?: React.MouseEvent) => void;
  }> = ({ item, isOpen, toggleOpen }) => {
    // Check if there are any actual resources to display
    const hasAttachedFiles = Array.isArray(item.attachedFiles) && item.attachedFiles.length > 0;
    const hasExternalResources = Array.isArray(item.externalResources) && item.externalResources.length > 0;
    const hasSourceCodeFiles = Array.isArray(item.sourceCodeFiles) && item.sourceCodeFiles.length > 0;
    
    console.log('ResourcesDropdown render:', {
      itemId: item.id,
      isOpen: isOpen,
      hasAttachedFiles,
      hasExternalResources,
      hasSourceCodeFiles,
      attachedFiles: item.attachedFiles,
      externalResources: item.externalResources,
      sourceCodeFiles: item.sourceCodeFiles
    });
    
    const hasAnyResources = hasAttachedFiles || hasExternalResources || hasSourceCodeFiles;
    
    // Don't render anything if there are no resources
    if (!hasAnyResources) return null;
    
    // Handler to stop propagation and toggle dropdown
    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      toggleOpen(e);
    };
    
    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={handleButtonClick}
          className="flex items-center border rounded-md text-sm text-purple-700 font-normal py-1 px-2"
          type="button"
        >
          <div className='flex items-center'>
            <FolderOpen className='mr-1 ' size={14} />
            <span>Resources</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
        
        {isOpen && (
          <div 
            className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {/* Show all resources in a single dropdown */}
              
              {/* Attached Files Section */}
              {hasAttachedFiles && (
                <div className="mb-2">
                  {item.attachedFiles && item.attachedFiles.map((file, index) => (
                    <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name || file.filename || 'File'}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Source Code Files Section */}
              {hasSourceCodeFiles && (
                <div className="mb-2">
                  {item.sourceCodeFiles && item.sourceCodeFiles.map((file, index) => (
                    <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <Code className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name || file.filename || 'Source Code'}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* External Resources Section */}
              {hasExternalResources && (
                <div>
                  {item.externalResources && item.externalResources.map((resource, index) => (
                    <div key={`er-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                      <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                      <a 
                        href={resource.url} 
                        className="text-sm text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {typeof resource.title === 'string' 
                          ? resource.title 
                          : (resource.name || 'External Resource')}
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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col fixed top-0 right-0 h-full">
      {/* Header with close button */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className="font-semibold">Course content</h2>
        <button 
          onClick={() => setShowVideoPreview(false)} 
          className="text-gray-500 hover:text-gray-700"
          type="button"
          aria-label="Close preview"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      
      {/* Lecture sections container - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {processedSections.map(section => (
          <div key={section.id}>
            {/* Section header */}
            <div className="p-4 border-b border-gray-200">
              <div 
                className="flex justify-between items-center mb-2 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="font-semibold">{section.name}</h3>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {section.completedItems}/{section.contentItems.length} | {section.totalDuration}
              </p>
            </div>
            
            {/* Section content items - only show if expanded and if there are items */}
            {expandedSections[section.id] && section.contentItems.length > 0 && (
              section.contentItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`p-4 ${item.isActive ? 'bg-gray-100 border-l-4 border-purple-600' : 'hover:bg-gray-50'} cursor-pointer`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      className="mt-1 mr-2" 
                      checked={item.isCompleted}
                      onChange={() => {}}
                      aria-label="Mark as complete"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{index + 1}. {item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          {item.type === 'video' && <Play className="w-3 h-3 mr-1" />}
                          {item.type === 'article' && <FileText className="w-3 h-3 mr-1" />}
                          {item.type === 'quiz' && <Search className="w-3 h-3 mr-1" />}
                          {item.type === 'assignment' && <Edit className="w-3 h-3 mr-1" />}
                          {item.type === 'coding-exercise' && <Code className="w-3 h-3 mr-1" />}
                          <span>{item.duration}</span>
                        </div>
                        
                        {/* Only show resources dropdown if the item has resources */}
                        {item.hasResources && (
                          <ResourcesDropdown 
                            item={item}
                            isOpen={!!openResourcesDropdowns[item.id]}
                            toggleOpen={(e) => toggleResourcesDropdown(item.id, e)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPreviewSidebar;
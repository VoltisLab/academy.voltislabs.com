// Update StudentPreviewSidebar to dynamically build content from actual section data

import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Edit, 
  Code,
  Search,
  SquareArrowOutUpRight,
  FileDown
} from "lucide-react";
import { Lecture, Section, SourceCodeFile, ExternalResource, AttachedFile } from '@/lib/types';

type ContentItemType = 'video' | 'article' | 'quiz' | 'assignment' | 'coding-exercise';

interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  duration?: string;
  hasResources?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  attachedFiles?: AttachedFile[];
  externalResources?: ExternalResource[];
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
  sections?: Array<{
    id: string;
    name: string;
    lectures: Lecture[];
    quizzes?: Array<{id: string, name: string}>;
    assignments?: Array<{id: string, name: string}>;
    codingExercises?: Array<{id: string, name: string}>;
  }>;
  uploadedFiles?: Array<{name: string, size: string}>;
  sourceCodeFiles?: SourceCodeFile[];
  externalResources?: ExternalResource[];
}

const StudentPreviewSidebar: React.FC<StudentPreviewSidebarProps> = ({
  currentLectureId,
  setShowVideoPreview,
  sections = [],
  uploadedFiles = [],
  sourceCodeFiles = [],
  externalResources = []
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
          // Check if the lecture actually has resources
          const hasAttachedFiles = lecture.attachedFiles && lecture.attachedFiles.length > 0;
          const hasExternalResources = lecture.externalResources && lecture.externalResources.length > 0;
          const hasSourceCodeFiles = sourceCodeFiles.some(file => file.lectureId === lecture.id);
          
          const hasResources = hasAttachedFiles || hasExternalResources || hasSourceCodeFiles;
          
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
            attachedFiles: lecture.attachedFiles || [],
            externalResources: lecture.externalResources || [],
            // Only include source code files that belong to this lecture
            sourceCodeFiles: sourceCodeFiles.filter(file => file.lectureId === lecture.id)
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
            hasResources: false // Quizzes typically don't have resources
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
            hasResources: false // Assignments typically don't have resources
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
            hasResources: false // Coding exercises typically don't have resources
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

  // Toggle a resource dropdown
  const toggleResourcesDropdown = (itemId: string) => {
    setOpenResourcesDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle selecting an item (when a user clicks on a lecture, quiz, etc.)
  const handleSelectItem = (itemId: string) => {
    // In a real app, you would navigate to the selected item
    console.log('Selected item:', itemId);
    // For now, we just close the preview if it's not the current item
    if (itemId !== currentLectureId) {
      setShowVideoPreview(false);
    }
  };

  // Component for resource dropdown - only shows if there are actual resources
  const ResourcesDropdown: React.FC<{
    item: ContentItem;
    isOpen: boolean;
    toggleOpen: () => void;
  }> = ({ item, isOpen, toggleOpen }) => {
    // Check if there are any actual resources to display
    const hasAttachedFiles = item.attachedFiles && item.attachedFiles.length > 0;
    const hasExternalResources = item.externalResources && item.externalResources.length > 0;
    const hasSourceCodeFiles = item.sourceCodeFiles && item.sourceCodeFiles.length > 0;
    
    const hasAnyResources = hasAttachedFiles || hasExternalResources || hasSourceCodeFiles;
    
    // Don't render anything if there are no resources
    if (!hasAnyResources) return null;
    
    return (
      <div className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
          className="flex items-center text-sm text-purple-600 font-medium py-1 px-2"
        >
          <span>Resources</span>
          {isOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-2">
              {/* Only show downloadable files if they exist */}
              {hasAttachedFiles && item.attachedFiles?.map((file, index) => (
                <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">{file.filename || file.name}</span>
                </div>
              ))}
              
              {/* Only show source code files if they exist */}
              {hasSourceCodeFiles && item.sourceCodeFiles?.map((file, index) => (
                <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <Code className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">{file.name || file.filename}</span>
                </div>
              ))}
              
              {/* Only show external resources if they exist */}
              {hasExternalResources && item.externalResources?.map((resource, index) => (
                <div key={`er-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                  <a 
                    href={resource.url} 
                    className="text-sm text-blue-600 hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {typeof resource.title === 'string' ? resource.title : 'External Resource'}
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
            
            {/* Section content items - only show if there are items */}
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
                            toggleOpen={() => toggleResourcesDropdown(item.id)}
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
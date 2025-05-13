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
import { Lecture, Section, SourceCodeFile, ExternalResourceItem } from '@/lib/types';

// Define the content item types that can appear in a section
type ContentItemType = 'video' | 'article' | 'quiz' | 'assignment' | 'coding-exercise';

// Interface for content items shown in the sidebar
interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  duration?: string;
  hasResources?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  resources?: {
    downloadableFiles: Array<{name: string, size: string}>;
    sourceCodeFiles: SourceCodeFile[];
    externalResources: ExternalResourceItem[];
  };
}

// Interface for section with its content items
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
  externalResources?: ExternalResourceItem[];
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
      // Gather all content items for this section
      const contentItems: ContentItem[] = [];
      
      // Add lectures
      if (section.lectures) {
        section.lectures.forEach((lecture, index) => {
          const hasResources = 
            lecture.resources?.downloadableFiles?.length > 0 || 
            lecture.resources?.sourceCodeFiles?.length > 0 || 
            lecture.resources?.externalResources?.length > 0 ||
            // If lecture doesn't have resources property, check the global resources
            (uploadedFiles.length > 0 || sourceCodeFiles.length > 0 || externalResources.length > 0);
          
          // Determine content type based on lecture.contentType
          let contentType: ContentItemType = 'video';
          if (lecture.contentType === 'article') contentType = 'article';
          
          contentItems.push({
            id: lecture.id,
            name: lecture.name || `Lecture ${index + 1}`,
            type: contentType,
            duration: '1min', // This would come from actual lecture data
            hasResources: hasResources,
            isCompleted: false, // This would come from user progress data
            isActive: lecture.id === currentLectureId,
            resources: {
              downloadableFiles: lecture.resources?.downloadableFiles || uploadedFiles,
              sourceCodeFiles: lecture.resources?.sourceCodeFiles || sourceCodeFiles,
              externalResources: lecture.resources?.externalResources || externalResources
            }
          });
        });
      }
      
      // Add quizzes
      if (section.quizzes) {
        section.quizzes.forEach((quiz, index) => {
          contentItems.push({
            id: quiz.id,
            name: quiz.name || `Quiz ${index + 1}`,
            type: 'quiz',
            duration: '10min',
            isCompleted: false,
            isActive: false
          });
        });
      }
      
      // Add assignments
      if (section.assignments) {
        section.assignments.forEach((assignment, index) => {
          contentItems.push({
            id: assignment.id,
            name: assignment.name || `Assignment ${index + 1}`,
            type: 'assignment',
            duration: '30min',
            isCompleted: false,
            isActive: false
          });
        });
      }
      
      // Add coding exercises
      if (section.codingExercises) {
        section.codingExercises.forEach((exercise, index) => {
          contentItems.push({
            id: exercise.id,
            name: exercise.name || `Coding Exercise ${index + 1}`,
            type: 'coding-exercise',
            duration: '15min',
            isCompleted: false,
            isActive: false
          });
        });
      }
      
      // Calculate total duration and completed items
      const totalItems = contentItems.length;
      const completedItems = contentItems.filter(item => item.isCompleted).length;
      
      return {
        id: section.id,
        name: section.name || 'Untitled Section',
        contentItems,
        isExpanded: true, // Default to expanded
        totalDuration: `${totalItems}min`, // This would be calculated from actual item durations
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
    // For now, we just close the preview
    if (itemId !== currentLectureId) {
      setShowVideoPreview(false);
    }
  };

  // Component for resource dropdown
  const ResourcesDropdown: React.FC<{
    resources: {
      downloadableFiles: Array<{name: string, size: string}>;
      sourceCodeFiles: SourceCodeFile[];
      externalResources: ExternalResourceItem[];
    };
    isOpen: boolean;
    toggleOpen: () => void;
  }> = ({ resources, isOpen, toggleOpen }) => {
    const hasResources = 
      resources.downloadableFiles.length > 0 || 
      resources.sourceCodeFiles.length > 0 || 
      resources.externalResources.length > 0;
      
    if (!hasResources) return null;
    
    return (
      <div className="relative">
        <button 
          onClick={toggleOpen}
          className="flex items-center text-sm text-purple-600 font-medium py-1 px-2"
        >
          <span>Resources</span>
          {isOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-2">
              {resources.downloadableFiles.map((file, index) => (
                <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">{file.name}</span>
                </div>
              ))}
              
              {resources.sourceCodeFiles.map((file, index) => (
                <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <Code className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm">{file.name}</span>
                </div>
              ))}
              
              {resources.externalResources.map((resource, index) => (
                <div key={`er-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                  <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                  <a href={resource.url} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{resource.title}</a>
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
            
            {/* Section content items */}
            {expandedSections[section.id] && section.contentItems.map((item, index) => (
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
                      
                      {item.hasResources && (
                        <div>
                          <ResourcesDropdown 
                            resources={item.resources || {
                              downloadableFiles: [],
                              sourceCodeFiles: [],
                              externalResources: []
                            }}
                            isOpen={!!openResourcesDropdowns[item.id]}
                            toggleOpen={() => toggleResourcesDropdown(item.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPreviewSidebar;
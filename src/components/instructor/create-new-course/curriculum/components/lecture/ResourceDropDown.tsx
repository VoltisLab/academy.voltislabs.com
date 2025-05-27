import React from 'react';
import { ChevronDown, FileDown, FileText, SquareArrowOutUpRight } from 'lucide-react';
import { ResourcesData } from '@/lib/types';

interface ResourcesDropdownProps {
  resources: ResourcesData; // Individual lecture resources
  isOpen: boolean;
  toggleOpen: () => void;
  sectionResources: ResourcesData; // Section-wide resources (not used in display)
}

const ResourcesDropdown: React.FC<ResourcesDropdownProps> = ({ 
  resources, // Use this for individual lecture resources
  isOpen, 
  toggleOpen, 
  sectionResources // Remove this from the logic below
}) => {
  // FIXED: Check individual lecture resources, not section resources
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
        {isOpen ? (
          <ChevronDown className="w-4 h-4 ml-1 transform rotate-180" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-2">
            {/* FIXED: Use individual lecture resources, not section resources */}
            {resources.downloadableFiles.map((file, index) => (
              <div key={`dl-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                <FileDown className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
            
            {resources.sourceCodeFiles.map((file, index) => (
              <div key={`sc-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
            
            {resources.externalResources.map((resource, index) => (
              <div key={`er-${index}`} className="flex items-center py-1 px-2 hover:bg-gray-50">
                <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
                <a 
                  href={resource.url} 
                  className="text-sm text-blue-600 hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {resource.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesDropdown;
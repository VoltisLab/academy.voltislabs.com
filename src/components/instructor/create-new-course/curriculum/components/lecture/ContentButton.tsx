// Fix for ContentButton in LectureItem component

import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, FileText } from 'lucide-react';
import { ContentItemType, Lecture, Section } from '@/lib/types';

/**
 * Determines if a lecture already has video or article content
 * @param lecture The lecture to check
 * @returns boolean indicating if the lecture already has content
 */
export const hasExistingContent = (lecture: Lecture): boolean => {
  // Check if lecture has videos
  const hasVideoContent = Array.isArray(lecture.videos) && lecture.videos.length > 0;
  
  // Check if lecture has article content
  const hasArticleContent = lecture.contentType === 'article';
  
  return hasVideoContent || hasArticleContent;
};

interface ContentButtonProps {
  section: Section;
  lecture: Lecture;
  onContentTypeSelect: (type: ContentItemType) => void;
}

const ContentButton: React.FC<ContentButtonProps> = ({ 
  section, 
  lecture, 
  onContentTypeSelect 
}) => {
  const [showContentDropdown, setShowContentDropdown] = useState<boolean>(false);
  
  // If lecture already has content, don't show the button
  if (hasExistingContent(lecture)) {
    return null;
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-1 text-sm text-purple-700 font-medium py-1 px-2 border border-purple-700 rounded hover:bg-purple-50"
        onClick={() => setShowContentDropdown(!showContentDropdown)}
      >
        <span>Content</span>
        {showContentDropdown ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {showContentDropdown && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg">
          <div className="py-1">
            <button
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onContentTypeSelect('video');
                setShowContentDropdown(false);
              }}
            >
              <div className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                <span>Video</span>
              </div>
            </button>
            <button
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onContentTypeSelect('article');
                setShowContentDropdown(false);
              }}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span>Article</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentButton;
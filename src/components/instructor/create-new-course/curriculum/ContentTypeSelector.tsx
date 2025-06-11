import React from 'react';
import { X, PlayCircle, FileText, List, Code, BookOpen } from 'lucide-react';
import { ContentItemType } from '@/lib/types';

interface ContentTypeSelectorProps {
  sectionId: string;
  onSelect: (sectionId: string, contentType: ContentItemType) => void;
  onClose: () => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  sectionId,
  onSelect,
  onClose
}) => {
  return (
    <div className="absolute z-30 bg-white rounded-lg shadow-lg border border-gray-200 mt-2 p-2 w-64">
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <h4 className="text-sm font-semibold">Select content type</h4>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onSelect(sectionId, 'video')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <PlayCircle className="w-6 h-6 text-blue-600 mb-1" />
          <span className="text-xs font-medium">Video</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'article')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-6 h-6 text-green-600 mb-1" />
          <span className="text-xs font-medium">Article</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'quiz')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <List className="w-6 h-6 text-orange-600 mb-1" />
          <span className="text-xs font-medium">Quiz</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'coding-exercise')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <Code className="w-6 h-6 text-purple-600 mb-1" />
          <span className="text-xs font-medium">Coding</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'assignment')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-6 h-6 text-indigo-600 mb-1" />
          <span className="text-xs font-medium">Assignment</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'practice')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="w-6 h-6 text-teal-600 mb-1" />
          <span className="text-xs font-medium">Practice</span>
        </button>
        <button 
          onClick={() => onSelect(sectionId, 'role-play')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors relative"
        >
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xxs px-1 rounded">Beta</div>
          <FileText className="w-6 h-6 text-red-600 mb-1" />
          <span className="text-xs font-medium">Role Play</span>
        </button>
      </div>
    </div>
  );
};
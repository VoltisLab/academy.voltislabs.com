import React from 'react';
import { Plus } from 'lucide-react';
import { ContentItemType } from '@/lib/types';

interface ActionButtonsProps {
  sectionId: string;
  onAddLecture: (sectionId: string, contentType: ContentItemType) => void;
  onShowTypeSelector: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  sectionId,
  onAddLecture,
  onShowTypeSelector
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowTypeSelector();
        }}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Lecture
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'quiz')}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Quiz
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'coding-exercise')}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Coding Exercise
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'practice')}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Practice...
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'assignment')}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Assignment
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'role-play')}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 relative"
      >
        <div className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs px-1 rounded">Beta</div>
        <Plus className="w-4 h-4 mr-1" />
        Role Play
      </button>
    </div>
  );
};
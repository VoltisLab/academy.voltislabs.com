// Components/AddLectureButton.tsx
"use client";
import React, { useState } from 'react';
import { 
  Plus, Code, FileText, List, BookOpen, PlayCircle, X
} from "lucide-react";
import { ContentItemType } from '@/lib/types';

// Export this interface to be reused in SectionItem
export interface ContentTypeSelectorProps {
  sectionId: string;
  onClose: () => void;
  onAddContent: (sectionId: string, contentType: ContentItemType) => void;
}

// Export the component to be reused in SectionItem
export function ContentTypeSelector({ sectionId, onClose, onAddContent }: ContentTypeSelectorProps) {
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
          onClick={() => onAddContent(sectionId, 'video')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <PlayCircle className="w-6 h-6 text-blue-600 mb-1" />
          <span className="text-xs font-medium">Video</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'article')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-6 h-6 text-green-600 mb-1" />
          <span className="text-xs font-medium">Article</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'quiz')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <List className="w-6 h-6 text-orange-600 mb-1" />
          <span className="text-xs font-medium">Quiz</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'coding-exercise')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <Code className="w-6 h-6 text-purple-600 mb-1" />
          <span className="text-xs font-medium">Coding</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'assignment')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-6 h-6 text-indigo-600 mb-1" />
          <span className="text-xs font-medium">Assignment</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'practice')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="w-6 h-6 text-teal-600 mb-1" />
          <span className="text-xs font-medium">Practice</span>
        </button>
        <button 
          onClick={() => onAddContent(sectionId, 'role-play')}
          className="flex flex-col items-center justify-center p-3 rounded-md border hover:bg-gray-50 transition-colors relative"
        >
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xxs px-1 rounded">Beta</div>
          <FileText className="w-6 h-6 text-red-600 mb-1" />
          <span className="text-xs font-medium">Role Play</span>
        </button>
      </div>
    </div>
  );
}

interface AddLectureButtonsProps {
  sectionId: string;
  addLecture: (sectionId: string, contentType: ContentItemType) => void;
}

export default function AddLectureButtons({ sectionId, addLecture }: AddLectureButtonsProps) {
  const [showContentTypeSelector, setShowContentTypeSelector] = useState<boolean>(false);

  return (
    <div className="mt-4 border border-dashed border-gray-300 rounded-lg p-4 relative">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowContentTypeSelector(true);
          }}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Lecture
        </button>
        <button
          onClick={() => addLecture(sectionId, 'quiz')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Quiz
        </button>
        <button
          onClick={() => addLecture(sectionId, 'coding-exercise')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Coding Exercise
        </button>
        <button
          onClick={() => addLecture(sectionId, 'practice')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Practice...
        </button>
        <button
          onClick={() => addLecture(sectionId, 'assignment')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Assignment
        </button>
        <button
          onClick={() => addLecture(sectionId, 'role-play')}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 relative"
        >
          <div className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs px-1 rounded">Beta</div>
          <Plus className="w-4 h-4 mr-1" />
          Role Play
        </button>
      </div>
      
      {showContentTypeSelector && (
        <ContentTypeSelector 
          sectionId={sectionId}
          onClose={() => setShowContentTypeSelector(false)}
          onAddContent={(sectionId, contentType) => {
            addLecture(sectionId, contentType);
            setShowContentTypeSelector(false);
          }}
        />
      )}
    </div>
  );
}
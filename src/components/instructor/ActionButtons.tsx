"use client";
import React, { useState } from 'react';
import { Plus, X, Code } from 'lucide-react';
import { ContentItemType } from '@/lib/types';

interface ActionButtonsProps {
  sectionId: string;
  onAddLecture: (sectionId: string, contentType: ContentItemType, title?: string) => void;
  onShowTypeSelector: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  sectionId,
  onAddLecture,
  onShowTypeSelector
}) => {
  const [showLectureForm, setShowLectureForm] = useState<boolean>(false);
  const [lectureTitle, setLectureTitle] = useState<string>("");

  const handleAddLecture = () => {
    if (lectureTitle.trim()) {
      // Make sure we're passing the title as the third argument explicitly
      onAddLecture(sectionId, 'video', lectureTitle.trim());
      setShowLectureForm(false);
      setLectureTitle("");
    }
  };

  const handleCancel = () => {
    setShowLectureForm(false);
    setLectureTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && lectureTitle.trim()) {
      e.preventDefault(); // Prevent form submission if inside a form
      handleAddLecture();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (showLectureForm) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium">New Lecture:</h3>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a Title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={80}
            autoFocus
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {lectureTitle.length}/80
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddLecture}
            disabled={!lectureTitle.trim()}
            className={`xl:px-4 px-2 xl:py-2 py-1 ${!lectureTitle.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            Add Lecture
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 bg-white px-2 border border-gray-400 border-dashed">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowLectureForm(true);
        }}
        className="inline-flex items-center text-xs font-medium rounded-md text-[#6D28D2] p-1 m-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="w-3 h-3 mr-1" />
        Lecture
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'quiz')}
        className="inline-flex items-center text-xs font-medium rounded-md text-[#6D28D2] p-1 m-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Quiz
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'coding-exercise')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Coding Exercise
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'practice')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Practice
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'assignment')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        Assignment
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'role-play')}
        className="inline-flex items-center text-xs font-medium m-1 text-[#6D28D2] rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 relative"
      >
        <div className="absolute top-1 left-20 bg-indigo-200 text-black text-xs px-1 rounded">Beta</div>
        <Plus className="w-4 h-4 mr-1" />
        Role Play
      </button>
    </div>
  );
};
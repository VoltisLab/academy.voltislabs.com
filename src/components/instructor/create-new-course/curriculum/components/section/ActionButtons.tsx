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
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 ">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-800 mb-3">New Lecture:</h3>
          <div className="mb-4 w-[87%] relative">
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a Title"
              className="w-full border border-gray-300 rounded px-3 py-1 pr-10 focus:outline-none  focus:border-[#6D28D2]"
              maxLength={80}
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-gray-500">
              {80 - lectureTitle.length}
            </div>
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
            className={`xl:px-4 px-2 xl:py-2 py-1 bg-[#6D28D2] hover:bg-[#7D28D2] text-white rounded-md focus:outline-none  focus:ring-[#6D28D2]`}
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
        className="inline-flex items-center text-xs font-medium rounded-md text-[#6D28D2] p-1 m-1 hover:bg-gray-200 focus:outline-none "
      >
        <Plus className="w-3 h-3 mr-1" />
        Lecture
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'quiz')}
        className="inline-flex items-center text-xs font-medium rounded-md text-[#6D28D2] p-1 m-1 hover:bg-gray-200 focus:outline-none  "
      >
        <Plus className="w-3 h-3 mr-1" />
        Quiz
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'coding-exercise')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none "
      >
        <Plus className="w-3 h-3 mr-1" />
        Coding Exercise
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'practice')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] cursor-not-allowed rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none "
      disabled
      >
        <Plus className="w-3 h-3 mr-1" />
        Practice
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'assignment')}
        className="inline-flex items-center text-xs font-medium text-[#6D28D2] rounded-md p-1 m-1 hover:bg-gray-200 focus:outline-none "
      >
        <Plus className="w-3 h-3 mr-1" />
        Assignment
      </button>
      <button
        onClick={() => onAddLecture(sectionId, 'role-play')}
        className="inline-flex items-center text-xs font-medium m-1 text-[#6D28D2] cursor-not-allowed rounded-md hover:bg-gray-200 focus:outline-none  relative"
      disabled
      >
        <div className="absolute top-1 left-20 bg-indigo-200 text-black text-xs px-1 rounded">Beta</div>
        <Plus className="w-3 h-3 mr-1" />
        Role Play
      </button>
    </div>
  );
};
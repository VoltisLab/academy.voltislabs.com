"use client";
import React, { useState, useRef } from 'react';
import { Edit3, Trash2, ChevronUp, ChevronDown, Move, Code, ExternalLink } from 'lucide-react';
import { Lecture } from '@/lib/types';
import CodeEditorComponent from '../code/CodeEditor';

interface PracticeItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (sectionId: string, lectureId: string, newName: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (sectionId: string, lectureId: string, direction: 'up' | 'down') => void;
  savePracticeCode?: (sectionId: string, lectureId: string, code: string, language: string) => void;
  handleDragStart: (e: React.DragEvent, sectionId: string, lectureId?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  isDragging: boolean;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
  allSections: any[]
}

const PracticeItem: React.FC<PracticeItemProps> = ({
  lecture,
  lectureIndex,
  totalLectures,
  sectionId,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  moveLecture,
  savePracticeCode,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDragLeave,
  isDragging,
  draggedLecture,
  dragTarget,
  allSections = []
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Toggle the lecture expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Start editing the lecture name
  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLectureId(lecture.id);
    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 0);
  };

  // Stop editing the lecture name
  const stopEditing = () => {
    setEditingLectureId(null);
  };

  // Handle opening the code editor
  const openCodeEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditorOpen(true);
  };

  // Handle saving code
  const handleSaveCode = (sectionId: string, lectureId: string, code: string, language: string) => {
    if (savePracticeCode) {
      savePracticeCode(sectionId, lectureId, code, language);
    }
  };

  // Determine if this item is being dragged
  const isBeingDragged = draggedLecture === lecture.id;
  
  // Determine if this is a drop target
  const isDropTarget = 
    dragTarget?.sectionId === sectionId && 
    dragTarget?.lectureId === lecture.id;

  return (
    <>
      <div
        className={`mb-2 rounded-lg overflow-hidden bg-white border ${
          isBeingDragged ? 'opacity-50' : ''
        } ${
          isDropTarget ? 'border-2 border-indigo-500' : 'border-gray-200'
        } ${
          isExpanded ? 'shadow-md' : ''
        }`}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className="flex justify-between items-center p-3 bg-purple-50 cursor-pointer"
          onClick={toggleExpansion}
        >
          <div className="flex items-center space-x-3 flex-1">
            <Move className="w-5 h-5 text-gray-400 cursor-move" />
            <Code className="text-purple-500 w-5 h-5" />
            {editingLectureId === lecture.id ? (
              <input
                ref={nameInputRef}
                type="text"
                value={lecture.name || ''}
                onChange={(e) => updateLectureName(sectionId, lecture.id, e.target.value)}
                onBlur={stopEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    stopEditing();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <span className="font-medium text-gray-800 flex-1 truncate">
                {lecture.name || "Coding Practice"}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Show edit and delete buttons on hover */}
            {isHovering && (
              <>
                <button
                  onClick={(e) => startEditing(e)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLecture(sectionId, lecture.id);
                  }}
                  className="text-gray-500 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            
            {/* Open code editor button - always visible */}
            <button
              onClick={openCodeEditor}
              className="text-blue-500 hover:text-blue-700 p-1"
              title="Open code editor"
            >
              <Code className="w-4 h-4" />
            </button>
            
            {/* Move up/down buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, 'up');
              }}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={lectureIndex === 0}
            >
              <ChevronUp className={`w-4 h-4 ${lectureIndex === 0 ? 'opacity-50' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, 'down');
              }}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={lectureIndex === totalLectures - 1}
            >
              <ChevronDown className={`w-4 h-4 ${lectureIndex === totalLectures - 1 ? 'opacity-50' : ''}`} />
            </button>
            
            {/* Toggle expansion chevron */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
        
        {/* Expanded content */}
        {isExpanded && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {lecture.name || "Coding Practice"}
              </h3>
              
              {lecture.description ? (
                <div className="text-gray-700 mb-4">
                  {lecture.description}
                </div>
              ) : (
                <div className="text-gray-500 italic mb-4">
                  No description provided for this practice exercise.
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
                <button
                  onClick={openCodeEditor}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Start Coding
                </button>
                
                {lecture.externalResources && lecture.externalResources.length > 0 && (
                  <a
                    href={lecture.externalResources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Resource
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Code Editor Modal */}
      <CodeEditorComponent
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialCode={lecture.code || ''}
        language={lecture.codeLanguage || 'javascript'}
        title={`${lecture.name || 'Practice'} - Code Editor`}
        instructions={lecture.description}
        sectionId={sectionId}
        lectureId={lecture.id}
        onSaveCode={handleSaveCode}
      />
    </>
  );
};

export default PracticeItem;
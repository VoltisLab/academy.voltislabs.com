"use client";
import React, { useRef, useEffect, useState } from 'react';
import { ContentItemType, Lecture, ContentType } from '@/lib/types';
import { 
  Plus, Trash2, Edit3, ChevronDown, ChevronUp, Move, Search, X, FileText, Upload, Library
} from "lucide-react";

interface LectureItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (sectionId: string, lectureId: string, newName: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (sectionId: string, lectureId: string, direction: 'up' | 'down') => void;
  toggleContentSection: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor: (sectionId: string, lectureId: string, currentText: string) => void;
  activeContentSection: {sectionId: string, lectureId: string} | null;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, sectionId: string, lectureId?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  addLecture?: (sectionId: string, contentType: ContentItemType) => string;
  children?: React.ReactNode;
}

export default function LectureItem({
  lecture,
  lectureIndex,
  totalLectures,
  sectionId,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  moveLecture,
  toggleContentSection,
  toggleAddResourceModal,
  toggleDescriptionEditor,
  activeContentSection,
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDrop,
  addLecture,
  children
}: LectureItemProps) {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeContentType, setActiveContentType] = useState<ContentItemType | null>(null);

  // Debug information for the lecture prop
  useEffect(() => {
    console.log("LectureItem rendered with lecture:", lecture);
  }, [lecture]);

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  const startEditingLecture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLectureId(lecture.id);
  };

  // Determine lecture type label based on contentType
  const getLectureTypeLabel = () => {
    switch (lecture.contentType) {
      case 'video': return 'Curriculum';
      case 'article': return 'Article';
      case 'quiz': return 'Quiz';
      case 'coding-exercise': return 'Coding Exercise';
      case 'assignment': return 'Assignment';
      case 'practice': return 'Practice';
      case 'role-play': return 'Role Play';
      default: return 'Item';
    }
  };

  const isExpanded = activeContentSection?.sectionId === sectionId && 
                     activeContentSection?.lectureId === lecture.id;

  // Reset content type when section is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setActiveContentType(null);
      setShowContentTypeSelector(false);
    }
  }, [isExpanded]);

  // Handle key press when editing lecture name
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingLectureId(null);
    } else if (e.key === 'Escape') {
      setEditingLectureId(null);
    }
  };

  return (
    <div 
      className="mb-3 bg-white rounded-lg border border-gray-300"
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center p-3">
        <div className="flex-1 flex items-center">
          <div className="mr-2 text-gray-600">●</div>
          {editingLectureId === lecture.id ? (
            <input
              ref={lectureNameInputRef}
              type="text"
              value={lecture.name}
              onChange={(e) => updateLectureName(sectionId, lecture.id, e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <div className="flex items-center">
              <span>
                {getLectureTypeLabel()} {lectureIndex + 1}: {lecture.name}
              </span>
              {isHovering && (
                <div className="ml-2 flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingLecture(e);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLecture(sectionId, lecture.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveLecture(sectionId, lecture.id, 'up');
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            disabled={lectureIndex === 0}
          >
            <ChevronUp className={`w-4 h-4 ${lectureIndex === 0 ? 'opacity-50' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveLecture(sectionId, lecture.id, 'down');
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            disabled={lectureIndex === totalLectures - 1}
          >
            <ChevronDown className={`w-4 h-4 ${lectureIndex === totalLectures - 1 ? 'opacity-50' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleContentSection(sectionId, lecture.id);
              if (!isExpanded) {
                setShowContentTypeSelector(true);
              } else {
                setShowContentTypeSelector(false);
                setActiveContentType(null);
              }
            }}
            className="text-indigo-600 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Content
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              toggleContentSection(sectionId, lecture.id);
              if (isExpanded) {
                setShowContentTypeSelector(false);
                setActiveContentType(null);
              }
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Expanded content area */}
      {isExpanded && (
        <div className="px-3 pb-3">
          {showContentTypeSelector && !activeContentType && (
            <div className="bg-white rounded-md shadow-sm border border-gray-300 p-4 w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-800 font-medium">Select content type</h3>
                <button 
                  onClick={() => setShowContentTypeSelector(false)} 
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Select the main type of content. Files and links can be added as resources. 
                <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">Learn about content types.</a>
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveContentType('video')}
                  className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-400">▶</span>
                  </div>
                  <span className="text-sm">Video</span>
                </button>
                
                <button 
                  onClick={() => setActiveContentType('video-slide' as ContentItemType)}
                  className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-400">▶⊞</span>
                  </div>
                  <span className="text-sm">Video & Slide Mashup</span>
                </button>
                
                <button 
                  onClick={() => setActiveContentType('article')}
                  className="flex flex-col items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-400">📄</span>
                  </div>
                  <span className="text-sm">Article</span>
                </button>
              </div>
            </div>
          )}
          
          {!showContentTypeSelector && !activeContentType && (
            <>
              {/* Description button */}
              <button
                onClick={() => toggleDescriptionEditor(sectionId, lecture.id, lecture.description || "")}
                className="mb-2 flex items-center gap-2 py-2 px-4 text-sm text-indigo-600 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                <span>Description</span>
              </button>
              
              {/* Resources button */}
              <button
                onClick={() => toggleAddResourceModal(sectionId, lecture.id)}
                className="flex items-center gap-2 py-2 px-4 text-sm text-indigo-600 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                <span>Resources</span>
              </button>
              
              {/* Any additional content */}
              {children}
            </>
          )}
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useRef, useEffect } from 'react';
import { ContentItemType, Lecture } from '@/lib/types';
import { 
  Plus, Trash2, Edit3, Check, Upload, FileText, Video, Type, 
  BookOpen, ChevronDown, ChevronUp, ExternalLink, Code, Move,
  X, Paperclip, Film, FileImage, Globe, List, PlayCircle
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
  children
}: LectureItemProps) {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  const startEditingLecture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLectureId(lecture.id);
  };

  // Modified to match the design in the screenshot
  return (
    <div 
      className="mb-3 bg-white rounded-lg border"
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingLectureId(null);
                }
              }}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div>Lecture {lectureIndex + 1}: {lecture.name}</div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => toggleContentSection(sectionId, lecture.id)}
            className="text-indigo-600 font-medium px-3 py-1 rounded-md hover:bg-indigo-50 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Content
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={() => toggleContentSection(sectionId, lecture.id)}
          >
            {activeContentSection?.sectionId === sectionId && activeContentSection?.lectureId === lecture.id ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {activeContentSection?.sectionId === sectionId && activeContentSection?.lectureId === lecture.id && (
        <div className="mt-2 px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}
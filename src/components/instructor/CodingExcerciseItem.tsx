"use client";
import React, { useRef, useEffect } from 'react';
import { Lecture } from '@/lib/types';
import { Trash2, Edit3, ChevronDown, ChevronUp, Code } from "lucide-react";

interface CodingExerciseItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (sectionId: string, lectureId: string, newName: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (sectionId: string, lectureId: string, direction: 'up' | 'down') => void;
  handleDragStart: (e: React.DragEvent, sectionId: string, lectureId?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  isDragging?: boolean;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
}

const CodingExerciseItem: React.FC<CodingExerciseItemProps> = ({
  lecture,
  lectureIndex,
  totalLectures,
  sectionId,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  moveLecture,
  handleDragStart,
  handleDragOver,
  handleDrop,
  isDragging,
  handleDragEnd,
  handleDragLeave,
  draggedLecture,
  dragTarget
}) => {
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

  return (
    <div 
      className={`mb-3 bg-white rounded-lg border border-gray-300 ${
        draggedLecture === lecture.id ? 'opacity-50' : ''
      } ${
        dragTarget?.lectureId === lecture.id ? 'border-2 border-indigo-500' : ''
      }`}
      draggable={true}
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDragOver(e);
      }}
      onDragLeave={handleDragLeave}
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
            <div className="flex items-center">
              <span className="text-green-600 font-medium">Coding Exercise {lectureIndex + 1}:</span>
              <span className="ml-1">{lecture.name}</span>
              <span className="ml-2 px-1  bg-green-100 text-green-800 rounded-full">
                <Code size={14} />
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
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
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="text-xs text-gray-500">
          {lecture.description ? (
            <p>{lecture.description}</p>
          ) : (
            <p className="italic">No description provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingExerciseItem;
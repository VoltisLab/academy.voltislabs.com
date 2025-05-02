"use client";
import React, { useRef, useEffect } from 'react';
import { Lecture } from '@/lib/types';
import { Edit3, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface AssignmentItemProps {
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
}

export default function AssignmentItem({
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
  handleDrop
}: AssignmentItemProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingLectureId === lecture.id && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLectureId(lecture.id);
  };

  return (
    <div
      className="mb-3 bg-white rounded-lg border border-gray-300"
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
    >
      <div className="flex items-center p-3">
        <div className="flex-1 flex items-center">
          <div className="mr-2 text-yellow-500">⚠</div>
          {editingLectureId === lecture.id ? (
            <input
              ref={nameInputRef}
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
              <span className="text-gray-700">Unpublished Assignment:</span>
              <span className="text-indigo-600 ml-2">{lecture.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={startEditing}
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
    </div>
  );
}
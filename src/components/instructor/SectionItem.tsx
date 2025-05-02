"use client";
import React, { useRef, useEffect, useState } from 'react';
import { 
  Trash2, Edit3, ChevronDown, ChevronUp, Move, Plus
} from "lucide-react";
import { Lecture, ContentItemType } from '@/lib/types';
// Make sure this import path is correct - verify your file name (singular vs plural)
import { ContentTypeSelector } from './AddLectureButton';

interface Section {
  id: string;
  name: string;
  lectures: Lecture[];
  isExpanded: boolean;
}

interface SectionItemProps {
  section: Section;
  index: number;
  totalSections: number;
  editingSectionId: string | null;
  setEditingSectionId: (id: string | null) => void;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateSectionName: (sectionId: string, newName: string) => void;
  updateLectureName: (sectionId: string, lectureId: string, newName: string) => void;
  deleteSection: (sectionId: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  moveLecture: (sectionId: string, lectureId: string, direction: 'up' | 'down') => void;
  toggleSectionExpansion: (sectionId: string) => void;
  toggleContentSection: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor: (sectionId: string, lectureId: string, currentText: string) => void;
  activeContentSection: {sectionId: string, lectureId: string} | null;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, sectionId: string, lectureId?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  // Update the signature to match ContentTypeSelector's onAddContent parameter
  addLecture: (sectionId: string, contentType?: ContentItemType) => void;
  addCurriculumItem: (sectionId: string) => void;
  children?: React.ReactNode;
}

export default function SectionItem({
  section,
  index,
  totalSections,
  editingSectionId,
  setEditingSectionId,
  editingLectureId,
  setEditingLectureId,
  updateSectionName,
  updateLectureName,
  deleteSection,
  deleteLecture,
  moveSection,
  moveLecture,
  toggleSectionExpansion,
  toggleContentSection,
  toggleAddResourceModal,
  toggleDescriptionEditor,
  activeContentSection,
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDrop,
  addLecture,
  addCurriculumItem,
  children
}: SectionItemProps) {
  const sectionNameInputRef = useRef<HTMLInputElement>(null);
  // Add state for content type selector
  const [showContentTypeSelector, setShowContentTypeSelector] = useState<boolean>(false);

  useEffect(() => {
    if (editingSectionId === section.id && sectionNameInputRef.current) {
      sectionNameInputRef.current.focus();
    }
  }, [editingSectionId, section.id]);

  const startEditingSection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSectionId(section.id);
  };

  // Debug when button is clicked
  const handleCurriculumButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Curriculum button clicked");
    setShowContentTypeSelector(true);
  };

  return (
    <div 
      className="mb-4 border rounded-lg overflow-hidden bg-white"
      draggable
      onDragStart={(e) => handleDragStart(e, section.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, section.id)}
    >
      <div 
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
        onClick={() => toggleSectionExpansion(section.id)}
      >
        <div className="flex items-center space-x-3">
          <Move className="w-5 h-5 text-gray-400 cursor-move" />
          {editingSectionId === section.id ? (
            <input
              ref={sectionNameInputRef}
              type="text"
              value={section.name}
              onChange={(e) => updateSectionName(section.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingSectionId(null);
                }
              }}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="font-semibold">Section {index + 1}: {section.name}</h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => startEditingSection(e)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSection(section.id);
            }}
            className="text-gray-500 hover:text-red-600 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSection(section.id, 'up');
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={index === 0}
          >
            <ChevronUp className={`w-4 h-4 ${index === 0 ? 'opacity-50' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSection(section.id, 'down');
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
            disabled={index === totalSections - 1}
          >
            <ChevronDown className={`w-4 h-4 ${index === totalSections - 1 ? 'opacity-50' : ''}`} />
          </button>
          {section.isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {section.isExpanded && (
        <div className="p-4 bg-gray-50 relative">      
          {/* This will render any additional children */}
          {children}
          
          <button 
            onClick={handleCurriculumButtonClick}
            className="mt-3 flex items-center text-indigo-600 border border-indigo-200 hover:border-indigo-300 px-3 py-2 rounded-md text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Curriculum item
          </button>
          
          {/* Content type selector with debug output */}
          {showContentTypeSelector && (
            <>
              <div className="text-xs text-gray-500 mb-2">(Content selector is visible)</div>
              <ContentTypeSelector 
                sectionId={section.id}
                onClose={() => {
                  console.log("Closing content selector");
                  setShowContentTypeSelector(false);
                }}
                onAddContent={(sectionId, contentType) => {
                  console.log("Adding content:", sectionId, contentType);
                  addLecture(sectionId, contentType);
                  setShowContentTypeSelector(false);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
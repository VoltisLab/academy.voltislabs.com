"use client";
import React, { useRef, useEffect, useState } from 'react';
import { 
  Trash2, Edit3, ChevronDown, ChevronUp, Move, Plus
} from "lucide-react";
import { Lecture, ContentItemType } from '@/lib/types';
// Import the components
import { ActionButtons } from './ActionButtons';
import LectureItem from './LectureItem';
import AssignmentItem from './AssignmentItem';
import AssignmentForm from './AssignmentForm';

interface SectionItemProps {
  section: {
    id: string;
    name: string;
    lectures: Lecture[];
    isExpanded: boolean;
    objective?: string;
  };
  index: number;
  totalSections: number;
  editingSectionId: string | null;
  setEditingSectionId: (id: string | null) => void;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateSectionName: (sectionId: string, newName: string, objective?: string) => void;
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
  addLecture: (sectionId: string, contentType: ContentItemType, title?: string) => string;
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
  // State for toggling action buttons
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    if (editingSectionId === section.id && sectionNameInputRef.current) {
      sectionNameInputRef.current.focus();
    }
  }, [editingSectionId, section.id]);

  const startEditingSection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSectionId(section.id);
  };

  // Handler for curriculum button click
  const handleCurriculumButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionButtons(prev => !prev); // Toggle action buttons
    setShowAssignmentForm(false); // Hide assignment form when toggling action buttons
  };

  // Handler for adding an assignment
  const handleAddAssignment = (sectionId: string, title: string) => {
    // First add the lecture with assignment content type
    const newLectureId = addLecture(sectionId, 'assignment', title);
    setShowAssignmentForm(false);
  };

  // Enhanced lecture adding handler that properly handles title
  const handleAddLecture = (sectionId: string, contentType: ContentItemType, title?: string) => {
    console.log("SectionItem handling lecture add:", { sectionId, contentType, title });
    
    if (contentType === 'assignment') {
      setShowAssignmentForm(true);
    } else {
      // Make sure to always pass the title parameter to addLecture
      const lectureId = addLecture(sectionId, contentType, title);
      console.log("New lecture created with ID:", lectureId);
    }
    
    setShowActionButtons(false);
  };

  // Render lecture items based on their content type
  const renderLectureItem = (lecture: Lecture, lectureIndex: number) => {
    console.log("Rendering lecture:", lecture);
    
    if (lecture.contentType === 'assignment') {
      return (
        <AssignmentItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={lectureIndex}
          totalLectures={section.lectures.length}
          sectionId={section.id}
          editingLectureId={editingLectureId}
          setEditingLectureId={setEditingLectureId}
          updateLectureName={updateLectureName}
          deleteLecture={deleteLecture}
          moveLecture={moveLecture}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
        />
      );
    }
    
    return (
      <LectureItem
        key={lecture.id}
        lecture={lecture}
        lectureIndex={lectureIndex}
        totalLectures={section.lectures.length}
        sectionId={section.id}
        editingLectureId={editingLectureId}
        setEditingLectureId={setEditingLectureId}
        updateLectureName={updateLectureName}
        deleteLecture={deleteLecture}
        moveLecture={moveLecture}
        toggleContentSection={toggleContentSection}
        toggleAddResourceModal={toggleAddResourceModal}
        toggleDescriptionEditor={toggleDescriptionEditor}
        activeContentSection={activeContentSection}
        isDragging={isDragging}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      />
    );
  };

  return (
    <div 
      className="mb-4 border rounded-lg overflow-hidden bg-white"
      draggable
      onDragStart={(e) => handleDragStart(e, section.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, section.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Section header - with hover state for buttons */}
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
              onChange={(e) => updateSectionName(section.id, e.target.value, section.objective)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingSectionId(null);
                }
              }}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1 section-edit"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="font-semibold">Section {index + 1}: {section.name}</h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Edit and Delete buttons only visible on hover */}
          {isHovering && (
            <>
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
            </>
          )}
          {/* Up/Down buttons and expansion chevron (always visible) */}
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
          {/* Render lectures and assignments */}
          {section.lectures.map((lecture: Lecture, lectureIndex: number) => {
            return renderLectureItem(lecture, lectureIndex);
          })}
          
          {/* Assignment Form */}
          {showAssignmentForm && (
            <AssignmentForm
              sectionId={section.id}
              onAddAssignment={handleAddAssignment}
              onCancel={() => setShowAssignmentForm(false)}
            />
          )}
          
          {/* Render any additional children */}
          {children}
          
          {/* Curriculum item button */}
          <button 
            onClick={handleCurriculumButtonClick}
            className="mt-3 flex items-center text-indigo-600 border border-indigo-200 hover:border-indigo-300 px-3 py-2 rounded-md text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> Curriculum item
          </button>
          
          {/* Show action buttons when toggled */}
          {showActionButtons && (
            <div className="mt-3">
              <ActionButtons
                sectionId={section.id}
                onAddLecture={handleAddLecture}
                onShowTypeSelector={() => {
                  // For the lecture button - directly add a video lecture
                  addLecture(section.id, 'video');
                  setShowActionButtons(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
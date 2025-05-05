import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Edit3, ChevronDown, ChevronUp, Move, Plus, AlignJustify, FileText} from "lucide-react";
import { Lecture, ContentItemType } from '@/lib/types';
// Import the components
import { ActionButtons } from './ActionButtons';
import LectureItem from './LectureItem';
import AssignmentItem from './AssignmentItem';
import AssignmentForm from './AssignmentForm';
import QuizForm from './QuizForm';
import QuizItem from './QuizItem';
import CodingExerciseForm from './CodingExcerciseForm';
import CodingExerciseItem from './CodingExcerciseItem';
import PracticeItem from './PracticeItem';
import PracticeForm from './PracticeForm';
import { FaHamburger } from 'react-icons/fa';

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
  handleDragEnd?: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave?: () => void;
  handleDrop: (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => void;
  addLecture: (sectionId: string, contentType: ContentItemType, title?: string) => string;
  addCurriculumItem: (sectionId: string) => void;
  updateQuizQuestions?: (sectionId: string, quizId: string, questions: any[]) => void;
  // New prop for practice exercises
  savePracticeCode?: (sectionId: string, lectureId: string, code: string, language: string) => void;
  children?: React.ReactNode;
  // Props for enhanced drag and drop
  draggedSection?: string | null;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
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
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  addLecture,
  addCurriculumItem,
  updateQuizQuestions,
  savePracticeCode,
  children,
  draggedSection,
  draggedLecture,
  dragTarget
}: SectionItemProps) {
  const sectionNameInputRef = useRef<HTMLInputElement>(null);
  // State for toggling action buttons
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
  const [showQuizForm, setShowQuizForm] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showCodingExerciseForm, setShowCodingExerciseForm] = useState<boolean>(false);
  const [showPracticeForm, setShowPracticeForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editObjective, setEditObjective] = useState<string>("");

  useEffect(() => {
    if (editingSectionId === section.id && sectionNameInputRef.current) {
      sectionNameInputRef.current.focus();
    }
  }, [editingSectionId, section.id]);

  useEffect(() => {
    if (showEditForm) {
      setEditTitle(section.name);
      setEditObjective(section.objective || "");
    }
  }, [showEditForm, section.name, section.objective]);

  const startEditingSection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Set initial values when opening the form
    setEditTitle(section.name);
    setEditObjective(section.objective || "");
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      // Call the update function with current values
      updateSectionName(section.id, editTitle, editObjective);
      
      // Use setTimeout to ensure state updates before hiding the form
      setTimeout(() => {
        setShowEditForm(false);
      }, 0);
    }
  };

  // Handler for curriculum button click
  const handleCurriculumButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionButtons(prev => !prev); // Toggle action buttons
    setShowAssignmentForm(false); // Hide assignment form when toggling action buttons
    setShowQuizForm(false); // Hide quiz form when toggling action buttons
  };

  // Handler for adding an assignment
  const handleAddAssignment = (sectionId: string, title: string) => {
    // First add the lecture with assignment content type
    const newLectureId = addLecture(sectionId, 'assignment', title);
    setShowAssignmentForm(false);
  };

  // Handler for adding a quiz
  const handleAddQuiz = (sectionId: string, title: string, description: string) => {
    // First add the lecture with quiz content type
    const newLectureId = addLecture(sectionId, 'quiz', title);
    setShowQuizForm(false);
  };

  // Add handler for adding a coding exercise
  const handleAddCodingExercise = (sectionId: string, title: string) => {
    // Add the lecture with coding-exercise content type
    const newLectureId = addLecture(sectionId, 'coding-exercise', title);
    setShowCodingExerciseForm(false);
  };
  // Enhanced lecture adding handler that properly handles title
  const handleAddLecture = (sectionId: string, contentType: ContentItemType, title?: string) => {
    console.log("SectionItem handling lecture add:", { sectionId, contentType, title });
    
    if (contentType === 'assignment') {
      setShowAssignmentForm(true);
      setShowQuizForm(false);
      setShowCodingExerciseForm(false);
      setShowPracticeForm(false);
    } else if (contentType === 'quiz') {
      setShowQuizForm(true);
      setShowAssignmentForm(false);
      setShowCodingExerciseForm(false);
      setShowPracticeForm(false);
    } else if (contentType === 'coding-exercise') {
      setShowCodingExerciseForm(true);
      setShowAssignmentForm(false);
      setShowQuizForm(false);
      setShowPracticeForm(false);
    } else if (contentType === 'practice') {
      setShowPracticeForm(true);
      setShowAssignmentForm(false);
      setShowQuizForm(false);
      setShowCodingExerciseForm(false);
    } else {
      // Make sure to always pass the title parameter to addLecture
      const lectureId = addLecture(sectionId, contentType, title);
      console.log("New lecture created with ID:", lectureId);
    }
    
    setShowActionButtons(false);
  };

  const handleAddPractice = (sectionId: string, title: string, description: string) => {
    // Add the lecture with practice content type
    const newLectureId = addLecture(sectionId, 'practice', title);
    
    // If description is provided, update it
    if (description) {
      const sections = [...section.lectures];
      const lectureIndex = sections.findIndex(lecture => lecture.id === newLectureId);
      if (lectureIndex !== -1) {
        sections[lectureIndex].description = description;
      }
    }
    
    setShowPracticeForm(false);
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
          isDragging={isDragging}
          handleDragEnd={handleDragEnd}
          handleDragLeave={handleDragLeave}
          draggedLecture={draggedLecture}
          dragTarget={dragTarget}
        />
      );
    }

    if (lecture.contentType === 'coding-exercise') {
      return (
        <CodingExerciseItem
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
          isDragging={isDragging}
          handleDragEnd={handleDragEnd}
          handleDragLeave={handleDragLeave}
          draggedLecture={draggedLecture}
          dragTarget={dragTarget}
        />
      );
    }
    
    if (lecture.contentType === 'quiz') {
      return (
        <QuizItem
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
          toggleContentSection={toggleContentSection}
          updateQuizQuestions={updateQuizQuestions}
          isDragging={isDragging}
          handleDragEnd={handleDragEnd}
          handleDragLeave={handleDragLeave}
          draggedLecture={draggedLecture}
          dragTarget={dragTarget}
        />
      );
    }

    // Render the practice item
    if (lecture.contentType === 'practice') {
      return (
        <PracticeItem
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
          savePracticeCode={savePracticeCode}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          isDragging={isDragging}
          handleDragEnd={handleDragEnd}
          handleDragLeave={handleDragLeave}
          draggedLecture={draggedLecture}
          dragTarget={dragTarget}
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
        handleDragEnd={handleDragEnd}
        handleDragLeave={handleDragLeave}
        draggedLecture={draggedLecture}
        dragTarget={dragTarget}
      />
    );
  };  

  return (
    <div 
      className={`border border-gray-300 overflow-hidden bg-white ${
        draggedSection === section.id ? 'opacity-50' : ''
      } ${
        dragTarget?.sectionId === section.id && !dragTarget?.lectureId ? 'border-2 border-indigo-500' : ''
      }`}
      draggable={!showEditForm}
      onDragStart={(e) => handleDragStart(e, section.id)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, section.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
       

        <div className='bg-gray-100 pb-5'>
          {/* Section header - with hover state for buttons */}
          <div 
            className="flex justify-between items-center bg-gray-100 cursor-pointer w-full"
            onClick={() => toggleSectionExpansion(section.id)}
          >
            {showEditForm? (
               <div className="m-4 flex-1 w-full bg-white p-2 border border-gray-400">
               <div className="flex items-center mb-2 w-full ">
                 <div className="w-16">
                   <span className="text-sm font-bold text-gray-800">Section:</span>
                 </div>
                 <div className="flex-1">
                 <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Demo Section"
                  className="w-full border border-gray-400 rounded px-3 py-1 focus:outline-none focus:border-2 focus:border-[#6D28D2]"
                  maxLength={80}
                  ref={sectionNameInputRef}
                />
                   <div className="text-right text-xs text-gray-500 mt-1">
                     {editTitle.length}/80
                   </div>
                 </div>
               </div>
               
               <div className="mb-4 ml-16">
                 <div className="mb-2">
                   <span className="text-sm font-medium text-gray-800">What will students be able to do at the end of this section?</span>
                 </div>
                 <input
                   type="text"
                   value={editObjective}
                   onChange={(e) => setEditObjective(e.target.value)}
                   placeholder="Demo Section description"
                   className="w-full border border-gray-400 rounded px-3 py-1 focus:outline-none focus:border-2 focus:border-[#6D28D2]"
                   maxLength={200}
                 />
                 <div className="text-right text-xs text-gray-500 mt-1">
                   {editObjective.length}/200
                 </div>
               </div>
               
               <div className="flex justify-end space-x-2">
                 <button
                   type="button"
                   onClick={() => setShowEditForm(false)}
                   className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                 >
                   Cancel
                 </button>
                 <button
                   type="button"
                   onClick={handleSaveEdit}
                   className="px-4 py-2 text-sm font-medium bg-[#6D28D2] text-white rounded hover:bg-[#7B3FE4]"
                 >
                   Save Section
                 </button>
               </div>
             </div>
            ) : (
              <div className='flex flex-row justify-bewteen w-full p-2'>
                 <div className="flex items-center space-x-3 mt-2 w-full">
              <h3 className="font-semibold text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                Unpublished Section: <FileText size={10} /> {section.name}
              </h3>

              {/* Edit and Delete buttons only visible on hover */}
              {isHovering && (
                <>
                  <button
                    onClick={(e) => startEditingSection(e)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>

            {isHovering && (
              <div className="flex items-center space-x-2">
              <AlignJustify className="w-5 h-5 text-gray-400 cursor-move" />
            </div>
            )}
              </div>
            )}
           
          </div>
          
          {section.isExpanded && (
            <div className="p-2 bg-gray-100 relative">
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

              {showPracticeForm && (
                <PracticeForm
                  sectionId={section.id}
                  onAddPractice={handleAddPractice}
                  onCancel={() => setShowPracticeForm(false)}
                />
              )}

              {showCodingExerciseForm && (
                <CodingExerciseForm
                  sectionId={section.id}
                  onAddCodingExercise={handleAddCodingExercise}
                  onCancel={() => setShowCodingExerciseForm(false)}
                />
              )}
              
              {/* Quiz Form */}
              {showQuizForm && (
                <QuizForm
                  sectionId={section.id}
                  onAddQuiz={handleAddQuiz}
                  onCancel={() => setShowQuizForm(false)}
                />
              )}
              
              {/* Render any additional children */}
              {children}
              
              {/* Show action buttons when toggled */}
              <div className='flex flex-row gap-2 '>
              <button 
                onClick={handleCurriculumButtonClick}
                className="mt-3 max-h-8 ml-2 w-36 flex items-center text-[#6D28D2] border border-[#6D28D2] bg-white hover:border-[#6D28D2] px-2 py-1 rounded-sm text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1 text-xs" /> Curriculum item
              </button>
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
            </div>
            
          )}

        </div>
 
    </div>
  );
}
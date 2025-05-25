import React, { useRef, useEffect, useState } from "react";
import {
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Move,
  Plus,
  AlignJustify,
  FileText,
} from "lucide-react";
import { Lecture, ContentItemType, ExtendedLecture } from "@/lib/types";
// Import the components
import { ActionButtons } from "./ActionButtons";
import LectureItem from "../lecture/LectureItem";
import AssignmentItem from "../assignment/AssignmentItem";
import AssignmentForm from "../assignment/AssignmentForm";
import QuizForm from "../quiz/QuizForm";
import QuizItem from "../quiz/QuizItem";
import CodingExerciseForm from "../code/CodingExcerciseForm";
import CodingExerciseItem from "../code/CodingExcerciseItem";
import PracticeItem from "../practice/PracticeItem";
import PracticeForm from "../practice/PracticeForm";
import { FaHamburger } from "react-icons/fa";
import { useSections } from "@/hooks/useSection";

// Updated SectionItemProps interface with the missing property
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
  updateSectionName: (
    sectionId: string,
    newName: string,
    objective?: string
  ) => void;
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => void;
  deleteSection: (sectionId: string) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  moveLecture: (
    sectionId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => void;
  toggleSectionExpansion: (sectionId: string) => void;
  toggleContentSection: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor: (
    sectionId: string,
    lectureId: string,
    currentText: string
  ) => void;
  saveDescription?: (
    sectionId: string,
    lectureId: string,
    description: string
  ) => void;
  activeContentSection: { sectionId: string; lectureId: string } | null;
  isDragging: boolean;
  handleDragStart: (
    e: React.DragEvent,
    sectionId: string,
    lectureId?: string
  ) => void;
  handleDragEnd?: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave?: () => void;
  handleDrop: (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => void;
  addLecture: (
    sectionId: string,
    contentType: ContentItemType,
    title?: string
  ) => string;
  addCurriculumItem: (sectionId: string) => void;
  updateQuizQuestions?: (
    sectionId: string,
    quizId: string,
    questions: any[]
  ) => void;
  
  // New prop for practice exercises
  savePracticeCode?: (
    sectionId: string,
    lectureId: string,
    code: string,
    language: string
  ) => void;
  children?: React.ReactNode;
  // Props for enhanced drag and drop
  draggedSection?: string | null;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
  // Add the missing property for opening coding exercise modal
  openCodingExerciseModal?: (sectionId: string, lectureId: string) => void;
  onEditAssignment: (assignmentData: ExtendedLecture) => void;
  // Add this new prop
  allSections: Array<{
    id: string;
    name: string;
    lectures: Lecture[];
    quizzes: any[];
    assignments: any[];
    codingExercises: any[];
    isExpanded: boolean;
  }>;
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
  dragTarget,
  saveDescription,
  openCodingExerciseModal,
  onEditAssignment,
  allSections,
}: SectionItemProps) {
  const sectionNameInputRef = useRef<HTMLInputElement>(null);
  // State for toggling action buttons
  const [showActionButtons, setShowActionButtons] = useState<boolean>(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState<boolean>(false);
  const [showQuizForm, setShowQuizForm] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showCodingExerciseForm, setShowCodingExerciseForm] =
    useState<boolean>(false);
  const [showPracticeForm, setShowPracticeForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editObjective, setEditObjective] = useState<string>("");

  // Added states to track active sections for resources and descriptions
  const [activeResourceSection, setActiveResourceSection] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);
  const [activeDescriptionSection, setActiveDescriptionSection] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string>("");

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
    setShowActionButtons((prev) => !prev); // Toggle action buttons
    setShowAssignmentForm(false); // Hide assignment form when toggling action buttons
    setShowQuizForm(false); // Hide quiz form when toggling action buttons
  };

  // Handler for adding an assignment
  const handleAddAssignment = (sectionId: string, title: string) => {
    // First add the lecture with assignment content type
    const newLectureId = addLecture(sectionId, "assignment", title);
    setShowAssignmentForm(false);
  };

  // Handler for adding a quiz
  const handleAddQuiz = (
    sectionId: string,
    title: string,
    description: string
  ) => {
    // First add the lecture with quiz content type
    const newLectureId = addLecture(sectionId, "quiz", title);
    setShowQuizForm(false);
  };

  // Add handler for adding a coding exercise
  const handleAddCodingExercise = (sectionId: string, title: string) => {
    // Add the lecture with coding-exercise content type
    const newLectureId = addLecture(sectionId, "coding-exercise", title);
    setShowCodingExerciseForm(false);
  };

  // Enhanced lecture adding handler that properly handles title
  const handleAddLecture = (
    sectionId: string,
    contentType: ContentItemType,
    title?: string
  ) => {
    console.log("SectionItem handling lecture add:", {
      sectionId,
      contentType,
      title,
    });

    if (contentType === "assignment") {
      setShowAssignmentForm(true);
      setShowQuizForm(false);
      setShowCodingExerciseForm(false);
      setShowPracticeForm(false);
    } else if (contentType === "quiz") {
      setShowQuizForm(true);
      setShowAssignmentForm(false);
      setShowCodingExerciseForm(false);
      setShowPracticeForm(false);
    } else if (contentType === "coding-exercise") {
      setShowCodingExerciseForm(true);
      setShowAssignmentForm(false);
      setShowQuizForm(false);
      setShowPracticeForm(false);
    } else if (contentType === "practice") {
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

  const handleSaveDescription = () => {
    if (!activeDescriptionSection || !saveDescription) return;

    saveDescription(
      activeDescriptionSection.sectionId,
      activeDescriptionSection.lectureId,
      currentDescription
    );

    // Update UI state to reflect the saved description
    setActiveDescriptionSection(null);
  };

  const handleAddPractice = (
    sectionId: string,
    title: string,
    description: string
  ) => {
    // Add the lecture with practice content type
    const newLectureId = addLecture(sectionId, "practice", title);

    // If description is provided, update it
    if (description) {
      const sections = [...section.lectures];
      const lectureIndex = sections.findIndex(
        (lecture) => lecture.id === newLectureId
      );
      if (lectureIndex !== -1) {
        sections[lectureIndex].description = description;
      }
    }

    setShowPracticeForm(false);
  };

  // Custom toggleAddResourceModal that updates local state
  const handleToggleAddResourceModal = (
    sectionId: string,
    lectureId: string
  ) => {
    // Check if we're toggling the same lecture
    if (
      activeResourceSection &&
      activeResourceSection.sectionId === sectionId &&
      activeResourceSection.lectureId === lectureId
    ) {
      // Toggle off
      setActiveResourceSection(null);
    } else {
      // Toggle on for a new lecture
      setActiveResourceSection({ sectionId, lectureId });
      // Make sure description section is closed
      setActiveDescriptionSection(null);
    }

    // Also call the parent toggle if it exists
    if (toggleAddResourceModal) {
      toggleAddResourceModal(sectionId, lectureId);
    }
  };

  // Custom toggleDescriptionEditor that updates local state
  // Custom toggleDescriptionEditor that updates local state
  const handleToggleDescriptionEditor = (
    sectionId: string,
    lectureId: string,
    currentText: string = ""
  ) => {
    // Check if we're toggling the same lecture
    if (
      activeDescriptionSection &&
      activeDescriptionSection.sectionId === sectionId &&
      activeDescriptionSection.lectureId === lectureId
    ) {
      // Toggle off
      setActiveDescriptionSection(null);
    } else {
      // Toggle on for a new lecture
      setActiveDescriptionSection({ sectionId, lectureId });
      if (updateCurrentDescription) {
        updateCurrentDescription(currentText);
      }
      // Make sure resource section is closed
      setActiveResourceSection(null);
    }

    // Also call the parent toggle if it exists
    if (toggleDescriptionEditor) {
      toggleDescriptionEditor(sectionId, lectureId, currentText);
    }
  };

  // Handle description update
  const updateCurrentDescription = (description: string) => {
    setCurrentDescription(description);
  };

  // Handle description save
  // In your parent component

  // Calculate content type specific indices
  const getContentTypeIndex = (currentIndex: number, contentType: string): number => {
    let typeIndex = 0;
    for (let i = 0; i <= currentIndex; i++) {
      if (section.lectures[i]?.contentType === contentType || 
          (!section.lectures[i]?.contentType && contentType === "video")) {
        if (i === currentIndex) {
          return typeIndex;
        }
        typeIndex++;
      }
    }
    return typeIndex;
  };

  // Render lecture items based on their content type
  const renderLectureItem = (lecture: Lecture, lectureIndex: number) => {
    console.log("Rendering lecture:", lecture);

    // Calculate the specific index for this content type
     const contentType = lecture.contentType || "video"; // Default to video if not set
  const typeSpecificIndex = getContentTypeIndex(lectureIndex, contentType);

    if (lecture.contentType === "assignment") {
      return (
        <AssignmentItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={typeSpecificIndex} // Use assignment-specific index
          totalLectures={section.lectures.filter(l => l.contentType === "assignment").length}
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
          allSections={allSections} 
          onEditAssignment={onEditAssignment} 
        />
      );
    }

    if (lecture.contentType === "coding-exercise") {
      return (
        <CodingExerciseItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={typeSpecificIndex} // Use coding-exercise-specific index
          totalLectures={section.lectures.filter(l => l.contentType === "coding-exercise").length}
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
          allSections={allSections}
          // Add the required prop here
          customEditHandler={(lectureId) => {
            if (openCodingExerciseModal) {
              openCodingExerciseModal(section.id, lectureId);
            }
          }}
        />
      );
    }

    if (lecture.contentType === "quiz") {
      return (
        <QuizItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={typeSpecificIndex} // Use quiz-specific index
          totalLectures={section.lectures.filter(l => l.contentType === "quiz").length}
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
          sections={allSections}
          allSections={allSections}
          // isDragging={isDragging}
          // handleDragEnd={handleDragEnd}
          // handleDragLeave={handleDragLeave}
          // draggedLecture={draggedLecture}
          // dragTarget={dragTarget}
        />
      );
    }

    // Render the practice item
    if (lecture.contentType === "practice") {
      return (
        <PracticeItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={typeSpecificIndex} // Use practice-specific index
          totalLectures={section.lectures.filter(l => l.contentType === "practice").length}
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
          allSections={allSections}
        />
      );
    }

    // Default to LectureItem (for video lectures and other types)
    return (
      <LectureItem
        key={lecture.id}
        lecture={lecture}
        lectureIndex={typeSpecificIndex} // Use lecture-specific index
        totalLectures={section.lectures.filter(l => l.contentType === "video" || !l.contentType).length}
        sectionId={section.id}
        editingLectureId={editingLectureId}
        setEditingLectureId={setEditingLectureId}
        updateLectureName={updateLectureName}
        deleteLecture={deleteLecture}
        moveLecture={moveLecture}
        toggleContentSection={toggleContentSection}
        toggleAddResourceModal={handleToggleAddResourceModal}
        toggleDescriptionEditor={handleToggleDescriptionEditor}
        activeContentSection={activeContentSection}
        activeResourceSection={activeResourceSection}
        activeDescriptionSection={activeDescriptionSection}
        isDragging={isDragging}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDragLeave={handleDragLeave}
        draggedLecture={draggedLecture}
        dragTarget={dragTarget}
        sections={allSections} // Pass the current section if needed
        updateCurrentDescription={updateCurrentDescription}
        saveDescription={handleSaveDescription} // Use the local wrapper function
        currentDescription={currentDescription}
        allSections={allSections}
      />
    );
  };

  return (
    <div
      className={`border border-gray-300 overflow-hidden bg-white ${
        draggedSection === section.id ? "opacity-50" : ""
      } ${
        dragTarget?.sectionId === section.id && !dragTarget?.lectureId
          ? "border-2 border-indigo-500"
          : ""
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
      <div className="bg-gray-100 pb-5">
        {/* Section header - with hover state for buttons */}
        <div
          className="flex justify-between items-center bg-gray-100 cursor-pointer w-full"
          onClick={() => toggleSectionExpansion(section.id)}
        >
          {showEditForm ? (
            <div className="m-4 flex-1 w-full bg-white p-2 border border-gray-400">
              <div className="flex items-center mb-2 w-full ">
                <div className="w-16">
                  <span className="text-sm font-bold text-gray-800">
                    Section:
                  </span>
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
                  <span className="text-sm font-medium text-gray-800">
                    What will students be able to do at the end of this section?
                  </span>
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
            <div className="flex flex-row justify-between w-full p-2">
              <div className="flex items-center space-x-3 mt-4 w-full">
                <h3 className="text-[15px] tracking-tight text-[#16161d] font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                  Unpublished Section: <FileText size={15} className="ml-2" />{" "}
                  <span className="font-normal">{section.name}</span>
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
                  <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
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
            {/* Updated Curriculum & Action Buttons UI */}
            <div className="ml-2 mt-3 relative">
              {!showActionButtons ? (
                <button
                  onClick={handleCurriculumButtonClick}
                  className="-mx-1.5 w-36 flex items-center text-[#6D28D2] border border-[#6D28D2] bg-white hover:bg-indigo-50 hover:border-[#6D28D2] px-1 py-2 rounded-sm text-sm font-bold"
                >
                  <Plus className="w-4 h-4 mr-1 text-xs" color="#666" />{" "}
                  Curriculum item
                </button>
              ) : (
                <div className="relative">
                  {/* X button to close */}
                  <button
                    onClick={() => setShowActionButtons(false)}
                    className="absolute -top-3 cursor-pointer left-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Action Buttons */}
                  <div className="bg-white border-inset border border-gray-200 rounded-md ml-8">
                    <ActionButtons
                      sectionId={section.id}
                      onAddLecture={handleAddLecture}
                      onShowTypeSelector={() => {
                        // For the lecture button - directly add a video lecture
                        addLecture(section.id, "video");
                        setShowActionButtons(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
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
import {
  Lecture,
  ContentItemType,
  ExtendedLecture,
  EnhancedLecture,
  SourceCodeFile,
  ExternalResourceItem,
  ContentType,
} from "@/lib/types";
// Import the components
import { ActionButtons } from "./ActionButtons";
import LectureItem from "../lecture/LectureItem";
import AssignmentItem from "../assignment/AssignmentItem";
import AssignmentForm from "../assignment/AssignmentForm";
import { apolloClient } from "@/lib/apollo-client";
import QuizForm from "../quiz/QuizForm";
import QuizItem from "../quiz/QuizItem";
import CodingExerciseForm from "../code/CodingExcerciseForm";
import CodingExerciseItem from "../code/CodingExcerciseItem";
import PracticeItem from "../practice/PracticeItem";
import PracticeForm from "../practice/PracticeForm";
import { FaHamburger } from "react-icons/fa";
import { useSections } from "@/hooks/useSection";
import { FileUploadFunction } from "../../CourseSectionBuilder";
import { CREATE_ASSIGNMENT } from "@/api/assignment/mutation";
import { useAssignmentService } from "@/services/useAssignmentService";
import { useQuizOperations } from "@/services/quizService";

// Updated SectionItemProps interface with the missing property
interface SectionItemProps {
  setNewassignment?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setNewQuizId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  newQuizId?: number;
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
  ) => Promise<void>;
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  deleteLecture: (sectionId: string, lectureId: string) => Promise<void>;
  deleteAssignment: (sectionId: string, lectureId: string) => Promise<void>;
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
    lectureId: number,
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
    title?: string,
    description?: string
  ) => Promise<string>;
  addCurriculumItem: (sectionId: string) => void;
  updateQuizQuestions?: (
    sectionId: string,
    quizId: number,
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
  // New props for quiz functionality
  addQuiz?: (
    sectionId: string,
    title: string,
    description: string
  ) => Promise<void>;
  updateQuiz?: (
    sectionId: string,
    quizId: string,
    title: string,
    description: string
  ) => Promise<void>;

  // FIXED: Add global resource props
  globalUploadedFiles?: Array<{
    name: string;
    size: string;
    lectureId: string;
  }>;
  globalSourceCodeFiles?: SourceCodeFile[];
  globalExternalResources?: ExternalResourceItem[];
  addUploadedFile?: (file: {
    name: string;
    size: string;
    lectureId: string;
  }) => void;
  removeUploadedFile?: (fileName: string, lectureId: string) => void;
  addSourceCodeFile?: (file: SourceCodeFile) => void;
  removeSourceCodeFile?: (
    fileName: string | undefined,
    lectureId: string
  ) => void;
  addExternalResource?: (resource: ExternalResourceItem) => void;
  removeExternalResource?: (title: string, lectureId: string) => void;

  // NEW: Loading state prop
  isLoading?: boolean;

  // NEW: Backend integration props
  uploadVideoToBackend?: (
    sectionId: string,
    lectureId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ) => Promise<string | null>;
  saveArticleToBackend?: (
    sectionId: string,
    lectureId: string,
    articleContent: string
  ) => Promise<string>;
  videoUploading?: boolean;
  videoUploadProgress?: number;
  uploadFileToBackend?: FileUploadFunction;
}

export default function SectionItem({
  section,
  setNewassignment,
  setNewQuizId,
  newQuizId,
  index,
  totalSections,
  editingSectionId,
  setEditingSectionId,
  updateSectionName,
  deleteSection,
  moveSection,
  toggleSectionExpansion,
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
  addQuiz,
  updateQuiz,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  deleteAssignment,
  moveLecture,
  toggleContentSection,
  toggleAddResourceModal,
  toggleDescriptionEditor,
  activeContentSection,
  // FIXED: Receive global resource props
  globalUploadedFiles = [],
  globalSourceCodeFiles = [],
  globalExternalResources = [],
  addUploadedFile,
  removeUploadedFile,
  addSourceCodeFile,
  removeSourceCodeFile,
  addExternalResource,
  removeExternalResource,
  // NEW: Receive loading state
  isLoading = false,
  uploadVideoToBackend,
  videoUploading,
  videoUploadProgress,
  saveArticleToBackend,
  uploadFileToBackend,
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
    console.log("section===", section);
    setEditTitle(section.name);
    setEditObjective(section.objective || "");
    setShowEditForm(true);
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      try {
        // Call the async update function with current values
        await updateSectionName(section.id, editTitle, editObjective);
        setShowEditForm(false);
      } catch (error) {
        console.error("Failed to save section edit:", error);
        // Error is already handled in the service with toast
      }
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
  const { createAssignment } = useAssignmentService();
  const { setSections, addLecture: addLocalLecture } = useSections([]);

  const handleAddAssignment = async (sectionId: string, title: string) => {
    try {
      // Use the service method instead of apolloClient directly
      const response = await createAssignment({
        sectionId: Number(sectionId),
        title,
      });

      if (response.createAssignment) {
        setNewassignment?.(Number(response.createAssignment.assignment.id));
      }

      if (response.createAssignment.success) {
        await addLecture(sectionId, "assignment", title);
        setShowAssignmentForm(false);
        // Add to local state with backend ID
        const backendLectureId = response.createAssignment.assignment.id;
        const localLectureId = await addLocalLecture(
          sectionId,
          "assignment",
          title
        );

        // Update the local lecture with the backend ID
        setSections((prevSections) =>
          prevSections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                assignments: section.lectures.map((lecture) =>
                  lecture.id === localLectureId
                    ? { ...lecture, id: backendLectureId }
                    : lecture
                ),
              };
            }
            return section;
          })
        );

        return backendLectureId;
      }

      return "";
      // Then add the lecture
    } catch (error) {
      console.error("Failed to create assignment:", error);
      // Error and toast already handled in the service
    }
  };

  const { createQuiz, loading: quizOperationLoading } = useQuizOperations();
  // Enhanced handler for adding a quiz - uses addQuiz instead of addLecture
  const handleAddQuiz = async (
    sectionId: string,
    title: string,
    description: string
  ) => {
    try {
      // Use the service method instead of apolloClient directly
      const response = await createQuiz({
        sectionId: Number(sectionId),
        title,
        description,
      });

      if (response.createQuiz) {
        setNewQuizId?.(Number(response.createQuiz.quiz.id));
      }

      if (response.createQuiz.success) {
        // Add lecture (backend)
        const localLectureId = await addLecture(
          sectionId,
          "quiz",
          title,
          description
        );

        // Get backend and local IDs
        const backendLectureId = response.createQuiz.quiz.id;
        // const localLectureId = await addLocalLecture(
        //   sectionId,
        //   "quiz",
        //   title,
        //   description
        // );

        // Update local lecture state with the backend ID
        setSections((prevSections) =>
          prevSections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                lectures: section.lectures.map((lecture) =>
                  lecture.id === localLectureId
                    ? { ...lecture, id: backendLectureId }
                    : lecture
                ),
              };
            }
            return section;
          })
        );

        setShowQuizForm(false);
        return backendLectureId;
      }

      return "";
    } catch (error) {
      console.error("Failed to create quiz:", error);
      // Optional: show a toast if not already handled in the service
      return "";
    }
  };

  // Handler for editing a quiz
  const handleEditQuiz = async (
    sectionId: string,
    quizId: string,
    title: string,
    description: string
  ) => {
    console.log("SectionItem handling quiz edit:", {
      sectionId,
      quizId,
      title,
      description,
    });

    if (updateQuiz) {
      await updateQuiz(sectionId, quizId, title, description);
    }
  };

  // Add handler for adding a coding exercise
  const handleAddCodingExercise = async (sectionId: string, title: string) => {
    try {
      // Add the lecture with coding-exercise content type
      await addLecture(sectionId, "coding-exercise", title);
      setShowCodingExerciseForm(false);
    } catch (error) {
      console.error("Failed to add coding exercise:", error);
      // Error is already handled in the service with toast
    }
  };
  // Enhanced lecture adding handler that properly handles title
  const handleAddLecture = async (
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
      try {
        // Make sure to always pass the title parameter to addLecture
        await addLecture(sectionId, contentType, title);
      } catch (error) {
        console.error("Failed to add lecture:", error);
        // Error is already handled in the service with toast
      }
    }

    setShowActionButtons(false);
  };

  const handleSaveDescription = () => {
    if (!activeDescriptionSection || !saveDescription) return;

    saveDescription(
      activeDescriptionSection.sectionId,
      Number(activeDescriptionSection.lectureId),
      currentDescription
    );

    // Update UI state to reflect the saved description
    setActiveDescriptionSection(null);
  };

  const handleAddPractice = async (
    sectionId: string,
    title: string,
    description: string
  ) => {
    try {
      // Add the lecture with practice content type
      await addLecture(sectionId, "practice", title);

      // If description is provided, update it
      if (description) {
        const sections = [...section.lectures];
        const lectureIndex = sections.findIndex(
          (lecture) => lecture.name === title
        );
        if (lectureIndex !== -1) {
          sections[lectureIndex].description = description;
        }
      }

      setShowPracticeForm(false);
    } catch (error) {
      console.error("Failed to add practice:", error);
      // Error is already handled in the service with toast
    }
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

  const [enhancedLectures, setEnhancedLectures] = useState<
    Record<string, EnhancedLecture>
  >({});
  const allSectionsWithEnhanced = allSections.map((section) => ({
    ...section,
    lectures: section.lectures.map((lecture) => {
      const enhanced = enhancedLectures[lecture.id];
      return enhanced ? { ...lecture, ...enhanced } : lecture;
    }),
  }));

  // Handler to update lecture content
  const updateLectureContent = (
    sectionId: string,
    lectureId: string,
    updatedLecture: EnhancedLecture
  ) => {
    // Store the enhanced lecture data
    setEnhancedLectures((prev) => ({
      ...prev,
      [lectureId]: updatedLecture,
    }));
  };

  // Calculate content type specific indices
  const getContentTypeIndex = (
    currentIndex: number,
    contentType: string
  ): number => {
    let typeIndex = 0;
    for (let i = 0; i <= currentIndex; i++) {
      if (
        section.lectures[i]?.contentType === contentType ||
        (!section.lectures[i]?.contentType && contentType === "video")
      ) {
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
    // Calculate the specific index for this content type
    const contentType = lecture.contentType || "video"; // Default to video if not set
    const typeSpecificIndex = getContentTypeIndex(lectureIndex, contentType);

    if (lecture.contentType === "assignment") {
      return (
        <AssignmentItem
          key={lecture.id}
          lecture={lecture}
          lectureIndex={typeSpecificIndex} // Use assignment-specific index
          totalLectures={
            section.lectures.filter((l) => l.contentType === "assignment")
              .length
          }
          sectionId={section.id}
          editingLectureId={editingLectureId}
          setEditingLectureId={setEditingLectureId}
          updateLectureName={updateLectureName}
          deleteLecture={deleteAssignment}
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
          totalLectures={
            section.lectures.filter((l) => l.contentType === "coding-exercise")
              .length
          }
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
          newQuizId={newQuizId} // Pass the newQuizId setter
          lectureIndex={typeSpecificIndex} // Use quiz-specific index
          totalLectures={
            section.lectures.filter((l) => l.contentType === "quiz").length
          }
          // updateQuiz={updateQuiz} // Pass the updateQuiz function
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
          onEditQuiz={handleEditQuiz} // Pass the edit handler
          allSections={allSectionsWithEnhanced} // Pass enhanced sections
          enhancedLectures={enhancedLectures} // Pass enhanced lectures
          // FIXED: Pass resource arrays to QuizItem
          uploadedFiles={globalUploadedFiles}
          sourceCodeFiles={globalSourceCodeFiles}
          externalResources={globalExternalResources}
          // loading={}
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
          totalLectures={
            section.lectures.filter((l) => l.contentType === "practice").length
          }
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
        lectureIndex={typeSpecificIndex}
        totalLectures={
          section.lectures.filter(
            (l) => l.contentType === "video" || !l.contentType
          ).length
        }
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
        sections={allSections}
        updateCurrentDescription={updateCurrentDescription}
        saveDescription={handleSaveDescription}
        currentDescription={currentDescription}
        allSections={allSectionsWithEnhanced}
        updateLectureContent={updateLectureContent}
        globalUploadedFiles={globalUploadedFiles}
        globalSourceCodeFiles={globalSourceCodeFiles}
        globalExternalResources={globalExternalResources}
        addUploadedFile={addUploadedFile}
        removeUploadedFile={removeUploadedFile}
        addSourceCodeFile={addSourceCodeFile}
        removeSourceCodeFile={removeSourceCodeFile}
        addExternalResource={addExternalResource}
        removeExternalResource={removeExternalResource}
        // NEW: Pass the backend functions
        uploadVideoToBackend={uploadVideoToBackend}
        saveArticleToBackend={saveArticleToBackend}
        videoUploading={videoUploading}
        videoUploadProgres={videoUploadProgress}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium bg-[#6D28D2] text-white rounded hover:bg-[#7B3FE4] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!editTitle.trim() || isLoading}
                >
                  {isLoading ? "Saving..." : "Save Section"}
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
                {isHovering && !isLoading && (
                  <>
                    <button
                      onClick={(e) => startEditingSection(e)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteSection(section.id);
                      }}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>

              {isHovering && !isLoading && (
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

            {/* Enhanced Quiz Form */}
            {showQuizForm && (
              <QuizForm
                sectionId={section.id}
                onAddQuiz={handleAddQuiz}
                onCancel={() => setShowQuizForm(false)}
                isEdit={false}
                loading={quizOperationLoading}
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
                  disabled={isLoading}
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
                        handleAddLecture(section.id, "video");
                        setShowActionButtons(false);
                      }}
                      isLoading={isLoading}
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

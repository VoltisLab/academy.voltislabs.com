import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  ContentType,
  ResourceTabType,
  CourseSectionInput,
  LectureInput,
} from "@/lib/types";
import { useSections } from "@/hooks/useSection";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useModal } from "@/hooks/useModal";
import { ContentTypeSelector } from "../../ContentTypeSelector";
import SectionItem from "./components/section/SectionItem";
import { useCourseSectionsUpdate } from "@/services/courseSectionsService";
import SectionForm from "./components/section/SectionForm";
import NewFeatureAlert from "./NewFeatureAlert";
import InfoBox from "./InfoBox";
import CodingExerciseCreator from "./components/code/CodingExcerciseCreator";
import AssignmentEditor from "./components/assignment/AssignmentEditor"; // Import the new component

// Add the ExtendedLecture interface here if not already imported
interface ExtendedLecture {
  id: string;
  name?: string;
  title?: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: any[];
  videos: any[];
  contentType: any;
  isExpanded: boolean;
  assignmentTitle?: string;
  assignmentDescription?: string;
  estimatedDuration?: number;
  durationUnit?: "minutes" | "hours" | "days";
  assignmentInstructions?: string;
  instructionalVideo?: {
    file: File | null;
    url?: string;
  };
  downloadableResource?: {
    file: File | null;
    url?: string;
    name?: string;
  };
  assignmentQuestions?: any[];
  solutionVideo?: {
    file: File | null;
    url?: string;
  };
  isPublished: boolean;
}

interface CourseBuilderProps {
  onSaveNext?: () => void;
  courseId: number | undefined;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({
  onSaveNext,
  courseId,
}) => {
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] =
    useState<boolean>(false);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(
    ResourceTabType.DOWNLOADABLE_FILE
  );
  const [showSectionForm, setShowSectionForm] = useState<boolean>(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [draggedLecture, setDraggedLecture] = useState<string | null>(null);
  const [showInfoBox, setShowInfoBox] = useState<boolean>(true);
  const [showNewFeatureAlert, setShowNewFeatureAlert] = useState<boolean>(true);
  const [dragTarget, setDragTarget] = useState<{
    sectionId: string | null;
    lectureId: string | null;
  }>({ sectionId: null, lectureId: null });

  // Existing coding exercise modal state
  const [showCodingExerciseCreator, setShowCodingExerciseCreator] =
    useState<boolean>(false);
  const [currentCodingExercise, setCurrentCodingExercise] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);

  // NEW: Assignment editor state
  const [showAssignmentEditor, setShowAssignmentEditor] =
    useState<boolean>(false);
  const [currentAssignment, setCurrentAssignment] = useState<{
    sectionId: string;
    lectureId: string;
    data: ExtendedLecture;
  } | null>(null);

  const {
    sections,
    setSections,
    addSection,
    addLecture,
    deleteSection,
    deleteLecture,
    toggleSectionExpansion,
    updateSectionName,
    updateLectureName,
    moveSection,
    moveLecture,
    updateLectureContent,
    saveDescription: saveSectionDescription,
    updateLectureWithUploadedContent,
    handleLectureDrop,
    savePracticeCode,
  } = useSections([]);

  const contentSectionModal = useModal();

  const {
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileUpload,
    handleFileSelection,
  } = useFileUpload(updateLectureWithUploadedContent, () => {});

  const {
    updateCourseSections,
    loading: mutationLoading,
    error: mutationError,
  } = useCourseSectionsUpdate();

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      // Fix for the closest method by casting to Element instead of Node
      const target = e.target as Element;
      if (editingSectionId && !target.closest(".section-edit")) {
        setEditingSectionId(null);
      }

      if (editingLectureId && !target.closest(".lecture-edit")) {
        setEditingLectureId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingSectionId, editingLectureId]);

  const [activeContentSection, setActiveContentSection] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);

  const [activeDescriptionSection, setActiveDescriptionSection] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);

  // Existing coding exercise handlers
  const handleOpenCodingExerciseModal = (
    sectionId: string,
    lectureId: string
  ) => {
    setCurrentCodingExercise({ sectionId, lectureId });
    setShowCodingExerciseCreator(true);
  };

  const handleSaveCodingExercise = (updatedLecture: any) => {
    if (!currentCodingExercise) return;

    setSections(
      sections.map((section) => {
        if (section.id === currentCodingExercise.sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === updatedLecture.id
                ? {
                    ...lecture,
                    name: updatedLecture.name || lecture.name,
                    codeLanguage: updatedLecture.codeLanguage,
                    version: updatedLecture.version,
                  }
                : lecture
            ),
          };
        }
        return section;
      })
    );

    setShowCodingExerciseCreator(false);
    setCurrentCodingExercise(null);
    toast.success("Coding exercise updated successfully!");
  };

  // NEW: Assignment editor handlers
  const handleOpenAssignmentEditor = (assignmentData: ExtendedLecture) => {
    // Find the section and lecture IDs
    let foundSectionId = "";
    let foundLectureId = assignmentData.id;

    for (const section of sections) {
      const lecture = section.lectures.find((l) => l.id === assignmentData.id);
      if (lecture) {
        foundSectionId = section.id;
        break;
      }
    }

    setCurrentAssignment({
      sectionId: foundSectionId,
      lectureId: foundLectureId,
      data: assignmentData,
    });
    setShowAssignmentEditor(true);
  };

  const handleSaveAssignment = (updatedAssignment: ExtendedLecture) => {
    if (!currentAssignment) return;

    // Update the sections state with the assignment changes
    setSections(
      sections.map((section) => {
        if (section.id === currentAssignment.sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) =>
              lecture.id === updatedAssignment.id
                ? {
                    ...lecture,
                    name:
                      updatedAssignment.assignmentTitle ||
                      updatedAssignment.name ||
                      lecture.name,
                    title:
                      updatedAssignment.assignmentTitle ||
                      updatedAssignment.title ||
                      lecture.title,
                    description:
                      updatedAssignment.assignmentDescription ||
                      lecture.description,
                    // Add all the assignment-specific fields
                    assignmentTitle: updatedAssignment.assignmentTitle,
                    assignmentDescription:
                      updatedAssignment.assignmentDescription,
                    estimatedDuration: updatedAssignment.estimatedDuration,
                    durationUnit: updatedAssignment.durationUnit,
                    assignmentInstructions:
                      updatedAssignment.assignmentInstructions,
                    instructionalVideo: updatedAssignment.instructionalVideo,
                    downloadableResource:
                      updatedAssignment.downloadableResource,
                    assignmentQuestions: updatedAssignment.assignmentQuestions,
                    solutionVideo: updatedAssignment.solutionVideo,
                  }
                : lecture
            ),
          };
        }
        return section;
      })
    );

    // Close the assignment editor
    setShowAssignmentEditor(false);
    setCurrentAssignment(null);

    // Show success message
    toast.success("Assignment updated successfully!");
  };

  const handleCloseAssignmentEditor = () => {
    setShowAssignmentEditor(false);
    setCurrentAssignment(null);
  };

  // Rest of your existing handlers remain the same...
  const toggleContentSection = (sectionId: string, lectureId: string) => {
    if (
      activeContentSection &&
      activeContentSection.sectionId === sectionId &&
      activeContentSection.lectureId === lectureId
    ) {
      setActiveContentSection(null);
    } else {
      setActiveContentSection({ sectionId, lectureId });
    }
  };

  const toggleDescriptionEditor = (
    sectionId: string,
    lectureId: string,
    description?: string
  ) => {
    if (
      activeDescriptionSection &&
      activeDescriptionSection.sectionId === sectionId &&
      activeDescriptionSection.lectureId === lectureId
    ) {
      setActiveDescriptionSection(null);

      if (description !== undefined && description.trim() !== "") {
        if (
          !activeContentSection ||
          activeContentSection.sectionId !== sectionId ||
          activeContentSection.lectureId !== lectureId
        ) {
          setActiveContentSection({ sectionId, lectureId });
        }
      }
    } else {
      setActiveDescriptionSection({ sectionId, lectureId });
      setCurrentDescription(description || "");
    }
  };

  const toggleAddResourceModal = (sectionId: string, lectureId: string) => {
    contentSectionModal.toggle(sectionId, lectureId);
  };

  // Rest of your existing handlers (handleDragStart, handleDragEnd, etc.) remain the same...
  const handleDragStart = (
    e: React.DragEvent,
    sectionId: string,
    lectureId?: string
  ) => {
    e.stopPropagation();
    setIsDragging(true);

    if (lectureId) {
      setDraggedLecture(lectureId);
      e.dataTransfer.setData("lectureId", lectureId);
    } else {
      setDraggedSection(sectionId);
    }

    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedSection(null);
    setDraggedLecture(null);
    setDragTarget({ sectionId: null, lectureId: null });
  };

  const handleDragOver = (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    setDragTarget({
      sectionId: targetSectionId,
      lectureId: targetLectureId || null,
    });
  };

  const handleDrop = (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => {
    e.preventDefault();
    setIsDragging(false);

    const sourceSectionId = e.dataTransfer.getData("sectionId");
    const sourceLectureId = e.dataTransfer.getData("lectureId");

    if (!sourceSectionId) return;

    if (sourceLectureId && sourceLectureId.trim() !== "") {
      handleLectureDrop(
        sourceSectionId,
        sourceLectureId,
        targetSectionId,
        targetLectureId
      );
      return;
    }

    if (!targetLectureId) {
      const sourceIndex = sections.findIndex((s) => s.id === sourceSectionId);
      const targetIndex = sections.findIndex((s) => s.id === targetSectionId);

      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return;
      }

      const newSections = [...sections];
      const [movedSection] = newSections.splice(sourceIndex, 1);
      newSections.splice(targetIndex, 0, movedSection);

      setSections(newSections);
      toast.success("Section moved successfully");
    }
  };

  const handleDragLeave = () => {
    setDragTarget({ sectionId: null, lectureId: null });
  };

  const handleAddSection = (title: string, objective: string) => {
    addSection(title, objective);
    setShowSectionForm(false);
  };

  const getFormattedSectionsForPreview = () => {
    return sections.map((section) => {
      // Separate content by type
      const lectures = section.lectures.filter(
        (lecture) =>
          !lecture.contentType ||
          lecture.contentType === "video" ||
          lecture.contentType === "article"
      );

      const quizzes = section.lectures
        .filter((lecture) => lecture.contentType === "quiz")
        .map((lecture) => ({
          id: lecture.id,
          name: lecture.name || lecture.title || "Quiz",
          description: lecture.description || "",
          questions: lecture.questions || [],
          duration: "10min",
          contentType: "quiz",
        }));

      const assignments = section.lectures
        .filter((lecture) => lecture.contentType === "assignment")
        .map((lecture) => ({
          id: lecture.id,
          name: lecture.name || lecture.title || "Assignment",
          description: lecture.description || "",
          duration: lecture.estimatedDuration
            ? `${lecture.estimatedDuration}${lecture.durationUnit || "min"}`
            : "30min",
          contentType: "assignment",
        }));

      const codingExercises = section.lectures
        .filter((lecture) => lecture.contentType === "coding-exercise")
        .map((lecture) => ({
          id: lecture.id,
          name: lecture.name || lecture.title || "Coding Exercise",
          description: lecture.description || "",
          duration: "15min",
          contentType: "coding-exercise",
        }));

      return {
        id: section.id,
        name: section.name,
        lectures: lectures,
        quizzes: quizzes,
        assignments: assignments,
        codingExercises: codingExercises,
        isExpanded: section.isExpanded !== false,
      };
    });
  };

  const handleSaveCourseSections = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();

    try {
      const courseSections: CourseSectionInput[] = sections.map((section) => {
        const lectures: LectureInput[] = section.lectures.map((lecture) => ({
          name: lecture.name ?? lecture.title ?? "",
          description: lecture.description || "",
          captions: lecture.captions || "",
          lectureNotes: lecture.lectureNotes || "",
          attachedFiles: {
            action: "ADD",
            attachedFile: lecture.attachedFiles.map((file) => ({
              url: file.url,
            })),
          },
          videoUrls: {
            action: "ADD",
            videos: lecture.videos.map((video) => ({ url: video.url })),
          },
          code: lecture.code,
          codeLanguage: lecture.codeLanguage,
        }));

        return {
          sectionName: section.name,
          lectures: lectures,
        };
      });

      const courseIdNumber =
        typeof courseId === "string" ? parseInt(courseId, 10) : courseId;
      const result = await updateCourseSections({
        courseId: courseIdNumber,
        courseSections,
      });

      if (result.updateCourseInfo.success) {
        toast.success("Course curriculum saved successfully!");
        if (onSaveNext) onSaveNext();
      } else {
        toast.error(
          result.updateCourseInfo.message || "Failed to save course curriculum"
        );
      }
    } catch (error) {
      console.error("Error saving course curriculum:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  const findLecture = (sectionId: string, lectureId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return null;

    return section.lectures.find((l) => l.id === lectureId) || null;
  };

  // NEW: Check if assignment editor is open and render it
  if (showAssignmentEditor && currentAssignment) {
    return (
      <AssignmentEditor
        initialData={currentAssignment.data}
        onClose={handleCloseAssignmentEditor}
        onSave={handleSaveAssignment}
      />
    );
  }

  return (
    <div className="xl:max-w-5xl max-w-full mx-auto shadow-xl">
      <div className="flex justify-between items-center mb-4 border-b px-10 border-gray-300 pb-5">
        <h1 className="text-xl font-bold text-gray-800">Curriculum</h1>
        <button className="px-3 py-1.5 bg-white text-[#6D28D2] border border-[#6D28D2] rounded-md text-sm font-medium hover:bg-indigo-50">
          Bulk Uploader
        </button>
      </div>
      <div className="p-4 pb-0 shadow-xl px-10">
        <div className="mt-8">
          {showInfoBox && <InfoBox onDismiss={() => setShowInfoBox(false)} />}

          <div className="text-sm text-gray-700 mb-2">
            Start putting together your course by creating sections, lectures
            and practice (quizzes, coding exercises and assignments).
          </div>
          <div className="text-sm text-gray-700 mb-4">
            <span>
              Start putting together your course by creating sections, lectures
              and practice activities{" "}
            </span>
            <span className="text-[#6D28D2]">
              (quizzes, coding exercises and assignments)
            </span>
            <span>. Use your </span>
            <span className="text-[#6D28D2]">course outline</span>
            <span>
              {" "}
              to structure your content and label your sections and lectures
              clearly. If you're intending to offer your course for free, the
              total length of video content must be less than 2 hours.
            </span>
          </div>

          {showNewFeatureAlert && (
            <NewFeatureAlert onDismiss={() => setShowNewFeatureAlert(false)} />
          )}
          <button
            onClick={() => setShowSectionForm(true)}
            className="relative w-16 h-8 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-r-[45px]"
            aria-label="Add section"
          >
            <Plus className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="bg-white border border-gray-200 mb-6 mt-20">
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <SectionItem
                key={section.id}
                section={section}
                index={index}
                totalSections={sections.length}
                editingSectionId={editingSectionId}
                setEditingSectionId={setEditingSectionId}
                updateSectionName={updateSectionName}
                deleteSection={deleteSection}
                moveSection={moveSection}
                toggleSectionExpansion={toggleSectionExpansion}
                isDragging={isDragging}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragOver={(e) => handleDragOver(e, section.id)}
                handleDragLeave={handleDragLeave}
                handleDrop={(e) => handleDrop(e, section.id)}
                addLecture={addLecture}
                editingLectureId={editingLectureId}
                setEditingLectureId={setEditingLectureId}
                updateLectureName={updateLectureName}
                deleteLecture={deleteLecture}
                moveLecture={moveLecture}
                toggleContentSection={contentSectionModal.toggle}
                toggleAddResourceModal={toggleAddResourceModal}
                toggleDescriptionEditor={toggleDescriptionEditor}
                activeContentSection={contentSectionModal.activeSection}
                addCurriculumItem={() => setShowContentTypeSelector(true)}
                savePracticeCode={savePracticeCode}
                draggedSection={draggedSection}
                draggedLecture={draggedLecture}
                dragTarget={dragTarget}
                saveDescription={saveSectionDescription}
                openCodingExerciseModal={handleOpenCodingExerciseModal}
                // NEW: Pass the assignment editor handler
                onEditAssignment={handleOpenAssignmentEditor}
                allSections={getFormattedSectionsForPreview()}
              />
            ))
          ) : (
            <div className="flex justify-center border border-gray-400 bg-gray-100 items-center min-h-10 ">
              {/* This is an empty state for when there are no sections */}
            </div>
          )}

          {showContentTypeSelector && (
            <div className="absolute z-10 left-0 mt-2">
              <ContentTypeSelector
                sectionId={
                  sections.length > 0 ? sections[sections.length - 1].id : ""
                }
                onSelect={addLecture}
                onClose={() => setShowContentTypeSelector(false)}
              />
            </div>
          )}
        </div>

        {showSectionForm && (
          <div className="pb-20">
            <SectionForm
              onAddSection={handleAddSection}
              onCancel={() => setShowSectionForm(false)}
            />
          </div>
        )}

        {!showSectionForm && (
          <button
            onClick={() => setShowSectionForm(true)}
            className="inline-flex items-center mb-8 px-3 py-1.5 border border-[#6D28D2] text-[#6D28D2] bg-white rounded text-sm font-bold hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4 mr-1" color="#666" />
            Section
          </button>
        )}
      </div>

      {/* Hidden file input for file uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (!contentSectionModal.activeSection) return;

          const contentType = fileInputRef.current
            ?.getAttribute("accept")
            ?.includes("video")
            ? ContentType.VIDEO
            : ContentType.FILE;

          handleFileSelection(
            e,
            contentType,
            contentSectionModal.activeSection.sectionId,
            contentSectionModal.activeSection.lectureId
          );
        }}
        className="hidden"
      />

      {/* Existing coding exercise modal */}
      {showCodingExerciseCreator && currentCodingExercise && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-auto">
          <CodingExerciseCreator
            lectureId={currentCodingExercise.lectureId}
            onClose={() => {
              setShowCodingExerciseCreator(false);
              setCurrentCodingExercise(null);
            }}
            onSave={handleSaveCodingExercise}
            initialData={
              findLecture(
                currentCodingExercise.sectionId,
                currentCodingExercise.lectureId
              ) ?? undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;

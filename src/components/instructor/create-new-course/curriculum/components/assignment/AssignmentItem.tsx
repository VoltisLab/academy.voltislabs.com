"use client";
import React, { useRef, useEffect, useState } from "react";
import { ExtendedLecture, Lecture } from "@/lib/types";
import {
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Edit,
} from "lucide-react";
import { FaCircleCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface AssignmentItemProps {
  lecture: ExtendedLecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (
    sectionId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => void;
  handleDragStart: (
    e: React.DragEvent,
    sectionId: string,
    lectureId?: string
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => void;
  isDragging?: boolean;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
  // Add the missing prop
  onEditAssignment?: (lecture: ExtendedLecture) => void;
  allSections: any[];
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({
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
  dragTarget,
  onEditAssignment, // Now properly typed
}) => {
    const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (editingLectureId === lecture.id && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLectureId(lecture.id);
  };


  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/assignment/edit-assignment/${lecture.id}`); // adjust the URL path as needed
  };


  // const handleEditClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (onEditAssignment) {
  //     // Convert Lecture to ExtendedLecture for the assignment editor
  //     const extendedLecture: ExtendedLecture = {
  //       ...lecture,
  //       assignmentTitle:
  //         lecture.assignmentTitle || lecture.name || lecture.title || "",
  //       assignmentDescription:
  //         lecture.assignmentDescription || lecture.description || "",
  //       estimatedDuration: lecture.estimatedDuration || 0,
  //       durationUnit: lecture.durationUnit || "minutes",
  //       assignmentInstructions: lecture.assignmentInstructions || "",
  //       instructionalVideo: lecture.instructionalVideo || { file: null },
  //       downloadableResource: lecture.downloadableResource || {
  //         file: null,
  //         name: "",
  //       },
  //       assignmentQuestions: lecture.assignmentQuestions || [],
  //       solutionVideo: lecture.solutionVideo || { file: null },
  //       isPublished:
  //         lecture.isPublished !== undefined ? lecture.isPublished : false,
  //     };
  //     onEditAssignment(extendedLecture);
  //   }
  // };
  return (
    <div
      className={`mb-3 bg-white border border-gray-300 ${
        draggedLecture === lecture.id ? "opacity-50" : ""
      } ${
        dragTarget?.lectureId === lecture.id ? "border-2 border-indigo-500" : ""
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center p-2 w-full">
        <div className="flex-1 flex items-center">
          {editingLectureId === lecture.id ? (
            <input
              ref={nameInputRef}
              type="text"
              value={lecture.name || ""}
              onChange={(e) =>
                updateLectureName(sectionId, lecture.id, e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingLectureId(null);
                }
              }}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex flex-row items-center gap-2">
              <h3 className=" text-xs text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                {lecture.isPublished ? (
                  <>
                    <div className="w-max shrink-0 flex items-center gap-3">
                      <FaCircleCheck size={16} className="shrink-0" />
                      <p className="w-max">Assignment {lectureIndex + 1}:</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mr-1 text-xs text-yellow-500">⚠</div>
                    Unpublished Assignment:
                  </>
                )}
                <FileText size={16} className="shrink-0 ml-1" />{" "}
                {lecture.name || lecture.title || "Assignment"}
              </h3>
              <div className="flex flex-row gap-1">
                <button
                  onClick={handleEditClick}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit Assignment"
                >
                  <Edit className="w-4 h-4" />
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
            </div>
          )}
        </div>
        <div
          className={`flex items-center space-x-1 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, "up");
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={lectureIndex === 0}
            >
              <ChevronUp
                className={`w-4 h-4 ${lectureIndex === 0 ? "opacity-50" : ""}`}
              />
            </button>
          </div>

          <div
            className={`transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveLecture(sectionId, lecture.id, "down");
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={lectureIndex === totalLectures - 1}
            >
              <ChevronDown
                className={`w-4 h-4 ${
                  lectureIndex === totalLectures - 1 ? "opacity-50" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentItem;

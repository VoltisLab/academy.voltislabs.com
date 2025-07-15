import React, { useState } from "react";
import { Lecture } from "@/lib/types";
import { Trash2, Edit3, Code, AlignJustify } from "lucide-react";
import { DeleteItemFn } from "../section/SectionItem";
import { CourseSectionAssignnments } from "@/api/course/section/queries";

interface CodingExerciseItemProps {
  lecture: CourseSectionAssignnments;
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
  deleteLecture: DeleteItemFn;
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
  isDragging: boolean;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
  // Modified to be a required prop since we always want to use the modal
  customEditHandler: (lectureId: string) => void;
  allSections: any[];
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
  allSections,
  dragTarget,
  // Required edit handler for opening the modal
  customEditHandler,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Always use the customEditHandler to open the modal
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    customEditHandler(lecture.id);
  };

  return (
    <div
      className={`mb-3 py-1.5 bg-white border border-gray-500 ${
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
      <div className="flex items-center p-2">
        <div className="flex-1 flex items-center">
          <div className="mr-1 text-xs text-orange-500">⚠</div>
          {/* Removed the inline editing input field - we only show the name now */}
          <div className="flex flex-row gap-1">
            <div className="flex items-center text-gray-800">
              <span className="text-gray-800 font-medium text-sm">
                Unpublished Coding Exercise{" "}
              </span>
              <span className="ml-2 px-1 font-medium rounded-full">
                <Code size={14} />
              </span>
              <span className="ml-1 xl:text-sm font-medium text-sm">
                {lecture.title || ""}
              </span>
            </div>

            {isHovering && (
              <div>
                {/* Edit button now always triggers the modal */}
                <button
                  onClick={handleEditClick}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLecture("lecture", lecture.id, sectionId);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        {isHovering && (
          <AlignJustify className="w-5 h-5 text-gray-500 cursor-move" />
        )}
      </div>
    </div>
  );
};

export default CodingExerciseItem;

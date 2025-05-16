import React, { useState } from 'react';
import { Lecture, ContentItemType } from '@/lib/types';
import CodingExerciseItem from './CodingExcerciseItem';
import CodingExerciseCreator from './CodingExcerciseCreator';

interface LectureProps {
    id: string;
    name: string;
    type: string;
}

// Convert the simplified LectureProps to the full Lecture type
const convertToLecture = (lectureProps: LectureProps): Lecture => {
  return {
    id: lectureProps.id,
    name: lectureProps.name,
    // Required fields from Lecture interface
    description: "",
    captions: "",
    lectureNotes: "",
    attachedFiles: [],
    videos: [],
    contentType: lectureProps.type as ContentItemType,
    isExpanded: false,
    // Optional fields can be omitted or set to defaults as needed
    language: "",
    version: "",
    code: "",
    codeLanguage: ""
  };
};

const CodingExerciseManager = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLecture, setDraggedLecture] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<{sectionId: string | null, lectureId: string | null}>({
    sectionId: null, 
    lectureId: null
  });
  
  const [lectures, setLectures] = useState<LectureProps[]>([
    { id: 'lecture1', name: 'Introduction to React Hooks', type: 'coding-exercise' },
    { id: 'lecture2', name: 'Building a Face Recognition App', type: 'coding-exercise' },
    { id: 'lecture3', name: 'Working with APIs', type: 'coding-exercise' },
  ]);

  // Mock functions that would be passed to CodingExerciseItem
  const updateLectureName = (sectionId: string, lectureId: string, newName: string) => {
    setLectures(lectures.map(lecture => 
      lecture.id === lectureId ? { ...lecture, name: newName } : lecture
    ));
  };

  const deleteLecture = (sectionId: string, lectureId: string) => {
    setLectures(lectures.filter(lecture => lecture.id !== lectureId));
  };

  const moveLecture = (sectionId: string, lectureId: string, direction: 'up' | 'down') => {
    // Implementation for moving lectures
    console.log(`Moving lecture ${lectureId} ${direction}`);
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string, lectureId?: string) => {
    if (lectureId) {
      setDraggedLecture(lectureId);
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedLecture(null);
    setDragTarget({ sectionId: null, lectureId: null });
  };

  const handleDragLeave = () => {
    // You can implement behavior when drag leaves an element
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => {
    if (draggedLecture && targetLectureId && draggedLecture !== targetLectureId) {
      // Reorder logic would go here
      console.log(`Dropped ${draggedLecture} onto ${targetLectureId}`);
    }
    handleDragEnd();
  };

  // This is the key function that will be triggered from the edit button
  const handleEditClick = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    setShowCreator(true);
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setCurrentLectureId(null);
  };

  // Function to handle lecture updates from the creator
  const handleLectureUpdate = (updatedLecture: Partial<Lecture>) => {
    const currentLecture = lectures.find(l => l.id === updatedLecture.id);
    if (currentLecture) {
      // Update only the properties that can be safely transferred to LectureProps
      const updatedLectureProps: LectureProps = {
        ...currentLecture,
        name: updatedLecture.name || currentLecture.name,
        // You can map other properties as needed
      };
      
      setLectures(lectures.map(lecture => 
        lecture.id === updatedLecture.id ? updatedLectureProps : lecture
      ));
    }
    setShowCreator(false);
    setCurrentLectureId(null);
  };

  return (
    <div className="p-4">
      {!showCreator ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Coding Exercises</h2>
          <div className="space-y-3">
            {lectures.map((lectureProps, index) => {
              // Convert LectureProps to Lecture before passing to CodingExerciseItem
              const lecture = convertToLecture(lectureProps);
              
              return (
                <CodingExerciseItem
                  key={lecture.id}
                  lecture={lecture}
                  lectureIndex={index}
                  totalLectures={lectures.length}
                  sectionId="section1"
                  editingLectureId={editingLectureId}
                  setEditingLectureId={setEditingLectureId}
                  updateLectureName={updateLectureName}
                  deleteLecture={deleteLecture}
                  moveLecture={moveLecture}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleDragEnd={handleDragEnd}
                  handleDragLeave={handleDragLeave}
                  isDragging={isDragging}
                  draggedLecture={draggedLecture}
                  dragTarget={dragTarget}
                  customEditHandler={handleEditClick}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <CodingExerciseCreator 
          lectureId={currentLectureId} 
          onClose={handleCloseCreator}
          onSave={handleLectureUpdate}
          initialData={lectures.find(l => l.id === currentLectureId) 
            ? convertToLecture(lectures.find(l => l.id === currentLectureId)!) 
            : undefined}
        />
      )}
    </div>
  );
};

export default CodingExerciseManager;
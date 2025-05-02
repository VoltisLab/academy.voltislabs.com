// hooks/useSections.tsx
import { useState } from 'react';
import {  Lecture, ContentType, ContentItemType } from '@/lib/types';
import { generateId, sectionObject } from '@/lib/utils';
import { toast } from 'react-hot-toast';
interface Section {
    isExpanded: boolean;
    id:string;
    name: string;
    lectures: Lecture[];
    editing: boolean;
    lectureEditing: boolean[];
  }
export const useSections = (initialSections: Section[] = [sectionObject]) => {
  const [sections, setSections] = useState<Section[]>(initialSections);

  // Add a new section
  const addSection = () => {
    const newSection: Section = {
        id: generateId(),
        name: "New Section",
        lectures: [],
        editing: false,
        lectureEditing: [],
        isExpanded: false
    };
    
    setSections([...sections, newSection]);
    return newSection.id;
  };

  // Add a new lecture to a section
  const addLecture = (sectionId: string, contentType: ContentItemType = 'video') => {
    const getLectureName = () => {
      switch(contentType) {
        case 'video': return "New Lecture";
        case 'article': return "New Article";
        case 'quiz': return "New Quiz";
        case 'coding-exercise': return "New Coding Exercise";
        case 'assignment': return "New Assignment";
        case 'practice': return "New Practice";
        case 'role-play': return "New Role Play";
        default: return "New Item";
      }
    };

    const newLecture: Lecture = {
        id: generateId(),
        name: getLectureName(),
        title: "",
        description: "",
        captions: "",
        lectureNotes: "",
        attachedFiles: [],
        videos: [],
        contentType: contentType,
        isExpanded: false
    };
    
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: [...section.lectures, newLecture]
        };
      }
      return section;
    }));
    
    return newLecture.id;
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast.error("You must have at least one section");
      return false;
    }
    setSections(sections.filter(section => section.id !== sectionId));
    toast.success("Section deleted");
    return true;
  };

  // Delete a lecture
  const deleteLecture = (sectionId: string, lectureId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.filter(lecture => lecture.id !== lectureId)
        };
      }
      return section;
    }));
    toast.success("Curriculum item deleted");
  };

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          isExpanded: !section.isExpanded
        };
      }
      return section;
    }));
  };

  // Update section name
  const updateSectionName = (sectionId: string, newName: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          name: newName
        };
      }
      return section;
    }));
  };

  // Update lecture name
  const updateLectureName = (sectionId: string, lectureId: string, newName: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId) {
              return {
                ...lecture,
                name: newName
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
  };

  // Move section up or down
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === sectionId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return; // Can't move further up/down
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newSections = [...sections];
    const [movedSection] = newSections.splice(currentIndex, 1);
    newSections.splice(newIndex, 0, movedSection);
    
    setSections(newSections);
  };

  // Move lecture up or down within a section
  const moveLecture = (sectionId: string, lectureId: string, direction: 'up' | 'down') => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const lectures = [...section.lectures];
        const currentIndex = lectures.findIndex(lecture => lecture.id === lectureId);
        
        if (
          (direction === 'up' && currentIndex === 0) || 
          (direction === 'down' && currentIndex === lectures.length - 1)
        ) {
          return section; // Can't move further up/down
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const [movedLecture] = lectures.splice(currentIndex, 1);
        lectures.splice(newIndex, 0, movedLecture);
        
        return { ...section, lectures };
      }
      return section;
    }));
  };
  
  // Update lecture content (description, captions, notes)
  const updateLectureContent = (sectionId: string, lectureId: string, contentType: ContentType, value: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId) {
              if (contentType === ContentType.CAPTIONS) {
                return { ...lecture, captions: value };
              } else if (contentType === ContentType.LECTURE_NOTES) {
                return { ...lecture, lectureNotes: value };
              } else if (contentType === ContentType.FILE || contentType === ContentType.VIDEO) {
                // handle in uploadContent
                return lecture;
              }
            }
            return lecture;
          })
        };
      }
      return section;
    }));
  };
  
  // Save description
  const saveDescription = (sectionId: string, lectureId: string, description: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId) {
              return {
                ...lecture,
                description: description
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Description saved");
  };
  
  // Update lecture with uploaded content
  const updateLectureWithUploadedContent = (
    sectionId: string, 
    lectureId: string, 
    contentType: ContentType, 
    fileUrl: string, 
    fileName: string
  ) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId) {
              if (contentType === ContentType.VIDEO) {
                return {
                  ...lecture,
                  videos: [...lecture.videos, { url: fileUrl, name: fileName }]
                };
              } else if (contentType === ContentType.FILE) {
                return {
                  ...lecture,
                  attachedFiles: [...lecture.attachedFiles, { url: fileUrl, name: fileName }]
                };
              }
            }
            return lecture;
          })
        };
      }
      return section;
    }));
  };
  
  // Handle drag-and-drop for lectures
  const handleLectureDrop = (
    sourceSectionId: string, 
    sourceLectureId: string,
    targetSectionId: string, 
    targetLectureId?: string
  ) => {
    const sourceSection = sections.find(s => s.id === sourceSectionId);
    const targetSection = sections.find(s => s.id === targetSectionId);

    if (!sourceSection || !targetSection || !sourceLectureId) return;
    if (sourceSectionId === targetSectionId && sourceLectureId === targetLectureId) return;

    const sourceLecture = sourceSection.lectures.find(l => l.id === sourceLectureId);
    if (!sourceLecture) return;

    const updatedSourceLectures = sourceSection.lectures.filter(l => l.id !== sourceLectureId);
    const updatedTargetLectures = [...targetSection.lectures];
    const targetIndex = targetLectureId
      ? updatedTargetLectures.findIndex(l => l.id === targetLectureId) + 1
      : updatedTargetLectures.length;

    updatedTargetLectures.splice(targetIndex, 0, sourceLecture);

    setSections(sections.map(section => {
      if (section.id === sourceSectionId) {
        return { ...section, lectures: updatedSourceLectures };
      }
      if (section.id === targetSectionId) {
        return { ...section, lectures: updatedTargetLectures };
      }
      return section;
    }));
  };
  
  return {
    sections,
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
    saveDescription,
    updateLectureWithUploadedContent,
    handleLectureDrop
  };
};
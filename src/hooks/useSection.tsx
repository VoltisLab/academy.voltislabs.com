// hooks/useSections.tsx
import { useState } from 'react';
import { Lecture, ContentType, ContentItemType, Question } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface Section {
  isExpanded: boolean;
  id: string;
  name: string;
  lectures: Lecture[];
  editing: boolean;
  lectureEditing: boolean[];
  objective?: string;
}

export const useSections = (initialSections: Section[] = []) => {
  // Fix: Use the initialSections parameter
  const [sections, setSections] = useState<Section[]>(initialSections);

  // Modified to accept name and objective parameters
  const addSection = (name: string = "New Section", objective?: string) => {
    const newSection: Section = {
      id: generateId(),
      name: name,
      objective: objective,
      lectures: [],
      editing: false,
      lectureEditing: [],
      isExpanded: true
    };
    
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => [...prevSections, newSection]);
    toast.success("Section added");
    return newSection.id;
  };

  // Add a new lecture to a section with custom title
  const addLecture = (sectionId: string, contentType: ContentItemType, title?: string): string => {
    console.log("Adding lecture with title:", title);
    
    const newLecture: Lecture = {
      id: generateId(),
      name: title,
      title: title,
      description: "",
      captions: "",
      lectureNotes: "",
      attachedFiles: [],
      videos: [],
      contentType: contentType,
      isExpanded: true,
      // New fields for practice coding exercise
      code: contentType === 'practice' ? getDefaultCodeTemplate('javascript') : undefined,
      codeLanguage: contentType === 'practice' ? 'javascript' : undefined,
      externalResources: []
    };
  
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: [...section.lectures, newLecture]
        };
      }
      return section;
    }));
  
    toast.success(`New ${contentType} added`);
    
    return newLecture.id;
  };

  // Default code templates based on language
  const getDefaultCodeTemplate = (language: string): string => {
    switch (language) {
      case 'javascript':
        return '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution() {\n  // Your solution goes here\n  \n  return result;\n}\n';
      case 'typescript':
        return '// TypeScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution(): any {\n  // Your solution goes here\n  \n  return result;\n}\n';
      case 'python':
        return '# Python Code\nprint("Hello, World!")\n\n# Write your code here\ndef solution():\n    # Your solution goes here\n    \n    return result\n';
      default:
        return `// ${language} Code\n// Write your code here\n`;
    }
  };

  // Save practice code
  const savePracticeCode = (sectionId: string, lectureId: string, code: string, language: string) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId && lecture.contentType === 'practice') {
              return {
                ...lecture,
                code: code,
                codeLanguage: language
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Code saved successfully");
  };

  // Add external resource to practice exercise
  const addExternalResource = (sectionId: string, lectureId: string, url: string, name: string, title: string) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === lectureId) {
              const resources = [...(lecture.externalResources || [])];
              resources.push({ url, name, title });
              
              return {
                ...lecture,
                externalResources: resources
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Resource added");
  };

  const addQuiz = (sectionId: string, title: string, description: string): string => {
    const quizId = addLecture(sectionId, 'quiz', title);
    
    // Update the description for the newly created quiz
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === quizId) {
              return {
                ...lecture,
                description: description,
                questions: []
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    return quizId;
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    // Fix: Use functional form to check current state
    setSections(prevSections => {
      if (prevSections.length === 1) {
        toast.error("You must have at least one section");
        return prevSections; // Return unchanged state
      }
      toast.success("Section deleted");
      return prevSections.filter(section => section.id !== sectionId);
    });
  };

  // Delete a lecture
  const deleteLecture = (sectionId: string, lectureId: string) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          isExpanded: !section.isExpanded
        };
      }
      return section;
    }));
  };

  // Update section name - MAIN FIX: Use functional form to avoid stale closure
  const updateSectionName = (sectionId: string, newName: string, objective?: string) => {
    console.log("Updating section name:", { sectionId, newName, objective });
    
    setSections(prevSections => {
      const updatedSections = prevSections.map(section => {
        if (section.id === sectionId) {
          console.log("Found section to update:", section.name, "->", newName);
          return {
            ...section,
            name: newName,
            objective: objective !== undefined ? objective : section.objective
          };
        }
        return section;
      });
      
      console.log("Updated sections:", updatedSections);
      return updatedSections;
    });
    
    toast.success("Section updated successfully");
  };

  // Update lecture name
  const updateLectureName = (sectionId: string, lectureId: string, newName: string) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => {
      const currentIndex = prevSections.findIndex(section => section.id === sectionId);
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === prevSections.length - 1)
      ) {
        return prevSections; // Can't move further up/down
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newSections = [...prevSections];
      const [movedSection] = newSections.splice(currentIndex, 1);
      newSections.splice(newIndex, 0, movedSection);
      
      return newSections;
    });
  };

  // Move lecture up or down within a section
  const moveLecture = (sectionId: string, lectureId: string, direction: 'up' | 'down') => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    return description;
  };
  
  // Update lecture with uploaded content
  const updateLectureWithUploadedContent = (
    sectionId: string, 
    lectureId: string, 
    contentType: ContentType, 
    fileUrl: string, 
    fileName: string
  ) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
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
    targetLectureId?: string,
  ) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => {
      // Clone the current sections array to avoid direct state mutation
      const updatedSections = [...prevSections];
      
      // Find the indices of the source and target sections
      const sourceSectionIndex = updatedSections.findIndex(s => s.id === sourceSectionId);
      const targetSectionIndex = updatedSections.findIndex(s => s.id === targetSectionId);
      
      // If either section is not found, abort
      if (sourceSectionIndex === -1 || targetSectionIndex === -1) {
        console.error("Source or target section not found");
        return prevSections;
      }
      
      // Find the source lecture within its section
      const sourceSection = updatedSections[sourceSectionIndex];
      const sourceLectureIndex = sourceSection.lectures.findIndex(l => l.id === sourceLectureId);
      
      // If the source lecture is not found, abort
      if (sourceLectureIndex === -1) {
        console.error("Source lecture not found");
        return prevSections;
      }
      
      // Get a copy of the lecture to be moved
      const lectureCopy = { ...sourceSection.lectures[sourceLectureIndex] };
      
      // Create a new array of lectures for the source section with the lecture removed
      const updatedSourceLectures = sourceSection.lectures.filter(l => l.id !== sourceLectureId);
      
      // Update the source section with the lecture removed
      updatedSections[sourceSectionIndex] = {
        ...sourceSection,
        lectures: updatedSourceLectures
      };
      
      // Handle the target section (which might be the same as the source)
      const targetSection = updatedSections[targetSectionIndex];
      const targetLectures = [...targetSection.lectures];
      
      // Determine where to insert the lecture in the target section
      let insertIndex = targetLectures.length; // Default to the end
      
      if (targetLectureId) {
        // If we have a target lecture ID, find its position
        const targetLectureIndex = targetLectures.findIndex(l => l.id === targetLectureId);
        
        if (targetLectureIndex !== -1) {
          // Insert after the target lecture
          insertIndex = targetLectureIndex + 1;
        }
      }
      
      // Insert the lecture at the determined position
      targetLectures.splice(insertIndex, 0, lectureCopy);
      
      // Update the target section with the new lectures array
      updatedSections[targetSectionIndex] = {
        ...targetSection,
        lectures: targetLectures
      };
      
      return updatedSections;
    });
  };
  
  const updateQuizQuestions = (sectionId: string, quizId: string, questions: Question[]) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === quizId && lecture.contentType === 'quiz') {
              return {
                ...lecture,
                questions: questions
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Quiz questions updated");
  };

  const addQuestionToQuiz = (sectionId: string, quizId: string, question: Question) => {
    // Fix: Use functional form to avoid stale closure
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === quizId && lecture.contentType === 'quiz') {
              return {
                ...lecture,
                questions: [...(lecture.questions || []), question]
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Question added to quiz");
  };
  
  const updateSectionsOrder = (newSectionsArray: Section[]) => {
    setSections(newSectionsArray);
    toast.success("Section moved successfully");
  };

   const updateQuiz = (sectionId: string, quizId: string, title: string, description: string) => {
    setSections(prevSections => prevSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lectures: section.lectures.map(lecture => {
            if (lecture.id === quizId && lecture.contentType === 'quiz') {
              return {
                ...lecture,
                name: title,
                title: title,
                description: description
              };
            }
            return lecture;
          })
        };
      }
      return section;
    }));
    
    toast.success("Quiz updated successfully");
  };
  
  return {
    sections,
    updateQuizQuestions,
    addQuiz,
    addSection,
    addLecture,
    deleteSection,
    updateSectionsOrder,
    handleLectureDrop,
    deleteLecture,
    toggleSectionExpansion,
    updateSectionName,
    updateLectureName,
    moveSection,
    moveLecture,
    updateLectureContent,
    saveDescription,
    updateLectureWithUploadedContent,
    setSections,
    addQuestionToQuiz,
    savePracticeCode,
    addExternalResource,
    getDefaultCodeTemplate,
    updateQuiz
  };
};
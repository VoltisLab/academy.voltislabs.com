import { useCallback, useState } from "react";
import { Lecture, ContentType, ContentItemType, Question } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useSectionService } from "@/services/useSectionService";
import { useQuizOperations } from "@/services/quizService";
import { useLectureService } from "@/services/useLectureService";

interface Section {
  isExpanded: boolean;
  id: string;
  name: string;
  lectures: Lecture[];
  editing: boolean;
  lectureEditing: boolean[];
  objective?: string;
  isPublished: boolean;
  order?: number;
  backendId?: number; // To track the backend section ID
}

interface ChoiceInputType {
  text: string;
  isCorrect: boolean;
  order: number;
}

export const useSections = (
  initialSections: Section[] = [],
  courseId?: number
) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [mainSectionData, setMainSectionData] = useState<any>(null);

  const { createQuiz: createQuizBackend, updateQuiz: updateQuizBackend } =
    useQuizOperations();
  const {
    createSection,
    getCourseSections,
    updateSection,
    loading: sectionLoading,
  } = useSectionService();
  const {
    updateLectureDescription,
    uploadVideoToLecture,
    saveArticleToLecture,
    saveDescriptionToLecture,
    loading: lectureLoading,
    videoUploading,
    videoUploadProgress,
  } = useLectureService();

  const fetchSectionData = async () => {
    try {
      const data = await getCourseSections({ id: Number(courseId) });
      setMainSectionData(data?.courseSections); // ✅ update shared state
      return data;
    } catch (error) {
      console.error("Failed to fetch course sections:", error);
      return null;
    }
  };

  const saveDescription = async (
    sectionId: string,
    lectureId: number,
    description: string
  ) => {
    try {
      const a = await saveDescriptionToLecture(lectureId, description);
      console.log(a);

      // Update local state after successful backend save
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lectures: section.lectures.map((lecture) => {
                if (lecture.id === lectureId.toString()) {
                  return {
                    ...lecture,
                    description: description,
                  };
                }
                return lecture;
              }),
            };
          }
          return section;
        })
      );

      await fetchSectionData();

      // return description;
    } catch (error) {
      console.error("Error saving description:", error);
      throw error;
    }
  };

  // NEW: Upload video to lecture function
  const uploadVideoToBackend = async (
    sectionId: string,
    lectureId: string,
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    try {
      const numericLectureId = parseInt(lectureId);
      if (isNaN(numericLectureId)) {
        throw new Error("Invalid lecture ID");
      }

      const videoUrl = await uploadVideoToLecture(
        numericLectureId,
        videoFile,
        onProgress
      );

      if (videoUrl) {
        // Update local state with video URL
        setSections((prevSections) =>
          prevSections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                lectures: section.lectures.map((lecture) => {
                  if (lecture.id === lectureId) {
                    return {
                      ...lecture,
                      videos: [
                        ...lecture.videos,
                        { url: videoUrl, name: videoFile.name },
                      ],
                      // Store video URL for easy access
                      videoUrl: videoUrl,
                    };
                  }
                  return lecture;
                }),
              };
            }
            return section;
          })
        );
      }

      return videoUrl;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  // NEW: Save article content to backend
  const saveArticleToBackend = async (
    sectionId: string,
    lectureId: string,
    articleContent: string
  ) => {
    try {
      const numericLectureId = parseInt(lectureId);
      if (isNaN(numericLectureId)) {
        throw new Error("Invalid lecture ID");
      }

      const a = await saveArticleToLecture(numericLectureId, articleContent);

      await fetchSectionData();

      console.log("Hey yosdhsdsbd", mainSectionData);
      console.log("article", a);

      // Update local state after successful backend save
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lectures: section.lectures.map((lecture) => {
                if (lecture.id === lectureId) {
                  return {
                    ...lecture,
                    lectureNotes: articleContent,
                    // Also update description if it's an article-type lecture
                    contentType: "article",
                  };
                }
                return lecture;
              }),
            };
          }
          return section;
        })
      );

      return articleContent;
    } catch (error) {
      console.error("Error saving article:", error);
      throw error;
    }
  };

  // Enhanced updateLectureWithUploadedContent to handle video uploads to backend
  const updateLectureWithUploadedContent = (
    sectionId: string,
    lectureId: string,
    contentType: ContentType,
    fileUrl: string,
    fileName: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                if (contentType === ContentType.VIDEO) {
                  return {
                    ...lecture,
                    videos: [
                      ...lecture.videos,
                      { url: fileUrl, name: fileName },
                    ],
                    videoUrl: fileUrl, // Store the video URL
                  };
                } else if (contentType === ContentType.FILE) {
                  return {
                    ...lecture,
                    attachedFiles: [
                      ...lecture.attachedFiles,
                      { url: fileUrl, name: fileName },
                    ],
                  };
                }
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );
  };

  // Modified to accept name and objective parameters and integrate with backend
  const addSection = async (
    name: string = "New Section",
    objective?: string
  ): Promise<string> => {
    try {
      // Optimistically add section to UI first
      const tempId = generateId();
      const newSection: Section = {
        id: tempId,
        name: name,
        objective: objective,
        lectures: [],
        editing: false,
        lectureEditing: [],
        isExpanded: true,
        isPublished: false,
        order: sections.length + 1,
      };

      setSections((prevSections) => [...prevSections, newSection]);

      // Call backend API if courseId is provided
      if (courseId) {
        try {
          const result = await createSection({
            courseId: courseId,
            order: sections.length + 1,
            title: name,
            description: objective,
          });

          if (result.createSection.success) {
            // Update the section with the backend ID
            setSections((prevSections) =>
              prevSections.map((section) =>
                section.id === tempId
                  ? {
                      ...section,
                      backendId: Number(result.createSection.section.id),
                    }
                  : section
              )
            );
            toast.success("Section created successfully!");
          }
        } catch (error) {
          console.error("Failed to create section on backend:", error);
          // Remove the optimistically added section on error
          setSections((prevSections) =>
            prevSections.filter((section) => section.id !== tempId)
          );
          toast.error(
            error instanceof Error ? error.message : "Failed to create section"
          );
          throw error;
        }
      }
      return tempId;
    } catch (error) {
      console.error("Error in addSection:", error);
      throw error;
    }
  };

  // Add a new lecture to a section with custom title
  const addLecture = (
    sectionId: string,
    contentType: ContentItemType,
    title?: string
  ) => {
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
      isPublished: false,
      // New fields for practice coding exercise
      code:
        contentType === "practice"
          ? getDefaultCodeTemplate("javascript")
          : undefined,
      codeLanguage: contentType === "practice" ? "javascript" : undefined,
      externalResources: [],
    };

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: [...section.lectures, newLecture],
          };
        }
        return section;
      })
    );

    toast.success(`New ${contentType} added`);

    return newLecture.id;
  };

  // Default code templates based on language
  const getDefaultCodeTemplate = (language: string): string => {
    switch (language) {
      case "javascript":
        return '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution() {\n  // Your solution goes here\n  \n  return result;\n}\n';
      case "typescript":
        return '// TypeScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution(): any {\n  // Your solution goes here\n  \n  return result;\n}\n';
      case "python":
        return '# Python Code\nprint("Hello, World!")\n\n# Write your code here\ndef solution():\n    # Your solution goes here\n    \n    return result\n';
      default:
        return `// ${language} Code\n// Write your code here\n`;
    }
  };

  // Save practice code
  const savePracticeCode = (
    sectionId: string,
    lectureId: string,
    code: string,
    language: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (
                lecture.id === lectureId &&
                lecture.contentType === "practice"
              ) {
                return {
                  ...lecture,
                  code: code,
                  codeLanguage: language,
                };
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );

    toast.success("Code saved successfully");
  };

  // Add external resource to practice exercise
  const addExternalResource = (
    sectionId: string,
    lectureId: string,
    url: string,
    name: string,
    title: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                const resources = [...(lecture.externalResources || [])];
                resources.push({ url, name, title });

                return {
                  ...lecture,
                  externalResources: resources,
                };
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );

    toast.success("Resource added");
  };

  const addQuiz = async (
    sectionId: string,
    title: string,
    description?: string
  ): Promise<string> => {
    try {
      // Convert sectionId to number for backend
      const numericSectionId = parseInt(sectionId);

      // Call backend
      const response = await createQuizBackend({
        sectionId: numericSectionId,
        title,
        description,
      });

      console.log("Response from backend:", description);

      const backendQuizId = response.createQuiz.quiz.id.toString();

      // Create local quiz with backend ID
      const newQuiz: Lecture = {
        id: backendQuizId, // Use the backend ID
        name: title,
        title: title,
        description: description,
        attachedFiles: [],
        videos: [],
        contentType: "quiz",
        isExpanded: true,
        isPublished: false,
        externalResources: [],
      };

      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lectures: [...section.lectures, newQuiz],
            };
          }
          return section;
        })
      );

      toast.success(`New Quiz added`);

      return newQuiz.id;
    } catch (error) {
      toast.error("Failed to create quiz");
      console.error(error);
      throw error;
    }
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    setSections((prevSections) => {
      // if (prevSections.length === 1) {
      //   toast.error("You must have at least one section");
      //   return prevSections;
      // }
      return prevSections.filter((section) => section.id !== sectionId);
    });
  };

  // Delete a lecture
  const deleteLecture = (sectionId: string, lectureId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.filter(
              (lecture) => lecture.id !== lectureId
            ),
          };
        }
        return section;
      })
    );
  };

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            isExpanded: !section.isExpanded,
          };
        }
        return section;
      })
    );
  };

  // Update section name - Integrated with backend
  const updateSectionName = async (
    sectionId: string,
    newName: string,
    objective?: string
  ): Promise<void> => {
    try {
      console.log("Updating section name:", { sectionId, newName, objective });

      // Find the section to get backend ID and current order
      const section = sections.find((s) => s.id === sectionId);
      if (!section) {
        throw new Error("Section not found");
      }

      // Optimistically update UI first
      setSections((prevSections) => {
        const updatedSections = prevSections.map((section) => {
          if (section.id === sectionId) {
            console.log(
              "Found section to update:",
              section.name,
              "->",
              newName
            );
            return {
              ...section,
              name: newName,
              objective:
                objective !== undefined ? objective : section.objective,
            };
          }
          return section;
        });

        console.log("Updated sections:", updatedSections);
        return updatedSections;
      });

      // Call backend API if section has backend ID
      if (section.backendId) {
        try {
          const result = await updateSection({
            sectionId: section.backendId,
            title: newName,
            description: objective,
            order: section.order,
          });

          if (result.updateSection.success) {
            toast.success("Section updated successfully");
          }
        } catch (error) {
          console.error("Failed to update section on backend:", error);
          // Revert the optimistic update on error
          setSections((prevSections) =>
            prevSections.map((section) => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  name: section.name, // Keep old name
                  objective: section.objective, // Keep old objective
                };
              }
              return section;
            })
          );
          toast.error(
            error instanceof Error ? error.message : "Failed to update section"
          );
          throw error;
        }
      }
    } catch (error) {
      console.error("Error in updateSectionName:", error);
      throw error;
    }
  };

  // Update lecture name
  const updateLectureName = (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                return {
                  ...lecture,
                  name: newName,
                };
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );
  };

  // Move section up or down
  const moveSection = (sectionId: string, direction: "up" | "down") => {
    setSections((prevSections) => {
      const currentIndex = prevSections.findIndex(
        (section) => section.id === sectionId
      );
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === prevSections.length - 1)
      ) {
        return prevSections;
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const newSections = [...prevSections];
      const [movedSection] = newSections.splice(currentIndex, 1);
      newSections.splice(newIndex, 0, movedSection);

      return newSections;
    });
  };

  // Move lecture up or down within a section
  const moveLecture = (
    sectionId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const lectures = [...section.lectures];
          const currentIndex = lectures.findIndex(
            (lecture) => lecture.id === lectureId
          );

          if (
            (direction === "up" && currentIndex === 0) ||
            (direction === "down" && currentIndex === lectures.length - 1)
          ) {
            return section;
          }

          const newIndex =
            direction === "up" ? currentIndex - 1 : currentIndex + 1;
          const [movedLecture] = lectures.splice(currentIndex, 1);
          lectures.splice(newIndex, 0, movedLecture);

          return { ...section, lectures };
        }
        return section;
      })
    );
  };

  // Update lecture content (description, captions, notes)
  const updateLectureContent = (
    sectionId: string,
    lectureId: string,
    contentType: ContentType,
    value: string
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                if (contentType === ContentType.CAPTIONS) {
                  return { ...lecture, captions: value };
                } else if (contentType === ContentType.LECTURE_NOTES) {
                  return { ...lecture, lectureNotes: value };
                } else if (
                  contentType === ContentType.FILE ||
                  contentType === ContentType.VIDEO
                ) {
                  return lecture;
                }
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );
  };

  // Handle drag-and-drop for lectures
  const handleLectureDrop = (
    sourceSectionId: string,
    sourceLectureId: string,
    targetSectionId: string,
    targetLectureId?: string
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];

      const sourceSectionIndex = updatedSections.findIndex(
        (s) => s.id === sourceSectionId
      );
      const targetSectionIndex = updatedSections.findIndex(
        (s) => s.id === targetSectionId
      );

      if (sourceSectionIndex === -1 || targetSectionIndex === -1) {
        console.error("Source or target section not found");
        return prevSections;
      }

      const sourceSection = updatedSections[sourceSectionIndex];
      const sourceLectureIndex = sourceSection.lectures.findIndex(
        (l) => l.id === sourceLectureId
      );

      if (sourceLectureIndex === -1) {
        console.error("Source lecture not found");
        return prevSections;
      }

      const lectureCopy = { ...sourceSection.lectures[sourceLectureIndex] };

      const updatedSourceLectures = sourceSection.lectures.filter(
        (l) => l.id !== sourceLectureId
      );

      updatedSections[sourceSectionIndex] = {
        ...sourceSection,
        lectures: updatedSourceLectures,
      };

      const targetSection = updatedSections[targetSectionIndex];
      const targetLectures = [...targetSection.lectures];

      let insertIndex = targetLectures.length;

      if (targetLectureId) {
        const targetLectureIndex = targetLectures.findIndex(
          (l) => l.id === targetLectureId
        );

        if (targetLectureIndex !== -1) {
          insertIndex = targetLectureIndex + 1;
        }
      }

      targetLectures.splice(insertIndex, 0, lectureCopy);

      updatedSections[targetSectionIndex] = {
        ...targetSection,
        lectures: targetLectures,
      };

      return updatedSections;
    });
  };

  const updateQuizQuestions = (
    sectionId: string,
    quizId: string,
    questions: Question[]
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === quizId && lecture.contentType === "quiz") {
                return {
                  ...lecture,
                  questions: questions,
                };
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );
  };

  const addQuestionToQuiz = (
    sectionId: string,
    quizId: string,
    question: Question
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures: section.lectures.map((lecture) => {
              if (lecture.id === quizId && lecture.contentType === "quiz") {
                return {
                  ...lecture,
                  questions: [...(lecture.questions || []), question],
                };
              }
              return lecture;
            }),
          };
        }
        return section;
      })
    );

    toast.success("Question added to quiz");
  };

  const updateSectionsOrder = (newSectionsArray: Section[]) => {
    setSections(newSectionsArray);
    toast.success("Section moved successfully");
  };

  // Add new function for updating quiz in backend
  const updateQuiz = async (
    sectionId: string,
    quizId: string,
    title: string,
    description: string
  ) => {
    try {
      const numericQuizId = parseInt(quizId);

      await updateQuizBackend({
        quizId: numericQuizId,
        title,
        description,
      });

      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lectures: section.lectures.map((lecture) => {
                if (lecture.id === quizId) {
                  return {
                    ...lecture,
                    name: title,
                    title: title,
                    description: description,
                  };
                }
                return lecture;
              }),
            };
          }
          return section;
        })
      );
    } catch (error) {
      throw error;
      // console.error(error);
    }
  };

  return {
    fetchSectionData,
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
    updateQuiz,
    sectionLoading, // Expose loading state
    uploadVideoToBackend,
    saveArticleToBackend,
    // NEW: Expose video upload states
    videoUploading,
    videoUploadProgress,
    mainSectionData,
    setMainSectionData,
  };
};

import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import {
  Lecture,
  EnhancedLecture,
  ContentTypeDetector,
  ExternalResourceItem,
  SourceCodeFile,
} from "@/lib/types";
import QuestionForm from "./QuestionForm";
import { FaCircleCheck } from "react-icons/fa6";
import { GoQuestion } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import StudentVideoPreview, {
  QuizData,
} from "../lecture/components/StudentVideoPeview";
import QuizForm from "./QuizForm";
import { useQuizOperations } from "@/services/quizService";
import toast, { LoaderIcon } from "react-hot-toast";

interface QuizItemProps {
  lecture: Lecture;
  lectureIndex: number;
  newQuizId?: number; // For new quizzes
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
  toggleContentSection: (sectionId: string, lectureId: string) => void;
  updateQuizQuestions?: (
    sectionId: string,
    quizId: number,
    questions: any[]
  ) => void;
  sections: any[]; // All sections for preview
  allSections: any[];
  onEditQuiz?: (
    sectionId: string,
    quizId: number,
    title: string,
    description: string
  ) => Promise<void>;
  enhancedLectures?: Record<string, EnhancedLecture>; // Enhanced lectures prop
  // Resource arrays to properly pass to quiz preview
  uploadedFiles?: Array<{ name: string; size: string; lectureId: string }>;
  sourceCodeFiles?: SourceCodeFile[];
  externalResources?: ExternalResourceItem[];
}

interface Question {
  id?: any;
  text: string;
  answers: Array<{
    text: string;
    explanation: string;
  }>;
  correctAnswerIndex: number;
  relatedLecture?: string;
  type: string;
}

export const generateNumericId = (): string => {
  return Math.floor(Math.random() * 1000000).toString();
};

const QuizItem: React.FC<QuizItemProps> = ({
  lecture,
  lectureIndex,
  newQuizId,
  sectionId,
  editingLectureId,
  setEditingLectureId,
  updateLectureName,
  deleteLecture,
  handleDragStart,
  handleDragOver,
  handleDrop,
  toggleContentSection,
  updateQuizQuestions,
  allSections,
  sections,
  onEditQuiz,
  enhancedLectures = {},
  // Receive resource arrays
  uploadedFiles = [],
  sourceCodeFiles = [],
  externalResources = [],
}) => {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Preview-related states (similar to LectureItem)
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "instructor" | "student" | null
  >(null);
  const [showEditQuizForm, setShowEditQuizForm] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(
    lecture.questions || []
  );
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] =
    useState(false);

  const {
    addQuestionToQuiz,
    updateQuestion,
    deleteQuestion,
    deleteQuiz,
    loading: quizOperationLoading,
  } = useQuizOperations();

  const [loadingQuestionIndex, setLoadingQuestionIndex] = useState<
    number | null
  >(null);

  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const handleDeleteQuiz = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const result = await deleteQuiz({
        quizId: newQuizId as number,
      });

      if (result?.deleteQuiz?.success) {
        // toast.success("Quiz deleted successfully!");
        deleteLecture(sectionId, lecture.id); // This updates the local state
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const [result, setResult] = useState(null);

  // FIXED: Enhanced section creation with proper resource handling
  const createEnhancedSections = () => {
    if (!allSections || allSections.length === 0) {
      return allSections;
    }

    // Create a comprehensive map of all resources by lecture ID with proper typing
    const resourcesByLectureId: Record<
      string,
      {
        uploadedFiles: Array<{ name: string; size: string; lectureId: string }>;
        sourceCodeFiles: SourceCodeFile[];
        externalResources: ExternalResourceItem[];
      }
    > = {};

    // Collect ALL resources from the component state
    uploadedFiles.forEach((file) => {
      if (file.lectureId) {
        if (!resourcesByLectureId[file.lectureId]) {
          resourcesByLectureId[file.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        resourcesByLectureId[file.lectureId].uploadedFiles.push(file);
      }
    });

    sourceCodeFiles.forEach((file) => {
      if (file.lectureId) {
        if (!resourcesByLectureId[file.lectureId]) {
          resourcesByLectureId[file.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        resourcesByLectureId[file.lectureId].sourceCodeFiles.push(file);
      }
    });

    // Convert ExternalResource to ExternalResourceItem when collecting
    externalResources.forEach((resource) => {
      if (resource.lectureId) {
        if (!resourcesByLectureId[resource.lectureId]) {
          resourcesByLectureId[resource.lectureId] = {
            uploadedFiles: [],
            sourceCodeFiles: [],
            externalResources: [],
          };
        }
        // Convert to ExternalResourceItem if needed
        const convertedResource: ExternalResourceItem = {
          title:
            typeof resource.title === "string" ? resource.title : resource.name,
          url: resource.url,
          name: resource.name,
          lectureId: resource.lectureId,
          filename: resource.filename,
        };
        resourcesByLectureId[resource.lectureId].externalResources.push(
          convertedResource
        );
      }
    });

    console.log("📦 Quiz: Complete resources map:", resourcesByLectureId);

    // Process all sections and enhance ALL lectures
    return allSections.map((section) => ({
      ...section,
      lectures:
        section.lectures?.map((lec: Lecture) => {
          // Check if we have enhanced data for this lecture
          const enhancedData = enhancedLectures[lec.id];
          let enhancedLecture: EnhancedLecture;

          if (enhancedData) {
            // Merge the enhanced data with the lecture
            console.log(`Using enhanced data for lecture ${lec.id}:`, {
              actualContentType: enhancedData.actualContentType,
              hasVideoContent: enhancedData.hasVideoContent,
              hasArticleContent: enhancedData.hasArticleContent,
            });
            enhancedLecture = { ...lec, ...enhancedData };
          } else {
            // Check if the lecture already has enhanced properties
            const existingEnhanced = lec as EnhancedLecture;

            if (
              existingEnhanced.actualContentType ||
              existingEnhanced.hasVideoContent !== undefined ||
              existingEnhanced.hasArticleContent !== undefined
            ) {
              enhancedLecture = existingEnhanced;
            } else {
              // Create a basic enhanced lecture based on contentType
              enhancedLecture = {
                ...lec,
                actualContentType: (lec.contentType as any) || "video",
                hasVideoContent:
                  lec.contentType === "video" ||
                  (!lec.contentType && lec.videos && lec.videos.length > 0),
                hasArticleContent: lec.contentType === "article",
                contentMetadata: {
                  createdAt: new Date(),
                  lastModified: new Date(),
                },
              };

              // If the lecture has a description that looks like article content, mark it as article
              if (
                !enhancedLecture.hasArticleContent &&
                lec.description &&
                lec.description.length > 100 &&
                lec.description.includes("<")
              ) {
                enhancedLecture.hasArticleContent = true;
                enhancedLecture.actualContentType = "article";
                enhancedLecture.articleContent = { text: lec.description };
              }
            }
          }

          // Properly attach resources to each lecture
          const lectureResources = resourcesByLectureId[lec.id];
          if (lectureResources) {
            enhancedLecture.lectureResources = {
              uploadedFiles: lectureResources.uploadedFiles,
              sourceCodeFiles: lectureResources.sourceCodeFiles,
              externalResources: lectureResources.externalResources,
            };
          } else {
            // Ensure empty arrays if no resources
            enhancedLecture.lectureResources = {
              uploadedFiles: [],
              sourceCodeFiles: [],
              externalResources: [],
            };
          }

          console.log(`Enhanced lecture ${lec.id} in quiz preview:`, {
            name: lec.name,
            originalType: lec.contentType,
            actualContentType: enhancedLecture.actualContentType,
            hasVideoContent: enhancedLecture.hasVideoContent,
            hasArticleContent: enhancedLecture.hasArticleContent,
            hasResources: !!lectureResources,
            resourceCounts: lectureResources
              ? {
                  uploaded: lectureResources.uploadedFiles.length,
                  sourceCode: lectureResources.sourceCodeFiles.length,
                  external: lectureResources.externalResources.length,
                }
              : { uploaded: 0, sourceCode: 0, external: 0 },
          });

          return enhancedLecture;
        }) || [],
    }));
  };

  // Quiz edit handler
  // const handleQuizEditSubmit = (
  //   sectionId: string,
  //   quizId: string,
  //   title: string,
  //   description: string
  // ) => {
  //   if (onEditQuiz) {
  //     onEditQuiz(sectionId, quizId, title, description);
  //   }
  //   setShowEditQuizForm(false);
  // };

  // const handleQuizEditSubmit = async (
  //   sectionId: string,
  //   quizId: string,
  //   title: string,
  //   description: string
  // ) => {
  //   try {
  //     if (onEditQuiz) {
  //       // If it's an existing quiz, update it
  //       const result = await updateQuiz({
  //         quizId: parseInt(quizId),
  //         title,
  //         description,
  //       });

  //       if (result?.updateQuiz?.success) {
  //         toast.success("Quiz updated successfully!");
  //         onEditQuiz(sectionId, quizId, title, description);
  //       }
  //     } else {
  //       // If it's a new quiz, create it
  //       const result = await createQuiz({
  //         sectionId: parseInt(sectionId),
  //         title,
  //         description,
  //       });

  //       if (result?.createQuiz?.success) {
  //         toast.success("Quiz created successfully!");
  //         // You'll need to update your state with the new quiz
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error saving quiz:", error);
  //     toast.error("Failed to save quiz");
  //   }
  //   setShowEditQuizForm(false);
  // };

  const handleQuizEditSubmit = async (
    sectionId: string,
    quizId: number,
    title: string,
    description: string
  ) => {
    try {
      if (onEditQuiz) {
        await onEditQuiz(sectionId, quizId, title, description);
      }
    } catch (error) {
      throw error;
    }
  };

  // Edit button click handler - Now properly expands the quiz item
  const handleEditQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit quiz clicked, setting showEditQuizForm to true");

    // IMPORTANT: Expand the quiz item first if it's collapsed
    if (!expanded) {
      setExpanded(true);
      if (toggleContentSection) {
        toggleContentSection(sectionId, lecture.id);
      }
    }

    // Then show the edit form
    setShowEditQuizForm(true);

    // Clear conflicting states
    setShowQuestionForm(false);
    setShowQuestionTypeSelector(false);
    setEditingQuestionIndex(null);
    setShowEditForm(false);
  };

  // Debug effect to track showEditQuizForm changes
  useEffect(() => {
    console.log("showEditQuizForm state changed:", showEditQuizForm);
  }, [showEditQuizForm]);

  // Debug effect to track enhanced lectures
  useEffect(() => {}, [
    enhancedLectures,
    lecture.id,
    uploadedFiles,
    sourceCodeFiles,
    externalResources,
  ]);

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  useEffect(() => {
    setQuestions(lecture.questions || []);
  }, [lecture.questions]);

  // Add effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!showPreviewDropdown) return;

      const dropdownElement = document.getElementById(
        `quiz-preview-dropdown-${lecture.id}`
      );
      const target = event.target as Node;

      if (dropdownElement && !dropdownElement.contains(target)) {
        setShowPreviewDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPreviewDropdown, lecture.id]);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (toggleContentSection) {
      toggleContentSection(sectionId, lecture.id);
    }
  };

  // const handleAddQuestion = (question: Question) => {
  //   let newQuestions;

  //   if (editingQuestionIndex !== null) {
  //     newQuestions = [...questions];
  //     newQuestions[editingQuestionIndex] = question;
  //   } else {
  //     newQuestions = [...questions, { ...question, id: `q-${Date.now()}` }];
  //   }

  //   setQuestions(newQuestions);
  //   if (updateQuizQuestions) {
  //     updateQuizQuestions(sectionId, lecture.id, newQuestions);
  //   }

  //   setShowQuestionForm(false);
  //   setShowQuestionTypeSelector(false);
  //   setExpanded(true);
  //   setShowEditForm(false);
  //   setEditingQuestionIndex(null);
  // };

  const handleAddQuestion = async (question: Question) => {
    try {
      setLoadingQuestion(true);

      // Convert answers to backend-compatible format
      const choices = question.answers.map((answer, idx) => ({
        text: answer.text,
        explanation: answer.explanation || "",
        isCorrect: idx === question.correctAnswerIndex,
        order: idx + 1,
        id: idx + 1,
      }));

      // Call the backend to add the question
      const result = await addQuestionToQuiz({
        quizId: newQuizId as number, // Make sure `quiz` is defined
        text: question.text,
        explanation: "",
        maxPoints: 1, // Default points
        order: questions.length + 1,
        choices,
        questionType: "MC",
      });

      const newQuestionId = result?.addQuestionToQuiz?.question?.id;
      if (!newQuestionId)
        throw new Error("No question ID returned from backend");

      // Add the new question to the local state with the real ID
      const newQuestions = [
        ...questions,
        {
          ...question,
          id: newQuestionId.toString(),
        },
      ];

      console.log("New question added:", newQuestions);

      setQuestions(newQuestions);

      if (updateQuizQuestions) {
        updateQuizQuestions(sectionId, newQuizId as number, newQuestions);
      }

      toast.success("Question added successfully!");
      setShowQuestionForm(false);
      setShowQuestionTypeSelector(false);
      setExpanded(true);
      setShowEditForm(false);
      setEditingQuestionIndex(null);
    } catch (error) {
      toast.error("Failed to save question");
      console.error("Error adding question:", error);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // const handleDeleteQuestion = (index: number) => {
  //   const newQuestions = questions.filter((_, idx) => idx !== index);
  //   setQuestions(newQuestions);
  //   if (updateQuizQuestions) {
  //     updateQuizQuestions(sectionId, lecture.id, newQuestions);
  //   }
  // };

  const handleDeleteQuestion = async (index: number) => {
    const questionId = questions[index]?.id;
    if (!questionId) return;
    setLoadingQuestionIndex(index);
    try {
      const result = await deleteQuestion({
        questionId: parseInt(questionId),
      });

      if (result?.deleteQuestion?.success) {
        const newQuestions = questions.filter((_, idx) => idx !== index);
        setQuestions(newQuestions);
        if (updateQuizQuestions) {
          updateQuizQuestions(sectionId, newQuizId as number, newQuestions);
        }

        toast.success("Question deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    } finally {
      setLoadingQuestionIndex(null);
    }
  };

  // const handleDeleteQuestion = async (index: number) => {
  //   try {
  //     const questionToDelete = questions[index];
  //     const newQuestions = questions.filter((_, idx) => idx !== index);

  //     // Update both local state and backend
  //     if (updateQuizQuestions) {
  //       await updateQuizQuestions(sectionId, lecture.id, newQuestions);
  //     }

  //     setQuestions(newQuestions);
  //     toast.success("Question deleted successfully");
  //   } catch (error) {
  //     toast.error("Failed to delete question");
  //     console.error(error);
  //   }
  // };

  const handleUpdateQuestion = async (question: any, index: number) => {
    try {
      console.log("Updating questionnnnn:", question.id);

      if (!question.id || isNaN(parseInt(question.id))) {
        throw new Error("Question ID is missing or invalid");
      }

      console.log("Updating questionnnnn:", question.id);

      // Convert answers to choices format
      const choices = question.answers.map((answer: any, idx: number) => {
        const parsedId = parseInt(answer.id);
        const isValidId = !isNaN(parsedId) && parsedId > 0;

        return {
          text: answer.text,
          explanation: answer.explanation || "",
          isCorrect: idx === question.correctAnswerIndex,
          order: answer.order || idx + 1,
          id: idx + 1,
        };
      });

      const result = await updateQuestion({
        questionId: parseInt(question.id),
        text: question.text,
        choices,
      });

      console.log("🚨 Final payload for updateQuestion:", {
        questionId: parseInt(question.id),
        text: question.text,
        choices,
      });

      console.log("Update result:", result);

      if (result?.updateQuestion?.success) {
        const newQuestions = [...questions];
        newQuestions[index] = question;

        setQuestions(newQuestions);
        if (updateQuizQuestions) {
          updateQuizQuestions(sectionId, newQuizId as number, newQuestions);
        }

        toast.success("Question updated successfully!");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question");
    }

    setShowQuestionForm(false);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
    setShowQuestionTypeSelector(false);
    setExpanded(true);
  };

  const handleQuestionSubmit = (question: any) => {
    if (editingQuestionIndex !== null) {
      console.log(question.id);
      handleUpdateQuestion(question, editingQuestionIndex);
    } else {
      handleAddQuestion(question);
    }
  };

  // Preview functionality - UPDATED
  const handlePreviewSelection = (mode: "instructor" | "student"): void => {
    console.log(`Quiz Preview mode: ${mode}, Quiz ID: ${lecture.id}`);
    console.log("All sections available:", allSections.length);
    console.log(
      "Enhanced lectures available:",
      Object.keys(enhancedLectures).length
    );

    setPreviewMode(mode);
    setShowPreviewDropdown(false);

    setTimeout(() => {
      setShowVideoPreview(true);
    }, 50);
  };

  const quizData: QuizData = {
    id: lecture.id,
    name: lecture.name || "New quiz",
    description: lecture.description,
    questions: questions.map((q) => ({
      ...q,
      id: q.id || `q-${Date.now()}-${Math.random()}`,
      relatedLecture: undefined,
    })),
  };

  const isNewQuiz = questions.length === 0;

  // FIXED: Quiz preview page with proper resource handling
  const QuizPreviewPage: React.FC = () => {
    // Create enhanced sections with proper content type detection and resources
    const enhancedSections = createEnhancedSections();

    console.log("📊 Quiz preview sections enhanced:", {
      totalSections: enhancedSections.length,
      totalLectures: enhancedSections.reduce(
        (acc, section) => acc + (section.lectures?.length || 0),
        0
      ),
      lecturesWithActualContentType: enhancedSections.reduce(
        (acc, section) =>
          acc +
          (section.lectures?.filter(
            (l: Lecture) => (l as EnhancedLecture).actualContentType
          )?.length || 0),
        0
      ),
      lecturesWithResources: enhancedSections.reduce(
        (acc, section) =>
          acc +
          (section.lectures?.filter((l: Lecture) => {
            const enhanced = l as EnhancedLecture;
            return (
              enhanced.lectureResources &&
              (enhanced.lectureResources.uploadedFiles.length > 0 ||
                enhanced.lectureResources.sourceCodeFiles.length > 0 ||
                enhanced.lectureResources.externalResources.length > 0)
            );
          }).length || 0),
        0
      ),
    });

    return (
      <StudentVideoPreview
        videoContent={{
          uploadTab: { selectedFile: null },
          libraryTab: {
            searchQuery: "",
            selectedVideo: null,
            videos: [],
          },
          activeTab: "uploadVideo",
          selectedVideoDetails: null,
        }}
        articleContent={{ text: "" }}
        setShowVideoPreview={setShowVideoPreview}
        lecture={{
          ...lecture,
          contentType: "quiz",
        }}
        // FIXED: Pass both enhanced sections AND individual resource arrays
        // This ensures resources are available regardless of how StudentVideoPreview expects them
        uploadedFiles={uploadedFiles}
        sourceCodeFiles={sourceCodeFiles}
        externalResources={externalResources}
        section={{
          id: "all-sections",
          name: "All Sections",
          sections: enhancedSections, // Pass enhanced sections with proper content types and resources
        }}
        quizData={quizData}
      />
    );
  };

  // Collapsed view for new quizzes
  if (!expanded && isNewQuiz) {
    return (
      <div
        className="mb-3 border border-zinc-400 rounded-md bg-white overflow-hidden"
        draggable
        onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
      >
        <div className="flex justify-between items-center px-3 cursor-move h-11">
          <div className="flex items-center space-x-3" onClick={toggleExpand}>
            <div className="w-max shrink-0 flex items-center gap-3">
              <FaCircleCheck size={16} className="shrink-0" />
              <p className="w-max">Quiz {lectureIndex + 1}:</p>
            </div>

            <div className="flex items-center space-x-2">
              <GoQuestion size={12} />
              {editingLectureId === lecture.id ? (
                <input
                  ref={lectureNameInputRef}
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
                <h4 className="font-medium text-sm w-max shrink-0">
                  {lecture.name || "New quiz"}
                </h4>
              )}
            </div>
          </div>

          <div
            className="flex items-center space-x-2 ml-2 mr-auto w-full h-11 py-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {(isHovering || quizOperationLoading) && (
              <>
                <button
                  onClick={handleEditQuiz}
                  className="text-gray-500 hover:text-gray-700 p-1 transition-opacity cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteQuiz}
                  disabled={quizOperationLoading}
                  className={`text-gray-500 hover:text-blue-600 p-1 transition-opacity cursor-pointer disabled:cursor-not-allowed ${
                    quizOperationLoading ? "animate-pulse" : ""
                  }`}
                >
                  {quizOperationLoading ? (
                    <LoaderIcon className="w-4 h-4" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
            {!showQuestionTypeSelector && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuestionTypeSelector(true);
                }}
                className="ml-auto px-3 py-1 border border-purple-600 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md flex items-center cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Questions
              </button>
            )}

            <div className={`w-4 h-4 ${showQuestionTypeSelector && "ml-auto"}`}>
              {isHovering && (
                <RxHamburgerMenu className="size-full cursor-move" />
              )}
            </div>
          </div>
        </div>

        {/* Question Type Selector */}
        {showQuestionTypeSelector && (
          <div className="relative">
            <div className="absolute -translate-y-[97.5%] px-3 py-1 border-x border-t border-zinc-400 right-10 gap-1.5 bg-white z-10 flex items-center">
              <span className="font-bold text-sm">Add Multiple Choice</span>
              <button
                onClick={() => {
                  setShowQuestionTypeSelector(false);
                  setShowQuestionForm(false);
                  setShowEditForm(false);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-1 hover:bg-gray-300 rounded-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {!showQuestionForm ? (
              <div className="p-3 size-full border-t border-zinc-400">
                <div className="text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setShowQuestionForm(true);
                      }}
                      className="flex flex-col items-center border group border-gray-300 bg-gray-100 cursor-pointer rounded-xs hover:bg-black hover:text-white text-gray-400 transition"
                    >
                      <div className="p-2 relative overflow-hidden">
                        <GoQuestion
                          size={30}
                          className="transition-transform duration-300 group-hover:-translate-y-[150%] absolute"
                        />
                        <GoQuestion
                          size={30}
                          className="transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0"
                        />
                      </div>
                      <span className="text-xs py-0.5 duration-150 transition px-2 bg-gray-300 text-black group-hover:bg-black group-hover:text-white">
                        Multiple Choice
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-zinc-400">
                <QuestionForm
                  quizId={newQuizId as number}
                  onSubmit={handleQuestionSubmit}
                  onLoad={quizOperationLoading}
                  onCancel={() => {
                    setShowQuestionForm(false);
                    setShowQuestionTypeSelector(false);
                  }}
                  sectionId={sectionId}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Expanded view - FIXED: Restructured conditional rendering
  return (
    <div
      className="mb-3 border border-zinc-400 rounded-md bg-white overflow-hidden"
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
    >
      <div
        className="flex justify-between items-center px-3 cursor-move h-11"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-center space-x-3" onClick={toggleExpand}>
          <div className="w-max shrink-0 flex items-center gap-3">
            <FaCircleCheck size={16} className="shrink-0" />
            <p className="w-max">Quiz {lectureIndex + 1}:</p>
          </div>

          <div className="flex items-center space-x-2">
            <GoQuestion size={12} className="shrink-0" />
            {editingLectureId === lecture.id ? (
              <input
                ref={lectureNameInputRef}
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
              <h4 className="font-medium text-sm w-max">
                {lecture.name || "New quiz"}
              </h4>
            )}
          </div>
        </div>

        <div className="flex items-center w-full ml-2">
          {isHovering && (
            <>
              <button
                onClick={handleEditQuiz}
                className="text-gray-500 hover:text-gray-700 p-1 transition-opacity cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteQuiz}
                className={`text-gray-500 hover:text-red-600 p-1 transition-opacity cursor-pointer ${
                  quizOperationLoading ? "animate-pulse" : ""
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className="cursor-pointer p-1 ml-auto"
          >
            {expanded
              ? !showEditForm && (
                  <div className="cursor-pointer p-1 ml-auto rounded hover:bg-gray-200">
                    <ChevronUp size={20} className=" text-gray-500" />
                  </div>
                )
              : !showEditForm && (
                  <div className="cursor-pointer p-1 ml-auto rounded hover:bg-gray-200">
                    <ChevronDown size={20} className=" text-gray-500 " />
                  </div>
                )}
          </button>
          <button className="w-7 cursor-move hover:bg-gray-200 p-1 rounded">
            {isHovering && (
              <RxHamburgerMenu size={20} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* FIXED: Restructured expanded section with proper conditional rendering */}
      {expanded && (
        <div className="border-t border-zinc-400">
          {/* Show Quiz Edit Form first if it's active */}
          {showEditQuizForm ? (
            <QuizForm
              sectionId={sectionId}
              onEditQuiz={handleQuizEditSubmit}
              onCancel={() => setShowEditQuizForm(false)}
              isEdit={true}
              initialTitle={lecture.name || ""}
              initialDescription={lecture.description || ""}
              quizId={newQuizId}
              setShowEditQuizForm={setShowEditQuizForm}
            />
          ) : showQuestionForm || showQuestionTypeSelector ? (
            <div className="relative">
              {showQuestionTypeSelector && (
                <div className="absolute -translate-y-[97.5%] px-3 py-1 border-x border-t border-zinc-400 right-10 gap-1.5 bg-white z-10 flex items-center">
                  <span className="font-bold text-sm">Add Multiple Choice</span>
                  <button
                    onClick={() => {
                      setShowQuestionTypeSelector(false);
                      setShowQuestionForm(false);
                      setEditingQuestionIndex(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer p-1 hover:bg-gray-300 rounded-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="relative">
                <div className="absolute -translate-y-[97.5%] px-3 py-1 border-x border-t border-zinc-400 right-10 gap-1.5 bg-white z-10 flex items-center">
                  <span className="font-bold text-sm">Add Multiple Choice</span>
                  <button
                    onClick={() => {
                      setShowQuestionTypeSelector(false);
                      setShowQuestionForm(false);
                      setShowEditForm(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer p-1 hover:bg-gray-300 rounded-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {showQuestionTypeSelector && !showQuestionForm ? (
                  <div className="p-3 size-full border-t border-zinc-400">
                    <div className="text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setShowQuestionForm(true);
                            setShowQuestionTypeSelector(false);
                          }}
                          className="flex flex-col items-center border group border-gray-300 bg-gray-100 cursor-pointer rounded-xs hover:bg-black hover:text-white text-gray-400 transition"
                        >
                          <div className="p-2 relative overflow-hidden">
                            <GoQuestion
                              size={30}
                              className="transition-transform duration-300 group-hover:-translate-y-[150%] absolute"
                            />
                            <GoQuestion
                              size={30}
                              className="transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0"
                            />
                          </div>
                          <span className="text-xs py-0.5 duration-150 transition px-2 bg-gray-300 text-black group-hover:bg-black group-hover:text-white">
                            Multiple Choice
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-zinc-400">
                    <QuestionForm
                      key={editingQuestionIndex ?? "new"}
                      onSubmit={handleQuestionSubmit}
                      onCancel={() => {
                        setShowQuestionForm(false);
                        setShowQuestionTypeSelector(false);
                        setEditingQuestionIndex(null);
                      }}
                      quizId={newQuizId as number}
                      onLoad={quizOperationLoading}
                      isEditedForm={editingQuestionIndex !== null}
                      initialQuestion={
                        editingQuestionIndex !== null
                          ? questions[editingQuestionIndex]
                          : null
                      }
                      sectionId={sectionId}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Default expanded view - Questions list */
            <div className="px-3 py-2">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="mr-2 font-bold">
                    Questions {questions.length > 0 && `(${questions.length})`}
                  </span>
                  <button
                    onClick={() => {
                      setShowQuestionTypeSelector(true);
                      setShowEditForm(true);
                      setEditingQuestionIndex(null);
                    }}
                    className="inline-flex items-center border border-purple-600 px-2 py-1 text-sm leading-5 rounded text-purple-600 hover:bg-purple-100 transition cursor-pointer font-medium"
                  >
                    New Question
                  </button>
                </div>

                {/* Preview dropdown - similar to LectureItem */}
                <div
                  className="relative inline-flex gap-4"
                  id={`quiz-preview-dropdown-${lecture.id}`}
                >
                  <button
                    onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
                    disabled={questions.length === 0}
                    type="button"
                  >
                    Preview <ChevronDown className="ml-1 w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {showPreviewDropdown && (
                    <div className="absolute mt-1 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <ul>
                        <li>
                          <button
                            onClick={() => handlePreviewSelection("instructor")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Instructor
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handlePreviewSelection("student")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            type="button"
                          >
                            As Student
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <GoQuestion className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    You haven't added any questions to this quiz yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id || index}
                      className="group flex items-center justify-between"
                    >
                      <div className="flex py-2 items-center ">
                        <span className="font-medium text-sm mr-1">
                          {index + 1}.
                        </span>
                        <span className="text-sm">
                          {question.text.replace(/<\/?p>/g, "")}
                        </span>
                        <span className="ml-2 text-sm">(Multiple Choice)</span>
                      </div>
                      <div
                        className={`flex space-x-1 group-hover:opacity-100 transition-opacity ${
                          loadingQuestionIndex === index
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() => handleEditQuestion(index)}
                          disabled={loadingQuestionIndex === index}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          disabled={loadingQuestionIndex === index}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded cursor-pointer disabled:cursor-not-allowed"
                        >
                          {loadingQuestionIndex === index ? (
                            <LoaderIcon />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition cursor-move">
                          <RxHamburgerMenu className="w-4 h-4  text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Show preview component when needed */}
      {showVideoPreview && <QuizPreviewPage />}
    </div>
  );
};

export default QuizItem;

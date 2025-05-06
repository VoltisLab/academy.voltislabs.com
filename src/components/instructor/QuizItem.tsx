import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Move,
  X,
  Plus,
} from "lucide-react";
import { Lecture } from "@/lib/types";
import QuestionForm from "./QuestionForm";
import QuizPreviewWrapper from "./QuizPreviewWrapper";

interface QuizItemProps {
  lecture: Lecture;
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
  toggleContentSection: (sectionId: string, lectureId: string) => void;
  updateQuizQuestions?: (
    sectionId: string,
    quizId: string,
    questions: any[]
  ) => void;
  // Add these new props
  isDragging?: boolean;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: {
    sectionId: string | null;
    lectureId: string | null;
  };
}

interface Question {
  id?: string;
  text: string;
  answers: Array<{
    text: string;
    explanation: string;
  }>;
  correctAnswerIndex: number;
  relatedLecture?: string;
  type: string;
}

const QuizItem: React.FC<QuizItemProps> = ({
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
  toggleContentSection,
  updateQuizQuestions,
}) => {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] =
    useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    lecture.questions || []
  );

  useEffect(() => {
    if (editingLectureId === lecture.id && lectureNameInputRef.current) {
      lectureNameInputRef.current.focus();
    }
  }, [editingLectureId, lecture.id]);

  // Update local questions state when lecture.questions changes
  useEffect(() => {
    setQuestions(lecture.questions || []);
  }, [lecture.questions]);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (toggleContentSection) {
      toggleContentSection(sectionId, lecture.id);
    }
  };

  const handleNewQuestion = () => {
    setShowQuestionForm(true);
    setShowQuestionTypeSelector(false);
  };

  const handleAddQuestion = (question: Question) => {
    const newQuestions = [...questions, { ...question, id: `q-${Date.now()}` }];
    setQuestions(newQuestions);

    // Update questions in parent component if updateQuizQuestions is provided
    if (updateQuizQuestions) {
      updateQuizQuestions(sectionId, lecture.id, newQuestions);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);

    // Update questions in parent component if updateQuizQuestions is provided
    if (updateQuizQuestions) {
      updateQuizQuestions(sectionId, lecture.id, newQuestions);
    }
  };

  const handleEditQuestion = (index: number) => {
    // This function would open the question form with the existing question data
    console.log("Edit question:", index);
  };

  const handleQuestionsButtonClick = () => {
    setShowQuestionTypeSelector(true);
  };

  const handleMultipleChoiceClick = () => {
    setShowQuestionTypeSelector(false);
    setShowQuestionForm(true);
  };

  // Prepare quiz data for the preview component
  const quizData = {
    id: lecture.id,
    name: lecture.name || "New quiz",
    description: lecture.description,
    questions: questions.map((q) => ({
      ...q,
      id: q.id || `q-${Date.now()}-${Math.random()}`,
    })),
  };

  // Determine if this is a new quiz with no questions
  const isNewQuiz = questions.length === 0;

  // If this is a collapsed quiz item with no questions, just show minimal UI
  if (!expanded && isNewQuiz) {
    return (
      <div
        className="mb-3 border border-gray-300 rounded-md bg-white overflow-hidden"
        draggable
        onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex justify-between items-center p-2 cursor-pointer">
          <div className="flex items-center space-x-3" onClick={toggleExpand}>
            <Move className="w-4 h-4 text-gray-400 cursor-move" />
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-center text-xs flex items-center justify-center">
                Q
              </span>
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
                <h4 className="font-medium text-sm">
                  {lecture.name || "New quiz"}
                </h4>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isHovering && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingLectureId(lecture.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLecture(sectionId, lecture.id);
                  }}
                  className="text-gray-500 hover:text-red-600 p-1 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLecture(sectionId, lecture.id, "up");
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
                  disabled={lectureIndex === 0}
                >
                  <ChevronUp
                    className={`w-4 h-4 ${
                      lectureIndex === 0 ? "opacity-50" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLecture(sectionId, lecture.id, "down");
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
                  disabled={lectureIndex === totalLectures - 1}
                >
                  <ChevronDown
                    className={`w-4 h-4 ${
                      lectureIndex === totalLectures - 1 ? "opacity-50" : ""
                    }`}
                  />
                </button>
              </>
            )}
            <button
              onClick={handleQuestionsButtonClick}
              className="ml-2 px-3 py-1 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Questions
            </button>
          </div>
        </div>

        {/* Question Type Selector */}
        {showQuestionTypeSelector && (
          <div className="p-3 border-t relative">
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={() => setShowQuestionTypeSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-sm text-gray-500 mb-2">
                Select question type
              </h3>
              <div className="flex justify-center">
                <button
                  onClick={handleMultipleChoiceClick}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-md hover:border-purple-500 hover:bg-purple-50"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">?</span>
                  </div>
                  <span className="text-sm font-medium">Multiple Choice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        {showQuestionForm && (
          <div className=" border-t">
            <QuestionForm
              onAddQuestion={handleAddQuestion}
              onCancel={() => setShowQuestionForm(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="mb-3 border rounded-md bg-white overflow-hidden"
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lecture.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sectionId, lecture.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex justify-between items-center p-2 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-3">
          <Move className="w-4 h-4 text-gray-400 cursor-move" />
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-center text-xs flex items-center justify-center">
              Q
            </span>
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
              <h4 className="text-sm">{lecture.name || "New quiz"}</h4>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isHovering && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingLectureId(lecture.id);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLecture(sectionId, lecture.id);
                }}
                className="text-gray-500 hover:text-red-600 p-1 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLecture(sectionId, lecture.id, "up");
                }}
                className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
                disabled={lectureIndex === 0}
              >
                <ChevronUp
                  className={`w-4 h-4 ${
                    lectureIndex === 0 ? "opacity-50" : ""
                  }`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLecture(sectionId, lecture.id, "down");
                }}
                className="text-gray-500 hover:text-gray-700 p-1 transition-opacity"
                disabled={lectureIndex === totalLectures - 1}
              >
                <ChevronDown
                  className={`w-4 h-4 ${
                    lectureIndex === totalLectures - 1 ? "opacity-50" : ""
                  }`}
                />
              </button>
            </>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-3 border-t">
          {isNewQuiz ? (
            <div className="flex justify-end">
              <button
                onClick={handleQuestionsButtonClick}
                className="px-3 py-1 text-purple-600 border border-purple-300 hover:bg-purple-50 rounded-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Questions
              </button>
            </div>
          ) : (
            <>
              {/* Modified header - "New Question" button moved next to "Questions" text */}
              <div className="flex items-center mb-3">
                <div className="flex-grow flex items-center">
                  <span className="mr-2">
                    Questions {questions.length > 0 && `(${questions.length})`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNewQuestion();
                    }}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-5 font-medium rounded-xl text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    New Question
                  </button>
                </div>
              </div>

              {questions.length > 0 && (
                <div className="mb-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id || index}
                      className="mb-2 p-2 border border-gray-200 rounded hover:border-gray-300"
                      onMouseEnter={(e) => {
                        // Find all buttons in this div and make them visible
                        const buttons =
                          e.currentTarget.querySelectorAll("button");
                        buttons.forEach((button) => {
                          button.classList.remove("hidden");
                        });
                      }}
                      onMouseLeave={(e) => {
                        // Find all buttons in this div and hide them
                        const buttons =
                          e.currentTarget.querySelectorAll("button");
                        buttons.forEach((button) => {
                          button.classList.add("hidden");
                        });
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">
                          {/* Fixed question text to remove p tags */}
                          {index + 1}. {question.text.replace(/<\/?p>/g, "")}
                          <span className="text-xs text-gray-500 ml-2">
                            Multiple Choice
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-gray-500 hover:text-gray-700 hidden"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditQuestion(index);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-red-600 hidden"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(index);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-3">
                <QuizPreviewWrapper quiz={quizData}>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    disabled={questions.length === 0}
                  >
                    Preview
                  </button>
                </QuizPreviewWrapper>
              </div>
            </>
          )}

          {/* Question Type Selector */}
          {showQuestionTypeSelector && (
            <div className="mt-3 border-t pt-3 relative">
              <div className="absolute top-3 right-0 p-2">
                <button
                  onClick={() => setShowQuestionTypeSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-sm text-gray-500 mb-2">
                  Select question type
                </h3>
                <div className="flex justify-center">
                  <button
                    onClick={handleMultipleChoiceClick}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-md hover:border-purple-500 hover:bg-purple-50"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl">?</span>
                    </div>
                    <span className="text-sm font-medium">Multiple Choice</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Question Form */}
          {showQuestionForm && (
            <div className="mt-3 border-t pt-3">
              <QuestionForm
                onAddQuestion={handleAddQuestion}
                onCancel={() => setShowQuestionForm(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizItem;

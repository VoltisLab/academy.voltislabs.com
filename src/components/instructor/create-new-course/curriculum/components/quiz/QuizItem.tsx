import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { Lecture } from "@/lib/types";
import QuestionForm from "./QuestionForm";
import { FaCircleCheck } from "react-icons/fa6";
import { GoQuestion } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
// Import the updated StudentVideoPreview component that supports quizData
import StudentVideoPreview from "../lecture/StudentVideoPeview";

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
  sections: any[]; // All sections for preview
  allSections: any[]
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
  sections
}) => {
  const lectureNameInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Preview-related states (similar to LectureItem)
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"instructor" | "student" | null>(null);

  const [questions, setQuestions] = useState<Question[]>(
    lecture.questions || []
  );
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] =
    useState(false);

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

      const dropdownElement = document.getElementById(`quiz-preview-dropdown-${lecture.id}`);
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

  const handleAddQuestion = (question: Question) => {
    let newQuestions;

    if (editingQuestionIndex !== null) {
      newQuestions = [...questions];
      newQuestions[editingQuestionIndex] = question;
    } else {
      newQuestions = [...questions, { ...question, id: `q-${Date.now()}` }];
    }

    setQuestions(newQuestions);
    if (updateQuizQuestions) {
      updateQuizQuestions(sectionId, lecture.id, newQuestions);
    }

    setShowQuestionForm(false);
    setShowQuestionTypeSelector(false);
    setExpanded(true);
    setShowEditForm(false);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
    if (updateQuizQuestions) {
      updateQuizQuestions(sectionId, lecture.id, newQuestions);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
    setShowQuestionTypeSelector(false);
    setExpanded(true);
  };


  // Preview functionality (similar to LectureItem)
    const handlePreviewSelection = (mode: "instructor" | "student"): void => {
    console.log(`Quiz Preview mode: ${mode}, Quiz ID: ${lecture.id}`);
    console.log("All sections available:", sections.length);
    
    setPreviewMode(mode);
    setShowPreviewDropdown(false);
    
    setTimeout(() => {
      setShowVideoPreview(true);
    }, 50);
  };
  
  const quizData = {
    id: lecture.id,
    name: lecture.name || "New quiz",
    description: lecture.description,
    questions: questions.map((q) => ({
      ...q,
      id: q.id || `q-${Date.now()}-${Math.random()}`,
    })),
  };

  const isNewQuiz = questions.length === 0;

  // Preview component - Updated to use ALL sections
  const QuizPreviewPage: React.FC = () => {
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
        uploadedFiles={[]}
        sourceCodeFiles={[]}
        externalResources={[]}
        section={{
          id: 'all-sections',
          name: 'All Sections',
          sections: sections // Pass all processed sections
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
                <h4 className="font-medium text-sm">
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
            {isHovering && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingLectureId(lecture.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 transition-opacity cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLecture(sectionId, lecture.id);
                  }}
                  className="text-gray-500 hover:text-red-600 p-1 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
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
                  onSubmit={handleAddQuestion}
                  onCancel={() => {
                    setShowQuestionForm(false);
                    setShowQuestionTypeSelector(false);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Expanded view
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
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingLectureId(lecture.id);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 transition-opacity cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLecture(sectionId, lecture.id);
                }}
                className="text-gray-500 hover:text-red-600 p-1 transition-opacity cursor-pointer"
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
            {expanded ? (
              !showEditForm && (
                <div className="cursor-pointer p-1 ml-auto rounded hover:bg-gray-200">
                  <ChevronUp size={20} className=" text-gray-500" />
                </div>
              )
            ) : (
              !showEditForm && (
                <div className="cursor-pointer p-1 ml-auto rounded hover:bg-gray-200">
                  <ChevronDown size={20} className=" text-gray-500 " />
                </div>
              )
            )}
          </button>
          <button className="w-7 cursor-move hover:bg-gray-200 p-1 rounded">
            {isHovering && (
              <RxHamburgerMenu size={20} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-400">
          {showQuestionForm || showQuestionTypeSelector ? (
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
                      onSubmit={handleAddQuestion}
                      onCancel={() => {
                        setShowQuestionForm(false);
                        setShowQuestionTypeSelector(false);
                        setEditingQuestionIndex(null);
                      }}
                      isEditedForm={editingQuestionIndex !== null}
                      initialQuestion={
                        editingQuestionIndex !== null
                          ? questions[editingQuestionIndex]
                          : null
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
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
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditQuestion(index)}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
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
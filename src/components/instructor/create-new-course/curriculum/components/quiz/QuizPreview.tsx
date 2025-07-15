"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IoIosInformationCircle,
  IoIosInformationCircleOutline,
} from "react-icons/io";
import {
  ChevronLeft,
  X,
  Settings,
  Maximize,
  ChevronDown,
  Menu,
  CheckCircle,
  CheckCircle2,
  CheckCircleIcon,
  CheckCircle2Icon,
  Link,
} from "lucide-react";
import { LiaTimesSolid } from "react-icons/lia";
import { IoReloadOutline } from "react-icons/io5";
import { BiErrorAlt } from "react-icons/bi";
import { IoChevronForward } from "react-icons/io5";
import { PiCheckThin } from "react-icons/pi";
import { MdOutlineCloseFullscreen, MdOutlineSettings } from "react-icons/md";
import {
  RiCollapseDiagonalLine,
  RiCollapseHorizontalLine,
  RiExpandDiagonalLine,
  RiExpandHorizontalFill,
  RiExpandHorizontalLine,
} from "react-icons/ri";
import { ControlButtons } from "@/components/preview/ControlsButton";
import { usePreviewContext } from "@/app/preview/layout";

// Define interfaces for quiz data
export interface Answer {
  id: number;
  order?: number; // Optional, if you want to allow custom order
  isCorrect: boolean;
  text: string;
  explanation: string;
}

export interface LectureType {
  id: number;
  title: string;
  videoUrl: string;
  notes?: string;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  answerChoices: Answer[];
  orders?: number[]; // Optional, if you want to allow custom order
  relatedLecture?: LectureType;
  type: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface QuizPreviewProps {
  quiz?: Quiz; // Make quiz optional
  onClose?: () => void; // Make onClose optional

  fullScreen?: boolean; // State for full screen mode
}

// Helper function to remove paragraph tags
const removePTags = (text: string): string => {
  if (!text) return "";
  return text.replace(/<\/?p>/g, "");
};

const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  onClose,
  fullScreen,
}) => {
  const { expandedView } = usePreviewContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | undefined>
  >({});
  const [quizStatus, setQuizStatus] = useState<
    "Overview" | "Questions" | "Result"
  >("Overview");
  // const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<
    Record<number, boolean>
  >({});
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);
  const [needsReviewQuestions, setNeedsReviewQuestions] = useState<number[]>(
    []
  );
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [fromResult, setFromResult] = useState<boolean>(false);
  // Add new state for disabled answers
  const [disabledAnswers, setDisabledAnswers] = useState<
    Record<number, number[]>
  >({});
  const [hasShownFeedback, setHasShownFeedback] = useState<boolean>(false);

  const [showRelatedLectureVideo, setShowRelatedLectureVideo] = useState(false);

  // Early return if no quiz data
  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Quiz Data</h2>
          <p className="text-gray-600">No quiz data available to display.</p>
        </div>
      </div>
    );
  }

  const startQuiz = (): void => {
    setQuizStatus("Questions");
  };

  const skipQuiz = (): void => {
    if (onClose) {
      onClose();
    }
  };

  // const toggleSidebar = (): void => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  const totalQuestions = quiz?.questions?.length || 0;
  console.log("Total questions:", totalQuestions);
  const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;
  console.log("Current question:", currentQuestion);
  // const quizDescription = quiz.description;
  const correctAnswerIndex = currentQuestion?.answerChoices?.findIndex(
    (answer) => answer.isCorrect
  );
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrectAnswer =
    selectedAnswers[currentQuestionIndex] === correctAnswerIndex;
  const selectedAnswerIndex = selectedAnswers[currentQuestionIndex];
  const selectedAnswerExplanation =
    selectedAnswerIndex !== undefined
      ? currentQuestion?.answerChoices?.[selectedAnswerIndex]?.explanation || ""
      : "";
  const isRelatedLecture =
    quiz?.questions && quiz.questions[currentQuestionIndex]
      ? quiz.questions[currentQuestionIndex].relatedLecture || null
      : null;

  const toggleLectureVideo = () => {
    setShowRelatedLectureVideo(!showRelatedLectureVideo);
  };

  console.log("Quiz data:", quiz);
  console.log("Current question index:", currentQuestionIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizStatus !== "Questions") return;

      // Check if we're in a text input or textarea (to avoid interfering with typing)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key >= "1" && e.key <= "9") {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < currentQuestion.answerChoices.length) {
          handleAnswerSelection(answerIndex);
        }
        return;
      }

      if (e.key === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        skipQuestion();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        console.log("Shift + Right Arrow detected!");
        if (!isAnswerChecked || !isCorrectAnswer) {
          if (isAnswerSelected) {
            checkAnswer();
          }
        } else {
          goToNextQuestion();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    quizStatus,
    currentQuestionIndex,
    currentQuestion?.answerChoices?.length,
    isAnswerChecked,
    isCorrectAnswer,
    isAnswerSelected,
  ]);

  const handleAnswerSelection = (index: number): void => {
    if (isAnswerDisabled(index)) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: index,
    });
    // Reset feedback state when selecting a new answer
    setShowFeedback(false);
    // setHasShownFeedback(false);
  };

  const checkAnswer = (): void => {
    if (!isAnswerSelected) return;

    setShowFeedback(true);
    setSkippedQuestions(
      skippedQuestions.filter((index) => index !== currentQuestionIndex)
    );

    if (isCorrectAnswer) {
      setIsAnswerChecked(true);

      if (!needsReviewQuestions.includes(currentQuestionIndex)) {
        // setIsAnswerChecked(true);
        setAnsweredCorrectly({
          ...answeredCorrectly,
          [currentQuestionIndex]: true,
        });
      }
    } else {
      // Add the wrong answer to disabled answers
      setDisabledAnswers((prev) => {
        const selectedAnswer = selectedAnswers[currentQuestionIndex];
        if (selectedAnswer === undefined) return prev;

        return {
          ...prev,
          [currentQuestionIndex]: [
            ...(prev[currentQuestionIndex] || []),
            selectedAnswer,
          ],
        };
      });

      // Add to needs review
      if (!needsReviewQuestions.includes(currentQuestionIndex)) {
        setNeedsReviewQuestions([
          ...needsReviewQuestions,
          currentQuestionIndex,
        ]);
      }
    }
  };

  // Calculate if the current answer is disabled
  const isAnswerDisabled = (index: number): boolean => {
    return disabledAnswers[currentQuestionIndex]?.includes(index) || false;
  };

  const goToNextQuestion = (): void => {
    setIsAnswerChecked(false);
    setShowFeedback(false);
    setHasShownFeedback(false); // Reset for next question

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStatus("Result");
    }
  };

  const skipQuestion = (): void => {
    if (
      !needsReviewQuestions.includes(currentQuestionIndex) &&
      !answeredCorrectly[currentQuestionIndex]
    ) {
      setSkippedQuestions([...skippedQuestions, currentQuestionIndex]);
    }

    setIsAnswerChecked(false);
    setShowFeedback(false);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStatus("Result");
    }
  };

  const goToQuestionFromResult = (index: number): void => {
    setCurrentQuestionIndex(index);
    setQuizStatus("Questions");
    setFromResult(true);
    setIsAnswerChecked(true);
    setShowFeedback(true);
  };

  const backToResults = (): void => {
    setQuizStatus("Result");
    setFromResult(false);
  };

  const retryQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setAnsweredCorrectly({});
    setSkippedQuestions([]);
    setNeedsReviewQuestions([]);
    setShowFeedback(false);
    setDisabledAnswers([]);
    setIsAnswerChecked(false);
    setQuizStatus("Questions");
  };

  // Calculate results
  const correctCount = Object.keys(answeredCorrectly).length;
  const skippedCount = skippedQuestions.length;
  const needsReviewCount = needsReviewQuestions.length;

  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={componentRef}
      className={`flex flex-col relative bg-white ${
        fullScreen
          ? "w-screen h-screen"
          : expandedView
          ? "w-screen h-[80vh]"
          : ""
      }`}
      style={{
        maxHeight: fullScreen ? "100vh" : expandedView ? "80vh" : "70vh",
        height: fullScreen ? "100vh" : expandedView ? "80vh" : "70vh",
      }}
    >
      {/* Main content */}
      {(quizStatus === "Overview" || quizStatus === "Questions") && (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-15 w-full">
          {quizStatus === "Overview" && (
            <div className="text-zinc-950 space-y-12 font-medium">
              {/* Details */}
              <div className="space-y-3.5">
                <h2 className="text-3xl font-bold">
                  {quiz?.title || "New quiz"}
                </h2>
                <div className=" space-x-4">
                  <span>Quiz 1</span>
                  <span>|</span>
                  <span>
                    {totalQuestions}{" "}
                    {totalQuestions === 1 ? "question" : "questions"}
                  </span>
                </div>
                <div className="text-gray-700 ">
                  <p
                    dangerouslySetInnerHTML={
                      quiz?.description
                        ? { __html: quiz.description }
                        : { __html: "No description provided." }
                    }
                  ></p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 text-sm">
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
                >
                  Start quiz
                </button>
                <button
                  onClick={skipQuiz}
                  className="px-6 py-2 rounded hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
                >
                  Skip quiz
                </button>
              </div>
            </div>
          )}
          {quizStatus === "Questions" && (
            <>
              <div className="text-shadow-zinc-950 max-w-3xl mx-auto">
                {/* Success Feedback - only show in normal mode when correct */}
                {!fromResult && showFeedback && isCorrectAnswer && (
                  <div
                    className={`rounded-2xl w-full px-6 py-3 border border-green-700 flex gap-4 mb-6 ${
                      !currentQuestion?.answerChoices?.[correctAnswerIndex || 0]
                        ?.explanation
                        ? "items-center"
                        : ""
                    }`}
                  >
                    <CheckCircle2Icon size={30} className="text-green-700" />
                    <div>
                      <p className="font-bold">Good job!</p>
                      {currentQuestion?.answerChoices?.[correctAnswerIndex || 0]
                        ?.explanation && (
                        <p>
                          {
                            currentQuestion.answerChoices[
                              correctAnswerIndex || 0
                            ].explanation
                          }
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Feedback - only show in normal mode when incorrect */}
                {!fromResult && showFeedback && !isCorrectAnswer && (
                  <div
                    className={`rounded-2xl w-full px-6 py-3 border border-red-500 flex gap-4 mb-6 ${
                      !selectedAnswerExplanation ? "items-center" : ""
                    }`}
                  >
                    <BiErrorAlt size={30} className="text-red-500" />
                    <div>
                      <p className="font-bold">
                        Incorrect answer. Please try again.
                      </p>
                      {selectedAnswerExplanation && (
                        <p>{selectedAnswerExplanation}</p>
                      )}
                    </div>
                  </div>
                )}

                {!fromResult &&
                  showFeedback &&
                  !isCorrectAnswer &&
                  isRelatedLecture && (
                    <>
                      {/* <span>{isRelatedLecture.order}</span> */}
                      <div
                        className="text-purple-500 mb-6 cursor-pointer"
                        onClick={toggleLectureVideo}
                      >
                        This was discussed in lecture <span>1</span>:{" "}
                        <span className="flex items-center gap-1">
                          <span className="font-bold">
                            {isRelatedLecture.title}
                          </span>
                          <ChevronDown size={12} />
                        </span>
                      </div>

                      {showRelatedLectureVideo &&
                        (isRelatedLecture.videoUrl ? (
                          <div className="h-80 flex items-center justify-center">
                            <video
                              controls
                              className="max-w-full max-h-full"
                              src={isRelatedLecture.videoUrl}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="text-gray-800 h-80 flex items-center">
                            <div className="max-w-xl mx-auto">
                              Your video failed to process for the following
                              reasons:
                              <ul className="list-disc pl-5">
                                <li>
                                  Your video didn't meet our lowest permissible
                                  resolution of at least 720p.{" "}
                                  <Link
                                    href="#"
                                    className="text-purple-600 underline cursor-pointer hover:text-purple-800 transition"
                                  >
                                    Get Help
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                {/* Explanation from Result - only show if there's an explanation */}
                {fromResult && selectedAnswerExplanation && (
                  <div
                    className={`rounded-2xl w-full px-6 py-3 border border-gray-400 flex gap-4 mb-6 items-center`}
                  >
                    <IoIosInformationCircleOutline
                      size={30}
                      className="text-purple-500"
                    />
                    <div>
                      <p className="font-bold">{selectedAnswerExplanation}</p>
                    </div>
                  </div>
                )}

                {/* Multiple choice question */}
                <div className="mb-6">
                  <h2 className="mb-4 space-y-1.5">
                    <p>Question {currentQuestionIndex + 1}:</p>
                    <p>
                      {removePTags(currentQuestion?.text) || "Question text"}
                    </p>
                  </h2>
                  <div className="space-y-3 font-medium">
                    {currentQuestion?.answerChoices?.map((answer, index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelection(index)}
                        className={`p-4 ring-1 rounded cursor-pointer hover:bg-slate-100 ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? "ring-purple-700"
                            : "ring-zinc-300 hover:border-gray-300"
                        } ${
                          isAnswerDisabled(index)
                            ? "opacity-60 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <button
                            className={`p-0.5 size-4.5 rounded-full ring-2 transition ${
                              selectedAnswers[currentQuestionIndex] === index
                                ? "ring-purple-700"
                                : "ring-zinc-950"
                            } ${
                              isAnswerDisabled(index) ? "ring-opacity-60" : ""
                            }`}
                          >
                            <div
                              className={`size-full rounded-full transition ${
                                selectedAnswers[currentQuestionIndex] === index
                                  ? "bg-purple-700"
                                  : "bg-transparent"
                              } ${
                                isAnswerDisabled(index) ? "bg-opacity-60" : ""
                              }`}
                            ></div>
                          </button>
                          <div
                            className={`${
                              isAnswerDisabled(index) ? "opacity-60" : ""
                            }`}
                          >
                            {removePTags(answer.text)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {quizStatus === "Result" && (
        <div className="overflow-y-auto flex-1">
          {/* heading */}
          <div className="bg-black text-white w-full px-10 md:px-30 py-5 sm:py-10 space-y-2">
            <h2 className="font-semibold text-2xl">
              Complete the quiz to see your results.
            </h2>
            <p className="font-semibold text-sm">
              You got {correctCount} out of {totalQuestions} correct.{" "}
              {skippedCount} questions are skipped.
            </p>
          </div>

          {/* Results */}
          <div className="space-y-6 px-10 md:px-30 py-5 sm:py-10">
            {/* Skipped questions */}
            {skippedQuestions.length > 0 && (
              <div className="flex gap-2">
                <IoReloadOutline className="translate-y-[3.5px]" />
                <div className="space-y-4">
                  <h3 className="font-bold">What you Skipped</h3>
                  <div className="space-y-4">
                    {skippedQuestions.map((index) => (
                      <p
                        key={index}
                        className="cursor-pointer"
                        onClick={() => goToQuestionFromResult(index)}
                      >
                        {removePTags(quiz.questions[index].text)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Correctly Answered questions */}
            {correctCount > 0 && (
              <div className="flex gap-2">
                <PiCheckThin className="translate-y-[3.5px]" />
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-bold">What you Know</h3>
                    <IoIosInformationCircle className="cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    {Object.keys(answeredCorrectly).map((key) => {
                      const index = parseInt(key);
                      return (
                        <p
                          key={index}
                          className="cursor-pointer"
                          onClick={() => goToQuestionFromResult(index)}
                        >
                          {removePTags(quiz.questions[index].text)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Wrongly Answered questions */}
            {needsReviewQuestions.length > 0 && (
              <div className="flex gap-2">
                <LiaTimesSolid className="translate-y-[3.5px] text-red-500" />
                <div className="space-y-4">
                  <h3 className="font-bold">What you should review</h3>
                  <div className="space-y-4">
                    {needsReviewQuestions.map((index) => (
                      <p
                        key={index}
                        className="cursor-pointer"
                        onClick={() => goToQuestionFromResult(index)}
                      >
                        {removePTags(quiz.questions[index].text)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center bg-white border-t border-gray-200 pl-4 h-14">
        {quizStatus !== "Overview" && (
          <div className="flex justify-between items-center mt-auto pr-4 h-full flex-1">
            <>
              <div className="">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>

              <div className="space-x-2 text-sm font-bold">
                {quizStatus === "Questions" && (
                  <>
                    {fromResult ? (
                      <button
                        onClick={backToResults}
                        className="px-4 py-2 rounded bg-[#6d28d2] text-white hover:bg-purple-700 cursor-pointer"
                      >
                        Back to result
                      </button>
                    ) : (
                      <>
                        {/* {isLastQuestion && (
                       
                      )} */}

                        {/* Always show Check button if answer isn't correct */}
                        {!isAnswerChecked || !isCorrectAnswer ? (
                          <>
                            <button
                              onClick={skipQuestion}
                              className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
                            >
                              Skip question
                            </button>
                            <button
                              disabled={!isAnswerSelected}
                              onClick={checkAnswer}
                              className="transition px-4 py-2 rounded bg-[#6d28d2] text-white hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-200"
                            >
                              Check answer
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={goToNextQuestion}
                            className={`px-4 py-2 rounded pointer bg-[#6d28d2] text-white hover:bg-purple-700`}
                          >
                            <span className="flex items-center gap-0.5">
                              {!isLastQuestion ? (
                                <span>Next</span>
                              ) : (
                                <span>See results</span>
                              )}
                              <IoChevronForward
                                size={12}
                                className="translate-y-px"
                              />
                            </span>
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
                {/* ... (keep the rest of the footer controls the same) */}
                {quizStatus === "Result" && (
                  <>
                    <button className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer">
                      Continue
                    </button>
                    <button
                      onClick={retryQuiz}
                      className="transition px-4 py-2 rounded bg-[#6d28d2] text-white hover:bg-purple-700 cursor-pointer"
                    >
                      Retry quiz
                    </button>
                  </>
                )}
              </div>
            </>
          </div>
        )}
        {/* Sidebar settings and full screen toggle button */}
        <ControlButtons componentRef={componentRef} className="ml-auto" />
      </div>
    </div>
  );
};

export default QuizPreview;

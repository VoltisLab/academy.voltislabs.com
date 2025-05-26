// "use client";
// import React, { useState } from 'react';
// import { ChevronLeft, X, Settings, Maximize, ChevronDown, Menu } from 'lucide-react';

// // Define interfaces for quiz data
// export interface Answer {
//   text: string;
//   explanation: string;
// }

// export interface Question {
//   id: string;
//   text: string;
//   answers: Answer[];
//   correctAnswerIndex: number;
//   relatedLecture?: string;
//   type: string;
// }

// export interface Quiz {
//   id: string;
//   name: string;
//   description?: string;
//   questions: Question[];
// }

// interface QuizPreviewProps {
//   quiz: Quiz;
//   onClose: () => void;
// }

// // Helper function to remove paragraph tags
// const removePTags = (text: string): string => {
//   if (!text) return '';
//   return text.replace(/<\/?p>/g, '');
// };

// const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onClose }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [quizStarted, setQuizStarted] = useState<boolean>(false);
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

//   const startQuiz = (): void => {
//     setQuizStarted(true);
//   };

//   const skipQuiz = (): void => {
//     onClose();
//   };

//   const toggleSidebar = (): void => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const totalQuestions = quiz?.questions?.length || 0;
//   const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;

//   return (
//     <div className="flex flex-col h-screen bg-white relative">
//       {/* Header */}
//       <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
//         <div className="flex items-center space-x-4">
//           <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-lg font-semibold">{quiz?.name || "New quiz"}</h1>
//             <div className="text-sm text-gray-500 flex items-center space-x-2">
//               <span>Quiz {1}</span>
//               <span>|</span>
//               <span>{totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={toggleSidebar}
//             className="text-gray-600 hover:text-gray-900 md:hidden"
//             aria-label="Toggle course content"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <button className="text-gray-600 hover:text-gray-900">
//             <Settings className="w-5 h-5" />
//           </button>
//           <button className="text-gray-600 hover:text-gray-900">
//             <Maximize className="w-5 h-5" />
//           </button>
//           <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       </header>

//       {/* Main content */}
//       <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full">
//         {!quizStarted ? (
//           <div className="text-center">
//             <h2 className="text-2xl font-bold mb-1">{quiz?.name || "New quiz"}</h2>
//             <div className="text-gray-500 mb-2">
//               Quiz 1 | {totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'}
//             </div>
//             <div className="text-gray-700 mb-8">
//               {quiz?.description || "Quiz description"}
//             </div>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={startQuiz}
//                 className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//               >
//                 Start quiz
//               </button>
//               <button
//                 onClick={skipQuiz}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//               >
//                 Skip quiz
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div className="mb-6">
//               {/* Remove p tags from question text */}
//               <h2 className="text-xl font-bold mb-4">{removePTags(currentQuestion?.text) || "Question text"}</h2>
//               <div className="space-y-3">
//                 {currentQuestion?.answers?.map((answer, index) => (
//                   <div
//                     key={index}
//                     onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestionIndex]: index})}
//                     className={`p-4 border rounded-lg cursor-pointer ${
//                       selectedAnswers[currentQuestionIndex] === index
//                         ? 'border-purple-500 bg-purple-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
//                         selectedAnswers[currentQuestionIndex] === index ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300'
//                       }`}>
//                         {String.fromCharCode(65 + index)}
//                       </div>
//                       {/* Remove p tags from answer text */}
//                       <div>{removePTags(answer.text)}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-500">
//                 Question {currentQuestionIndex + 1} of {totalQuestions}
//               </div>
//               <button
//                 disabled={selectedAnswers[currentQuestionIndex] === undefined}
//                 className={`px-4 py-2 rounded ${
//                   selectedAnswers[currentQuestionIndex] === undefined
//                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                     : 'bg-purple-600 text-white hover:bg-purple-700'
//                 }`}
//                 onClick={() => {
//                   if (currentQuestionIndex < totalQuestions - 1) {
//                     setCurrentQuestionIndex(currentQuestionIndex + 1);
//                   } else {
//                     // Last question - show results or close
//                     onClose();
//                   }
//                 }}
//               >
//                 {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish Quiz'}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Course Content Toggle Button for small screens - outside header for better positioning */}
//       <button
//         onClick={toggleSidebar}
//         className="fixed bottom-4 right-4 z-20 md:hidden bg-purple-600 text-white p-3 rounded-full shadow-lg"
//         aria-label="Toggle course content"
//       >
//         <Menu className="w-5 h-5" />
//       </button>

//       {/* Right sidebar - with responsive behavior */}
//       <div
//         className={`fixed top-0 right-0 w-64 h-full bg-gray-50 border-l border-gray-200 z-10 overflow-y-auto transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? 'transform-none' : 'translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div className="p-4">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-sm font-semibold">Course content</h2>
//             <button
//               onClick={toggleSidebar}
//               className="text-gray-500 hover:text-gray-700"
//               aria-label="Close sidebar"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="mb-2">
//             <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded px-2">
//               <div className="text-sm font-medium">Section 1: Introduction</div>
//               <ChevronDown className="w-4 h-4 text-gray-500" />
//             </div>
//             <div className="ml-4 mt-1">
//               <div className="flex items-center py-2 cursor-pointer bg-gray-200 rounded px-2">
//                 <div className="w-4 h-4 mr-2 flex-shrink-0">
//                   <input type="checkbox" checked className="w-4 h-4 text-indigo-600" readOnly />
//                 </div>
//                 <div className="text-sm">Quiz 1: New quiz</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Overlay to close sidebar when clicking outside on mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
//           onClick={toggleSidebar}
//           aria-label="Close sidebar"
//         ></div>
//       )}
//     </div>
//   );
// };

// export default QuizPreview;

// ______________________________________________________________________________________________

// "use client";
// import React, { useState } from "react";
// import {
//   IoIosInformationCircle,
//   IoIosInformationCircleOutline,
// } from "react-icons/io";
// import {
//   ChevronLeft,
//   X,
//   Settings,
//   Maximize,
//   ChevronDown,
//   Menu,
//   CheckCircle,
//   CheckCircle2,
//   CheckCircleIcon,
//   CheckCircle2Icon,
// } from "lucide-react";
// import { LiaTimesSolid } from "react-icons/lia";
// import { IoReloadOutline } from "react-icons/io5";

// import { BiErrorAlt } from "react-icons/bi";
// import { IoChevronForward } from "react-icons/io5";
// import { PiCheckThin } from "react-icons/pi";

// // Define interfaces for quiz data
// export interface Answer {
//   text: string;
//   explanation: string;
// }

// export interface Question {
//   id: string;
//   text: string;
//   answers: Answer[];
//   correctAnswerIndex: number;
//   relatedLecture?: string;
//   type: string;
// }

// export interface Quiz {
//   id: string;
//   name: string;
//   description?: string;
//   questions: Question[];
// }

// interface QuizPreviewProps {
//   quiz: Quiz;
//   onClose: () => void;
// }

// // Helper function to remove paragraph tags
// const removePTags = (text: string): string => {
//   if (!text) return "";
//   return text.replace(/<\/?p>/g, "");
// };

// const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onClose }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<
//     Record<number, number>
//   >({});
//   // const [quizStarted, setQuizStarted] = useState<boolean>(false);
//   const [quizStatus, setQuizStatus] = useState<
//     "Overview" | "Questions" | "Result"
//   >("Questions");
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

//   const startQuiz = (): void => {
//     setQuizStatus("Questions");
//   };

//   const skipQuiz = (): void => {
//     onClose();
//   };

//   const toggleSidebar = (): void => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const totalQuestions = quiz?.questions?.length || 0;
//   const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;
//   const quizDescription = quiz.description;

//   const correctAnswerIndex =
//     quiz.questions?.[currentQuestionIndex].correctAnswerIndex;
//   console.log(
//     quiz.questions?.[currentQuestionIndex].answers?.[correctAnswerIndex]
//   );
//   console.log(
//     // quiz.questions?.[currentQuestionIndex].answers?.[
//     //   selectedAnswers[currentQuestionIndex]
//     // ].explanation

//     selectedAnswers
//   );
//   return (
//     <div className="flex flex-col h-screen relative">
//       {/* Main content */}
//       {(quizStatus === "Overview" || quizStatus === "Questions") && (
//         <main className="flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-15 w-full">
//           {quizStatus === "Overview" && (
//             <div className="text-zinc-950 space-y-12 font-medium">
//               {/* Details */}
//               <div className="space-y-3.5">
//                 <h2 className="text-3xl font-bold">
//                   {quiz?.name || "New quiz"}
//                 </h2>
//                 <div className=" space-x-4">
//                   <span>Quiz 1</span>
//                   <span>|</span>
//                   <span>
//                     {totalQuestions}{" "}
//                     {totalQuestions === 1 ? "question" : "questions"}
//                   </span>
//                 </div>
//                 <div className="text-gray-700 ">
//                   {quiz?.description || "Quiz description"}
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className="flex space-x-4 text-sm">
//                 <button
//                   onClick={startQuiz}
//                   className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
//                 >
//                   Start quiz
//                 </button>
//                 <button
//                   onClick={skipQuiz}
//                   className="px-6 py-2 rounded hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
//                 >
//                   Skip quiz
//                 </button>
//               </div>
//             </div>
//           )}
//           {quizStatus === "Questions" && (
//             <>
//               <div className="text-shadow-zinc-950 max-w-3xl mx-auto">
//                 {/* Success  */}
//                 <div
//                   className={`rounded-2xl w-full px-6 py-3 border border-green-700 flex gap-4 mb-6 ${
//                     !currentQuestion.answers[
//                       currentQuestion?.correctAnswerIndex
//                     ].explanation
//                       ? "items-center"
//                       : ""
//                   }`}
//                 >
//                   <CheckCircle2Icon size={30} className="text-green-700" />
//                   <div>
//                     <p className="font-bold">Good job!</p>
//                     {quiz.questions?.[currentQuestionIndex].answers?.[
//                       correctAnswerIndex
//                     ].explanation && (
//                       <p>
//                         {
//                           currentQuestion.answers[
//                             currentQuestion?.correctAnswerIndex
//                           ].explanation
//                         }
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Error  */}
//                 <div
//                   className={`rounded-2xl w-full px-6 py-3 border border-red-500 flex gap-4 mb-6 ${
//                     !currentQuestion.answers[
//                       currentQuestion?.correctAnswerIndex
//                     ].explanation
//                       ? "items-center"
//                       : ""
//                   }`}
//                 >
//                   <BiErrorAlt size={30} className="text-red-500" />
//                   <div>
//                     <p className="font-bold">
//                       Incorrect answer. Please try again.
//                     </p>
//                     {quiz.questions?.[currentQuestionIndex].answers?.[
//                       selectedAnswers[currentQuestionIndex]
//                     ].explanation === "" && (
//                       <p>
//                         {
//                           currentQuestion.answers[
//                             currentQuestion?.correctAnswerIndex
//                           ].explanation
//                         }
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* If any question is clicked from the result and there is explanation for the answer choosen. it shaows this  */}
//                 <div
//                   className={`rounded-2xl w-full px-6 py-3 border border-gray-400 flex gap-4 mb-6 items-center`}
//                 >
//                   <IoIosInformationCircleOutline
//                     size={30}
//                     className="text-purple-500"
//                   />
//                   <div>
//                     {quiz.questions?.[currentQuestionIndex].answers?.[
//                       selectedAnswers[currentQuestionIndex]
//                     ].explanation === "" && (
//                       <p className="font-bold">
//                         {currentQuestion.answers[
//                           currentQuestion?.correctAnswerIndex
//                         ].explanation || "explanation"}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Multiple choice question  */}
//                 <div className="mb-6">
//                   {/* Remove p tags from question text */}
//                   <h2 className="mb-4 space-y-1.5">
//                     <p>Question {quiz.questions.length}:</p>
//                     <p>
//                       {removePTags(currentQuestion?.text) || "Question text"}
//                     </p>
//                   </h2>
//                   <div className="space-y-3 font-medium">
//                     {currentQuestion?.answers?.map((answer, index) => (
//                       <div
//                         key={index}
//                         // htmlFor="quizOption"
//                         onClick={() =>
//                           setSelectedAnswers({
//                             ...selectedAnswers,
//                             [currentQuestionIndex]: index,
//                           })
//                         }
//                         className={`p-4 ring-1 rounded cursor-pointer hover:bg-slate-100 ${
//                           selectedAnswers[currentQuestionIndex] === index
//                             ? "ring-purple-700"
//                             : "ring-zinc-300 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="flex items-center gap-4">
//                           {/* <div
//                         className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
//                           selectedAnswers[currentQuestionIndex] === index
//                             ? "border-purple-500 bg-purple-500 text-white"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {String.fromCharCode(65 + index)}
//                       </div> */}

//                           <button
//                             className={`p-0.5 size-4.5 rounded-full ring-2 transition ${
//                               selectedAnswers[currentQuestionIndex] === index
//                                 ? "ring-purple-700"
//                                 : "ring-zinc-950"
//                             }`}
//                           >
//                             <div
//                               className={`size-full rounded-full transition ${
//                                 selectedAnswers[currentQuestionIndex] === index
//                                   ? "bg-purple-700"
//                                   : "bg-transparent"
//                               }`}
//                             ></div>{" "}
//                           </button>

//                           {/* Remove p tags from answer text */}
//                           <div>{removePTags(answer.text)}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </main>
//       )}

//       {quizStatus === "Result" && (
//         <div className="overflow-y-auto">
//           {/* heading */}
//           <div className=" bg-black text-white w-full px-10 md:px-30 py-5 sm:py-10 space-y-2">
//             <h2 className="font-semibold text-2xl">
//               Complete the quiz to see your results.
//             </h2>
//             <p className="font-semibold text-sm">
//               You got [1] out of [4] correct. [2] questions are skipped.
//             </p>
//           </div>

//           {/* Results */}
//           <div className="space-y-6 px-10 md:px-30 py-5 sm:py-10">
//             {/* Skipped questions */}
//             <div className="flex gap-2">
//               <IoReloadOutline className="translate-y-[3.5px]" />
//               <div className="space-y-4">
//                 <h3 className="font-bold">What you Skipped</h3>

//                 <div className="space-y-4">
//                   {/*array of Skipped questions */}
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your name?
//                   </p>
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your Point?
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Correctly Answered questions */}
//             <div className="flex gap-2">
//               <PiCheckThin className="translate-y-[3.5px]" />
//               <div className="space-y-4">
//                 <div className="flex gap-2 items-center">
//                   <h3 className="font-bold">What you Know</h3>
//                   <IoIosInformationCircle className="cursor-pointer" />
//                 </div>

//                 <div className="space-y-4">
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your name?
//                   </p>
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your Point?
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Wrongly Answered questions */}

//             <div className="flex gap-2">
//               <LiaTimesSolid className="translate-y-[3.5px] text-red-500" />
//               <div className="space-y-4">
//                 <h3 className="font-bold">What you should review</h3>
//                 <div className="space-y-4">
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your name?
//                   </p>
//                   <p className="cursor-pointer" onClick={() => {}}>
//                     What is your Point?
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Skip, Next, Settings */}
//       <div className="flex justify-between items-center mt-auto border-t-2 border-black px-4 h-14">
//         {quizStatus !== "Overview" && (
//           <>
//             <div className="">
//               Question {currentQuestionIndex + 1} of {totalQuestions}
//             </div>

//             <div className="space-x-2 text-sm font-bold">
//               {selectedAnswers[currentQuestionIndex] !== undefined && (
//                 <button
//                   className={`px-4 py-2 rounded pointer bg-purple-600 text-white hover:bg-purple-700`}
//                   onClick={() => {
//                     if (currentQuestionIndex < totalQuestions - 1) {
//                       setCurrentQuestionIndex(currentQuestionIndex + 1);
//                     } else {
//                       // Last question - show results or close
//                       onClose();
//                     }
//                   }}
//                 >
//                   <span className="flex items-center gap-0.5">
//                     {currentQuestionIndex < totalQuestions - 1 ? (
//                       <span>Next</span>
//                     ) : (
//                       <span>See results</span>
//                     )}
//                     <IoChevronForward size={12} className="translate-y-px" />
//                   </span>
//                 </button>
//               )}

//               {quizStatus === "Questions" && (
//                 <>
//                   {currentQuestionIndex < totalQuestions - 1 && (
//                     <button className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer">
//                       Skip question
//                     </button>
//                   )}

//                   <button
//                     disabled={
//                       selectedAnswers[currentQuestionIndex] === undefined
//                     }
//                     className="transition px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-200"
//                   >
//                     Check answer
//                   </button>

//                   {/* The below button should only show if we are coming from result */}
//                   <button className="transition px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-200">
//                     Back to result
//                   </button>
//                 </>
//               )}
//               {quizStatus === "Result" && (
//                 <>
//                   <button className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer">
//                     Continue
//                   </button>
//                   <button
//                     onClick={() => {
//                       setQuizStatus("Overview");
//                     }}
//                     className="transition px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-200"
//                   >
//                     Retry quiz
//                   </button>
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* footer  */}
//       <div className="h-24 bg-red-100"></div>
//     </div>
//   );
// };

// export default QuizPreview;

"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { LiaTimesSolid } from "react-icons/lia";
import { IoReloadOutline } from "react-icons/io5";
import { BiErrorAlt } from "react-icons/bi";
import { IoChevronForward } from "react-icons/io5";
import { PiCheckThin } from "react-icons/pi";

// Define interfaces for quiz data
export interface Answer {
  text: string;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex: number;
  relatedLecture?: string;
  type: string;
}

export interface Quiz {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

interface QuizPreviewProps {
  quiz?: Quiz; // Make quiz optional
  onClose?: () => void; // Make onClose optional
}

// Helper function to remove paragraph tags
const removePTags = (text: string): string => {
  if (!text) return "";
  return text.replace(/<\/?p>/g, "");
};

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | undefined>
  >({});
  const [quizStatus, setQuizStatus] = useState<
    "Overview" | "Questions" | "Result"
  >("Overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
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

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;
  const quizDescription = quiz.description;
  const correctAnswerIndex = currentQuestion?.correctAnswerIndex;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrectAnswer =
    selectedAnswers[currentQuestionIndex] === correctAnswerIndex;
  const selectedAnswerIndex = selectedAnswers[currentQuestionIndex];
  const selectedAnswerExplanation =
    selectedAnswerIndex !== undefined
      ? currentQuestion?.answers?.[selectedAnswerIndex]?.explanation || ""
      : "";

  const handleAnswerSelection = (index: number): void => {
    if (isAnswerDisabled(index)) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: index,
    });
    // Reset feedback state when selecting a new answer
    setHasShownFeedback(false);
  };

  const checkAnswer = (): void => {
    if (!isAnswerSelected) return;

    setIsAnswerChecked(true);
    setShowFeedback(true);
    setHasShownFeedback(true);

    if (isCorrectAnswer) {
      setAnsweredCorrectly({
        ...answeredCorrectly,
        [currentQuestionIndex]: true,
      });
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
    setSkippedQuestions([...skippedQuestions, currentQuestionIndex]);
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

  return (
    <div className="flex flex-col h-full relative w-[79.5vw]">
      {/* Main content */}
      {(quizStatus === "Overview" || quizStatus === "Questions") && (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-15 w-full">
          {quizStatus === "Overview" && (
            <div className="text-zinc-950 space-y-12 font-medium">
              {/* Details */}
              <div className="space-y-3.5">
                <h2 className="text-3xl font-bold">
                  {quiz?.name || "New quiz"}
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
                  {quiz?.description || "Quiz description"}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 text-sm">
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
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
                      !currentQuestion?.answers?.[correctAnswerIndex || 0]?.explanation
                        ? "items-center"
                        : ""
                    }`}
                  >
                    <CheckCircle2Icon size={30} className="text-green-700" />
                    <div>
                      <p className="font-bold">Good job!</p>
                      {currentQuestion?.answers?.[correctAnswerIndex || 0]
                        ?.explanation && (
                        <p>
                          {
                            currentQuestion.answers[correctAnswerIndex || 0]
                              .explanation
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
                    {currentQuestion?.answers?.map((answer, index) => (
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
        <div className="overflow-y-auto">
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
      <div className="flex justify-between items-center mt-auto border-t-2 border-black px-4 h-14">
        {quizStatus !== "Overview" && (
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
                      className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                    >
                      Back to result
                    </button>
                  ) : (
                    <>
                      {!isLastQuestion && !isAnswerChecked && (
                        <button
                          onClick={skipQuestion}
                          className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
                        >
                          Skip question
                        </button>
                      )}

                      {/* Always show Check button if answer isn't correct */}
                      {!isAnswerChecked || !isCorrectAnswer ? (
                        <button
                          disabled={!isAnswerSelected}
                          onClick={checkAnswer}
                          className="transition px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-200"
                        >
                          Check answer
                        </button>
                      ) : (
                        <button
                          onClick={goToNextQuestion}
                          className={`px-4 py-2 rounded pointer bg-purple-600 text-white hover:bg-purple-700`}
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
                    className="transition px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                  >
                    Retry quiz
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPreview;

// {
//   /* Course Content Toggle Button for small screens - outside header for better positioning */
// }
// <button
//   onClick={toggleSidebar}
//   className="fixed bottom-4 right-4 z-20 md:hidden bg-purple-600 text-white p-3 rounded-full shadow-lg"
//   aria-label="Toggle course content"
// >
//   <Menu className="w-5 h-5" />
// </button>;
// {
//   /* Right sidebar - with responsive behavior */
// }
// <div
//   className={`fixed top-0 right-0 w-64 h-full bg-gray-50 border-l border-gray-200 z-10 overflow-y-auto transition-transform duration-300 ease-in-out ${
//     sidebarOpen ? "transform-none" : "translate-x-full md:translate-x-0"
//   }`}
// >
//   <div className="p-4">
//     <div className="flex justify-between items-center mb-2">
//       <h2 className="text-sm font-semibold">Course content</h2>
//       <button
//         onClick={toggleSidebar}
//         className="text-gray-500 hover:text-gray-700"
//         aria-label="Close sidebar"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>

//     <div className="mb-2">
//       <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded px-2">
//         <div className="text-sm font-medium">Section 1: Introduction</div>
//         <ChevronDown className="w-4 h-4 text-gray-500" />
//       </div>
//       <div className="ml-4 mt-1">
//         <div className="flex items-center py-2 cursor-pointer bg-gray-200 rounded px-2">
//           <div className="w-4 h-4 mr-2 flex-shrink-0">
//             <input
//               type="checkbox"
//               checked
//               className="w-4 h-4 text-indigo-600"
//               readOnly
//             />
//           </div>
//           <div className="text-sm">Quiz 1: New quiz</div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>;
// {
//   /* Overlay to close sidebar when clicking outside on mobile */
// }
// {
//   sidebarOpen && (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
//       onClick={toggleSidebar}
//       aria-label="Close sidebar"
//     ></div>
//   );
// }

/////////////////////////////////////////////////////////////////////////////////////////////????????????????

{
  /* Header */
}
{
  /* <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">
              {quiz?.name || "New quiz"}
            </h1>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>Quiz {1}</span>
              <span>|</span>
              <span>
                {totalQuestions}{" "}
                {totalQuestions === 1 ? "question" : "questions"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 md:hidden"
            aria-label="Toggle course content"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Maximize className="w-5 h-5" />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header> */
}

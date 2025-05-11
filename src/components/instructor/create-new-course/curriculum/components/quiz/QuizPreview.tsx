"use client";
import React, { useState } from 'react';
import { ChevronLeft, X, Settings, Maximize, ChevronDown, Menu } from 'lucide-react';

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
  quiz: Quiz;
  onClose: () => void;
}

// Helper function to remove paragraph tags
const removePTags = (text: string): string => {
  if (!text) return '';
  return text.replace(/<\/?p>/g, '');
};

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const startQuiz = (): void => {
    setQuizStarted(true);
  };

  const skipQuiz = (): void => {
    onClose();
  };

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const totalQuestions = quiz?.questions?.length || 0;
  const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;

  return (
    <div className="flex flex-col h-screen bg-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">{quiz?.name || "New quiz"}</h1>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>Quiz {1}</span>
              <span>|</span>
              <span>{totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'}</span>
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
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {!quizStarted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">{quiz?.name || "New quiz"}</h2>
            <div className="text-gray-500 mb-2">
              Quiz 1 | {totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'}
            </div>
            <div className="text-gray-700 mb-8">
              {quiz?.description || "Quiz description"}
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={startQuiz}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Start quiz
              </button>
              <button 
                onClick={skipQuiz}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Skip quiz
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              {/* Remove p tags from question text */}
              <h2 className="text-xl font-bold mb-4">{removePTags(currentQuestion?.text) || "Question text"}</h2>
              <div className="space-y-3">
                {currentQuestion?.answers?.map((answer, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestionIndex]: index})}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedAnswers[currentQuestionIndex] === index 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
                        selectedAnswers[currentQuestionIndex] === index ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      {/* Remove p tags from answer text */}
                      <div>{removePTags(answer.text)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <button
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className={`px-4 py-2 rounded ${
                  selectedAnswers[currentQuestionIndex] === undefined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                onClick={() => {
                  if (currentQuestionIndex < totalQuestions - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    // Last question - show results or close
                    onClose();
                  }
                }}
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish Quiz'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Course Content Toggle Button for small screens - outside header for better positioning */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-20 md:hidden bg-purple-600 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle course content"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right sidebar - with responsive behavior */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-gray-50 border-l border-gray-200 z-10 overflow-y-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'transform-none' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Course content</h2>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded px-2">
              <div className="text-sm font-medium">Section 1: Introduction</div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="ml-4 mt-1">
              <div className="flex items-center py-2 cursor-pointer bg-gray-200 rounded px-2">
                <div className="w-4 h-4 mr-2 flex-shrink-0">
                  <input type="checkbox" checked className="w-4 h-4 text-indigo-600" readOnly />
                </div>
                <div className="text-sm">Quiz 1: New quiz</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden" 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        ></div>
      )}
    </div>
  );
};

export default QuizPreview;
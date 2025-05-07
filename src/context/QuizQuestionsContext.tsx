import React, { createContext, useContext, useState } from "react";

export interface Answer {
  text: string;
  explanation: string;
}

export interface Question {
  id: string;
  questionText: string;
  answers: Answer[];
  correctAnswerIndex: number | null;
  relatedLecture: string;
}

interface QuestionContextType {
  questions: Question[];
  currentQuestion: Question | null;
  addQuestion: (q: Question) => void;
  updateQuestion: (q: Question) => void;
  getQuestionById: (id: string) => void;
  clearCurrentQuestion: () => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const addQuestion = (q: Question) => {
    setQuestions((prev) => [...prev, q]);
  };

  const updateQuestion = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  const getQuestionById = (id: string) => {
    const found = questions.find((q) => q.id === id) || null;
    setCurrentQuestion(found);
  };

  const clearCurrentQuestion = () => {
    setCurrentQuestion(null);
  };

  return (
    <QuestionContext.Provider
      value={{
        questions,
        currentQuestion,
        addQuestion,
        updateQuestion,
        getQuestionById,
        clearCurrentQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => {
  const ctx = useContext(QuestionContext);
  if (!ctx)
    throw new Error("useQuestionContext must be used within QuestionProvider");
  return ctx;
};

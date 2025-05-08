"use client";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import RichTextEditor from "./RichTextEditor";

interface QuestionFormProps {
  onSubmit: (question: any) => void; // rename to be more generic
  onCancel: () => void;
  initialQuestion?: any;
  isEditedForm?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  onCancel,
  initialQuestion,
  isEditedForm,
}) => {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState<
    Array<{ text: string; explanation: string }>
  >([
    { text: "", explanation: "" },
    { text: "", explanation: "" },
    { text: "", explanation: "" },
    { text: "", explanation: "" },
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [relatedLecture, setRelatedLecture] = useState("");
  const [error, setError] = useState("");
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState<number | null>(
    null
  );

  const [focusedAnswerIndex, setFocusedAnswerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // If we're editing an existing question, populate the form
    if (initialQuestion) {
      setQuestionText(initialQuestion.text || "");
      setAnswers(
        initialQuestion.answers || [
          { text: "", explanation: "" },
          { text: "", explanation: "" },
          { text: "", explanation: "" },
          { text: "", explanation: "" },
        ]
      );
      setCorrectAnswerIndex(initialQuestion.correctAnswerIndex || null);
      setRelatedLecture(initialQuestion.relatedLecture || "");
    }
  }, [initialQuestion]);

  const addAnswer = () => {
    if (answers.length < 15) {
      setAnswers([...answers, { text: "", explanation: "" }]);
    }
  };

  const removeAnswer = (indexToRemove: number) => {
    if (answers.length <= 2) {
      setError("Questions must have at least 2 answers");
      return;
    }

    const newAnswers = answers.filter((_, index) => index !== indexToRemove);
    setAnswers(newAnswers);

    // Adjust the correct answer index if necessary
    if (correctAnswerIndex === indexToRemove) {
      setCorrectAnswerIndex(null);
    } else if (
      correctAnswerIndex !== null &&
      correctAnswerIndex > indexToRemove
    ) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  const updateAnswerText = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);

    // If this is the last answer and it's being filled, add another empty answer
    if (
      index === answers.length - 1 &&
      value.trim() !== "" &&
      answers.length < 15
    ) {
      addAnswer();
    }
  };

  const updateAnswerExplanation = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].explanation = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Validate form
    if (!questionText.trim()) {
      setError("Question text is required");
      return;
    }

    // Filter out empty answers
    const validAnswers = answers.filter((answer) => answer.text.trim() !== "");

    if (validAnswers.length < 2) {
      setError("At least 2 answers are required");
      toast.error("At least 2 answers are required");
      return;
    }

    if (correctAnswerIndex === null) {
      setError("You must select a correct answer");
      toast.error("You must select a correct answer");
      return;
    }

    // Create the question object
    const question = {
      ...(isEditedForm && initialQuestion?.id && { id: initialQuestion.id }),
      text: questionText,
      answers: validAnswers,
      correctAnswerIndex,
      relatedLecture,
      type: "multiple-choice",
    };

    onSubmit(question);
  };

  return (
    <div className="border border-t-0 border-gray-200 p-2 xl:p-4 mb-4 bg-white">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">Question</label>

        <RichTextEditor
          value={questionText}
          onChange={setQuestionText}
          type="question"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Answers
        </label>
        {answers.map((answer, index) => (
          <div
            key={index}
            className="mb-4"
            onMouseEnter={() => setHoveredAnswerIndex(index)}
            onMouseLeave={() => setHoveredAnswerIndex(null)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={`answer-${index}`}
                name="correctAnswer"
                checked={correctAnswerIndex === index}
                onChange={() => setCorrectAnswerIndex(index)}
                className="mr-2 size-5 accent-purple-600"
              />

              <div className="flex-1">
                <div className="mb-2 relative h-fit ">
                  <div className="flex items-start">
                    <div className="w-full space-y-2">
                      <RichTextEditor
                        type="answer"
                        value={answer.text}
                        onChange={(value: string) =>
                          updateAnswerText(index, value)
                        }
                        isFocusedAnswerId={focusedAnswerIndex === index}
                        setFocusedAnswerIndex={setFocusedAnswerIndex}
                        answerIndex={index}
                      />

                      <div className="relative w-[90%] ml-auto">
                        <input
                          type="text"
                          value={answer.explanation}
                          onChange={(e) =>
                            updateAnswerExplanation(index, e.target.value)
                          }
                          placeholder="Explain why this is or isn't the best answer."
                          className="w-full border border-zinc-400 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm text-gray-600"
                        />
                        <div className="absolute right-2 top-2 text-xs text-gray-500">
                          {600 - answer.explanation.length}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeAnswer(index)}
                      className={`text-gray-500 hover:text-red-600 ml-10 mt-2 cursor-pointer ${
                        hoveredAnswerIndex === index ? "visible" : "invisible"
                      }`}
                      aria-label="Delete answer"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-2">
          Write up to 15 possible answers and indicate which one is the best.
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Related Lecture
        </label>
        <select
          value={relatedLecture}
          onChange={(e) => setRelatedLecture(e.target.value)}
          className="w-full border border-zinc-400 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">-- Select One --</option>
          {/* Lecture options would be populated here */}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          Select a related video lecture to help students answer this question.
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save
        </button>
      </div>

      <style jsx>{`
        /* Custom styling for Quill without toolbar */
        :global(.no-toolbar-editor .ql-container) {
          border: none;
        }

        :global(.no-toolbar-editor .ql-toolbar) {
          display: none;
        }

        :global(.no-toolbar-editor .ql-editor) {
          padding: 0;
          min-height: 40px;
        }
      `}</style>
    </div>
  );
};

export default QuestionForm;

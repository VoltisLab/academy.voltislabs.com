"use client";
import React, { useEffect, useRef, useState } from "react";
import { BoldIcon, Italic, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import RichTextEditor from "../../RichTextEditor";
import { useQuizOperations } from "@/services/quizService";
import toast from "react-hot-toast";

interface QuizFormProps {
  sectionId: string;
  onAddQuiz?: (
    sectionId: string,
    title: string,
    description: string
  ) => Promise<void>;
  onEditQuiz?: (
    sectionId: string,
    quizId: number,
    title: string,
    description: string
  ) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  initialTitle?: string;
  initialDescription?: string;
  quizId?: number;
  loading?: boolean;
  setShowEditQuizForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizForm: React.FC<QuizFormProps> = ({
  sectionId,
  onAddQuiz,
  onEditQuiz,
  onCancel,
  isEdit = false,
  initialTitle = "",
  initialDescription = "",
  quizId,
  loading,
  setShowEditQuizForm,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [description, setDescription] = useState<string>(initialDescription);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    createQuiz,
    updateQuiz,
    loading: quizOperationLoading,
  } = useQuizOperations();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  // Update form when initial values change (for edit mode)
  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const toggleFormat = (type: "bold" | "italic") => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format(type, !format[type]);
      } else {
        const currentFormat = quill.getFormat();
        quill.format(type, !currentFormat[type]);
      }

      if (type === "bold") {
        setIsBold((prev) => !prev);
      } else if (type === "italic") {
        setIsItalic((prev) => !prev);
      }
    }
  };

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [quizEditLoading, setQuizEditLoading] = useState(false);

  const handleSubmit = async () => {
    setQuizEditLoading(true);
    if (title.trim()) {
      try {
        if (isEdit && onEditQuiz && quizId) {
          await onEditQuiz(sectionId, quizId, title.trim(), description.trim());
        } else if (!isEdit && onAddQuiz) {
          console.log(
            "Adding quiz",
            sectionId,
            title.trim(),
            description.trim()
          );
          await onAddQuiz(sectionId, title.trim(), description.trim());
        }
        setQuizEditLoading(false);

        isEdit && toast.success(isEdit ? "Quiz updated" : "Quiz created");
        if (setShowEditQuizForm) setShowEditQuizForm(false);
      } catch (error) {
        toast.error("Operation failed");
        console.error(error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim()) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">
          {isEdit ? "Edit Quiz:" : "New Quiz:"}
        </h3>
        <button
          onClick={onCancel}
          className="text-zinc-400 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a Title"
            className="w-full border border-zinc-400 rounded focus:border-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
            maxLength={80}
            autoFocus={!isEdit} // Only autofocus for new quizzes
          />
          <div className="text-right text-sm text-zinc-400 absolute top-1/2 right-3 -translate-y-1/2">
            {80 - title.length}
          </div>
        </div>
        {/* Description */}
        <RichTextEditor
          value={description}
          onChange={setDescription}
          type="description"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !title.trim() || quizOperationLoading || loading || quizEditLoading
          }
          className={`px-4 py-2 ${
            !title.trim()
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-indigo-700"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:cursor-not-allowed disabled:bg-purple-300`}
        >
          {loading || quizEditLoading
            ? isEdit
              ? "Saving.."
              : "Adding.."
            : isEdit
            ? "Save Quiz"
            : "Add Quiz"}
        </button>
      </div>
    </div>
  );
};

export default QuizForm;

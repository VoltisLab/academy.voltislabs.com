"use client";
import React, { useEffect, useRef, useState } from "react";
import { BoldIcon, Italic, X } from "lucide-react";
import ReactQuill from "react-quill-new";
// import type { ReactQuillProps } from "react-quill";

interface QuizFormProps {
  sectionId: string;
  onAddQuiz: (sectionId: string, title: string, description: string) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({
  sectionId,
  onAddQuiz,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // const editorRef = useRef<HTMLTextAreaElement>(null);

  const toggleBold = () => setIsBold((prev) => !prev);
  const toggleItalic = () => setIsItalic((prev) => !prev);

  // const fontWeight = isBold ? "font-medium" : "font-normal";
  // const fontStyle = isItalic ? "italic" : "not-italic";
  const wrapperRing = isFocused ? "ring-1 ring-indigo-500" : "ring-0";
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const quillRef = useRef<ReactQuill | null>(null);
  const [value, setValue] = useState("");

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

  const handleAddQuiz = () => {
    if (title.trim()) {
      onAddQuiz(sectionId, title.trim(), description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title.trim()) {
      e.preventDefault();
      handleAddQuiz();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">New Quiz:</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a Title"
            className="w-full border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            maxLength={80}
            autoFocus
          />
          <div className="text-right text-sm text-gray-500 absolute top-1/2 right-3 -translate-y-1/2">
            {80 - title.length || 0}
          </div>
        </div>

        {/* Description */}
        <div
          ref={wrapperRef}
          className={`mt-4 overflow-hidden border divide-y divide-gray-500 border-gray-500 rounded ${wrapperRing}`}
        >
          <div className="font-bold w-full h-10 flex">
            <p
              onClick={() => toggleFormat("bold")}
              className={`h-full px-3 transition flex items-center cursor-pointer  ${
                isBold
                  ? "bg-black text-white rounded-l"
                  : "hover:bg-zinc-300 rounded"
              }`}
            >
              <BoldIcon size={16} />
            </p>
            <p
              onClick={() => toggleFormat("italic")}
              className={`h-full px-3 transition flex items-center cursor-pointer ${
                isItalic
                  ? "bg-black text-white rounded-r"
                  : "hover:bg-zinc-300 rounded"
              }`}
            >
              <Italic size={16} />
            </p>
          </div>
          {/* <textarea
            ref={editorRef}
            // contentEditable
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDownText}
            placeholder="Quiz Description"
            className="w-full px-3 py-2 min-h-[6rem] focus:outline-none"
            style={{ whiteSpace: "pre-wrap" }}
          /> */}
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={setValue}
            className="my-quill"
            placeholder="Quiz Description"
            modules={{ toolbar: false }} // disables default toolbar
          />
        </div>
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
          onClick={handleAddQuiz}
          disabled={!title.trim()}
          className={`px-4 py-2 ${
            !title.trim()
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          Add Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizForm;

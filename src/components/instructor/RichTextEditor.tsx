"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import {
  BoldIcon,
  Italic,
  Code2Icon,
  ImageIcon,
  Image,
  Code,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import ImageUploadModal from "../modals/ImageUploadModal";
// import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  type: "description" | "question" | "answer";
  onImageClick?: () => void;
  isFocusedAnswerId?: Boolean | null;
  setFocusedAnswerIndex?: (index: number) => void;
  answerIndex?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  type,
  isFocusedAnswerId,
  setFocusedAnswerIndex,
  answerIndex,
}) => {
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    code: false,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      insertImage(reader.result as string);
      setShowImageModal(false);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop,
  });

  const insertImage = (imageUrl: string) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertEmbed(range?.index || 0, "image", imageUrl);
    quill.setSelection((range?.index || 0) + 1);
  };

  const closeModal = () => setShowImageModal(false);

  const MAX_LENGTH = 600;
  useEffect(() => {
    if (type !== "answer") return;
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const handleTextChange = (delta: any, oldDelta: any, source: any) => {
      const currentLength = quill.root.innerHTML.length;

      if (currentLength > MAX_LENGTH) {
        // Calculate overflow length and remove excess
        const excess = currentLength - MAX_LENGTH;
        const currentPos = quill.getLength(); // includes invisible newline
        quill.deleteText(currentPos - excess - 1, excess); // subtract 1 for newline
      }
    };

    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [type]);

  const toggleFormat = (formatType: "bold" | "italic" | "code") => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    let isActive = false;

    if (selection) {
      const format = quill.getFormat(selection);
      isActive = !!format[formatType];
      quill.format(formatType, !isActive);
    } else {
      const current = quill.getFormat();
      isActive = !!current[formatType];
      quill.format(formatType, !isActive);
    }

    // Immediately reflect new active state on button
    setFormats((prev) => ({
      ...prev,
      [formatType]: !isActive,
    }));
  };

  // Watch for selection changes to update format state
  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const updateFormatState = () => {
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        setFormats({
          bold: !!format.bold,
          italic: !!format.italic,
          code: !!format.code,
        });
      }
    };

    quill.on("selection-change", updateFormatState);
    quill.on("text-change", updateFormatState);

    return () => {
      quill.off("selection-change", updateFormatState);
      quill.off("text-change", updateFormatState);
    };
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as Node)
  //     ) {
  //       setIsFocused(false);
  //     } else {
  //       setIsFocused(true);
  //       // if (type === "answer") setFocusedAnswerIndex?.(answerIndex as number);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const wrapperRing = isFocused
    ? "border border-transparent ring-1 ring-purple-600"
    : "border-zinc-400 border";

  const getPlaceholder = () => {
    switch (type) {
      case "description":
        return "Quiz Description";
      case "question":
        return "";
      case "answer":
        return "Add an answer";
      default:
        return "";
    }
  };

  const showCode = type === "question" || type === "answer";
  const showImage = type === "question";
  const showTextLimit = type === "answer";

  return (
    <div
      ref={wrapperRef}
      onFocus={() => {
        type === "answer" && setFocusedAnswerIndex?.(answerIndex!);
        setIsFocused(true);
      }}
      onBlur={() => setIsFocused(false)}
      className={`overflow-hidden rounded ${wrapperRing} divide-y divide-zinc-400`}
    >
      {!(type === "answer" && !isFocusedAnswerId) && (
        <div className="font-bold w-full h-10 flex pr-2 items-center">
          <p
            onClick={() => toggleFormat("bold")}
            className={`h-full px-3 transition flex items-center cursor-pointer ${
              formats.bold
                ? "bg-black text-white rounded-l"
                : "hover:bg-zinc-200 rounded"
            }`}
          >
            <BoldIcon size={14} />
          </p>
          <p
            onClick={() => toggleFormat("italic")}
            className={`h-full px-3 transition flex items-center cursor-pointer ${
              formats.italic
                ? "bg-black text-white rounded-r"
                : "hover:bg-zinc-200 rounded"
            }`}
          >
            <Italic size={14} />
          </p>
          {showImage && (
            <p
              // onClick={onImageClick}
              onClick={() => setShowImageModal(true)}
              className={`h-full px-3 transition flex items-center cursor-pointer hover:bg-zinc-200 rounded`}
            >
              <Image size={14} />
            </p>
          )}
          {showCode && (
            <p
              onClick={() => toggleFormat("code")}
              className={`h-full px-3 transition flex items-center cursor-pointer rounded hover:bg-zinc-200`}
            >
              <Code size={14} />
            </p>
          )}
          {showTextLimit && (
            <p className="ml-auto font-normal text-xs text-zinc-500">
              {MAX_LENGTH - value.length}
            </p>
          )}
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        value={value}
        theme="snow"
        onChange={onChange}
        className="my-quill no-border w-[100%]"
        placeholder={getPlaceholder()}
        modules={{ toolbar: false }}
      />

      {/* Image Upload Modal */}
      {showImageModal && (
        <ImageUploadModal closeModal={closeModal} onDrop={onDrop} />
      )}
    </div>
  );
};

export default RichTextEditor;

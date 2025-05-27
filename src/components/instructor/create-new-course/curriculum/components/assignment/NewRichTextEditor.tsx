"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import {
  BoldIcon,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Code,
  ChevronDown,
} from "lucide-react";
import ImageUploadModal from "@/components/modals/ImageUploadModal";
import LinkInsertModal from "@/components/modals/LinkInsertModalComponent";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  type?: "description" | "question" | "answer" | "instruction";
  onImageClick?: () => void;
  isFocusedAnswerId?: boolean | null;
  setFocusedAnswerIndex?: (index: number) => void;
  answerIndex?: number;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

type TextStyle = "normal" | "quote" | "heading";
const textStyles = [
  { value: "normal", label: "Styles" },
  { value: "quote", label: "Quote" },
  { value: "heading", label: "Heading 4" },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  type = "instruction",
  isFocusedAnswerId,
  setFocusedAnswerIndex,
  answerIndex,
  placeholder = "",
}) => {
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    code: false,
    list: false,
    ordered: false,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentTextStyle, setCurrentTextStyle] = useState<TextStyle>("normal");

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

  const insertImage = (imageUrl: string) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertEmbed(range?.index || 0, "image", imageUrl);
    quill.setSelection((range?.index || 0) + 1);
  };

  const closeModal = () => setShowImageModal(false);

  const handleInsertLink = (url: string, text: string) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range) {
      // If text is selected, use that as the link text
      const selectedText = quill.getText(range.index, range.length);
      const linkText = selectedText || text;

      // Remove any existing link format first
      quill.format("link", false);

      if (range.length > 0) {
        // Apply link to selected text
        quill.format("link", url);
      } else {
        // Insert new linked text
        quill.insertText(range.index, linkText, "link", url);
        quill.setSelection(range.index + linkText.length, 0);
      }

      // Force update to ensure ReactQuill re-renders
      onChange(quill.root.innerHTML);
    }
  };

  const toggleHtmlEditor = () => {
    if (showHtmlEditor) {
      onChange(htmlContent);
    } else {
      setHtmlContent(value);
    }
    setShowHtmlEditor(!showHtmlEditor);
  };

  const toggleFormat = (
    formatType: "bold" | "italic" | "code" | "list" | "ordered"
  ) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();

    if (selection) {
      const format = quill.getFormat(selection);

      if (formatType === "list" || formatType === "ordered") {
        // Get current list format
        const currentListFormat = format.list;

        // Determine what to apply
        let newFormat;
        if (formatType === "list") {
          newFormat = currentListFormat === "bullet" ? false : "bullet";
        } else {
          newFormat = currentListFormat === "ordered" ? false : "ordered";
        }

        // Apply the format
        quill.format("list", newFormat);

        // Update state
        setFormats((prev) => ({
          ...prev,
          list: newFormat === "bullet",
          ordered: newFormat === "ordered",
        }));
      } else {
        // Handle other formats (bold, italic, code)
        const isActive = !!format[formatType];
        quill.format(formatType, !isActive);
        setFormats((prev) => ({ ...prev, [formatType]: !isActive }));
      }
    }
  };

  const applyTextStyle = (style: TextStyle) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();

    if (range) {
      // Remove all existing styles first
      quill.format("blockquote", false);
      quill.format("header", false);

      // Apply new style
      switch (style) {
        case "quote":
          quill.format("blockquote", true);
          break;
        case "heading":
          quill.format("header", 2); // H2 size
          break;
        case "normal":
        default:
          // Already removed formats
          break;
      }
    }
  };

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
          list: format.list === "bullet",
          ordered: format.list === "ordered",
        });

        // Update text style
        if (format.blockquote) {
          setCurrentTextStyle("quote");
        } else if (format.header) {
          setCurrentTextStyle("heading");
        } else {
          setCurrentTextStyle("normal");
        }
      }
    };

    quill.on("selection-change", updateFormatState);
    quill.on("text-change", updateFormatState);

    return () => {
      quill.off("selection-change", updateFormatState);
      quill.off("text-change", updateFormatState);
    };
  }, []);

  const wrapperRing = isFocused
    ? "border border-transparent ring-1 ring-purple-600"
    : "border-zinc-400 border";

  const showCode = type === "question" || type === "answer";
  const showImage = type === "question" || type === "instruction";
  const showTextLimit = type === "answer";
  const showLists = type === "instruction";

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
          <select
            value={currentTextStyle}
            onChange={(e) => {
              const style = e.target.value as TextStyle;
              setCurrentTextStyle(style);
              applyTextStyle(style);
            }}
            className="h-full font-normal hover:bg-zinc-200 px-2 text-sm  focus:outline-none cursor-pointer"
          >
            {textStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => toggleFormat("bold")}
            className={`h-full px-3 transition flex items-center cursor-pointer ${
              formats.bold
                ? "bg-black text-white rounded-l"
                : "hover:bg-zinc-200 rounded"
            }`}
            title="Bold"
          >
            <BoldIcon size={14} />
          </button>
          <button
            onClick={() => toggleFormat("italic")}
            className={`h-full px-3 transition flex items-center cursor-pointer ${
              formats.italic ? "bg-black text-white" : "hover:bg-zinc-200"
            }`}
            title="Italic"
          >
            <Italic size={14} />
          </button>

          {showLists && (
            <>
              <button
                onClick={() => toggleFormat("list")}
                className={`h-full px-3 transition flex items-center cursor-pointer ${
                  formats.list ? "bg-black text-white" : "hover:bg-zinc-200"
                }`}
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => toggleFormat("ordered")}
                className={`h-full px-3 transition flex items-center cursor-pointer ${
                  formats.ordered ? "bg-black text-white" : "hover:bg-zinc-200"
                }`}
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>
            </>
          )}

          {showLists && (
            <button
              onClick={() => setShowLinkModal(true)}
              className={`h-full px-3 transition flex items-center cursor-pointer hover:bg-zinc-200 rounded`}
              title="Insert Link"
            >
              <Link size={14} />
            </button>
          )}

          {showImage && (
            <button
              onClick={() => setShowImageModal(true)}
              className={`h-full px-3 transition flex items-center cursor-pointer hover:bg-zinc-200 rounded`}
              title="Insert Image"
            >
              <ImageIcon size={14} />
            </button>
          )}
          {/* {showCode && ( */}
          <button
            onClick={() => toggleFormat("code")}
            className={`h-full px-3 transition flex items-center cursor-pointer ${
              formats.code ? "bg-black text-white" : "hover:bg-zinc-200"
            }`}
            title="Code"
          >
            <Code size={14} />
          </button>
          {/* )} */}

          {showLists && (
            <button
              onClick={toggleHtmlEditor}
              className="text-blue-600 text-sm ml-auto px-2 cursor-pointer flex items-center"
              title="HTML Editor"
            >
              Edit HTML
            </button>
          )}

          {showTextLimit && (
            <span className="ml-auto font-normal text-xs text-zinc-500">
              {600 - (value?.length || 0)}
            </span>
          )}
        </div>
      )}

      {showLinkModal && (
        <LinkInsertModal
          closeModal={() => setShowLinkModal(false)}
          onInsert={handleInsertLink}
        />
      )}

      {showHtmlEditor ? (
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="w-full p-3 min-h-[150px] font-mono text-sm border-t border-gray-200"
          placeholder="Edit HTML content..."
        />
      ) : (
        <ReactQuill
          ref={quillRef}
          value={value}
          theme="snow"
          onChange={onChange}
          className="my-quill no-border w-[100%]"
          placeholder={placeholder}
          modules={{
            toolbar: false,
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      )}

      {showImageModal && (
        <ImageUploadModal closeModal={closeModal} onDrop={onDrop} />
      )}
    </div>
  );
};

export default RichTextEditor;

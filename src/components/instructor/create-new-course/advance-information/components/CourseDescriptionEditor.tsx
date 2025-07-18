"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface CourseDescriptionEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({
  value,
  onChange,
}: CourseDescriptionEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="editor-container">
      <label className="block font-medium text-gray-800 mb-1">
        Lecture Description
      </label>
      <div
        className={`tiptap-wrapper ${isFocused ? "focused" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <EditorContent
          editor={editor}
          className="lecture-editor [&_[contenteditable=true]]:outline-none [&_[contenteditable=true]]:focus:outline-none"
        />
      </div>

      <style jsx>{`
        /* Container styling */
        .editor-container {
          display: flex;
          flex-direction: column;
        }
        /* Editor styling */
        .tiptap-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          overflow: hidden;
          padding: 12px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        /* Focus state - purple border */
        .tiptap-wrapper.focused {
          padding: 12px;
          border-color: black;
          box-shadow: 0 0 0 1px black;
        }
        /* Hover state */
        .tiptap-wrapper:hover {
          border-color: black;
        }
        /* Remove excess spacing */
        .lecture-editor {
          margin-bottom: 8px;
        }

        .lecture-editor [contenteditable="true"] {
          outline: none;
          box-shadow: none;
          border-color: transparent;
        }
        /* Editor content area */
        .lecture-editor .ProseMirror {
          min-height: 100px;
          max-height: 200px;
          padding: 12px;
          outline: none;
        } /* Placeholder styling */
        .lecture-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: "Add a description. Include what students will be able to do
        after completing the lecture.";
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

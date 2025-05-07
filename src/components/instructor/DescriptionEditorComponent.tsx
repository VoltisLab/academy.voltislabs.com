"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Import ReactQuill styles
import 'react-quill-new/dist/quill.snow.css';

// Custom styles to override default Quill styles
const customStyles = `
  .ql-toolbar.ql-snow {
    border: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding: 4px 8px;
  }

  .ql-container.ql-snow {
    border: 1px solid #E5E7EB;
    border-top: none;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s ease-in-out;
  }

  .ql-container.ql-snow:focus-within {
    outline-offset: -2px;
    border-radius: 0.5rem;
  }

  .ql-editor {
    min-height: 70px;
    color: #666;
    padding: 10px;
  }

  .ql-editor.ql-blank::before {
    color: #666;
    font-style: normal;
    font-size: 0.875rem;
    font-weight: bold;
  }

  /* Hide all toolbar items except Bold, Italic, and lists */
  .ql-toolbar.ql-snow .ql-formats:not(:nth-child(1)):not(:nth-child(2)) {
    display: none;
  }

  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 4px;
  }

  .ql-toolbar.ql-snow button {
    width: 28px;
    height: 28px;
  }
`;

const quillModules = {
  toolbar: [
    ['bold', 'italic'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }]
  ],
  clipboard: {
    matchVisual: false
  }
};

const quillFormats = [
  'bold', 'italic',
  'list', 'bullet'
];

interface DescriptionEditorComponentProps {
  activeDescriptionSection: { sectionId: string, lectureId: string } | null;
  onClose: () => void;
  currentDescription: string;
  setCurrentDescription: (description: string) => void;
  saveDescription: () => void;
}

export default function DescriptionEditorComponent({
  activeDescriptionSection,
  onClose,
  currentDescription,
  setCurrentDescription,
  saveDescription
}: DescriptionEditorComponentProps) {
  if (!activeDescriptionSection) return null;

  return (
    <div className="w-full border-t border-gray-400 overflow-hidden bg-white">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="px-4 py-2">
        <h3 className="text-sm font-medium text-gray-700">Lecture Description</h3>
      </div>

      <div className="px-4">
        <div className="focus-within:outline focus-within:outline-2 focus-within:outline-[#6D28D2] rounded-lg">
          <ReactQuill
            value={currentDescription}
            onChange={(value) => setCurrentDescription(value)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
            placeholder="Add a description. Include what students will be able to do after completing the lecture."
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 px-4 py-3 mt-4 border-t border-gray-200 bg-white">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={saveDescription}
          className="px-4 py-1.5 bg-[#6D28D2] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#6D28D2]"
        >
          Save
        </button>
      </div>
    </div>
  );
}

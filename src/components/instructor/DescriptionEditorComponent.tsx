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
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    padding: 8px;

  }
  
  .ql-container.ql-snow {
    border: 1px solid #E5E7EB;
    border-top: none;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    font-size: 0.875rem;
    min-height: 120px;
  }
  
  .ql-editor {
    min-height: 120px;
    color: #6B7280;
  }

  .ql-editor.ql-blank::before {
    color: #9CA3AF;
    font-style: normal;
    font-size: 0.875rem;
  }
  
  /* Hide all toolbar items except Bold, Italic, and lists */
  .ql-toolbar.ql-snow .ql-formats:not(:nth-child(1)):not(:nth-child(2)) {
    display: none;
  }
  
  /* Match the button spacing to the image */
  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 8px;
  }
  
  /* Add subtle button styling to match the image */
  .ql-toolbar.ql-snow button {
    width: 28px;
    height: 28px;
  }
  
  /* Match the border color and weight */
  .ql-toolbar.ql-snow, .ql-container.ql-snow {
    border-color: #E5E7EB;
  }
`;

// Define the toolbar modules for ReactQuill - matching exactly what's in the image
const quillModules = {
  toolbar: [
    ['bold', 'italic'],
    [{'list': 'ordered'}, {'list': 'bullet'}]
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
    <div className="w-full border-t border-gray-400 overflow-hidden">
      {/* Add the custom styles to the page */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <div className="px-4 py-2 ">
        <h3 className="text-sm font-medium text-gray-700">Lecture Description</h3>
      </div>
      
      <div className="px-4 ">
        <ReactQuill
          value={currentDescription}
          onChange={(value) => setCurrentDescription(value)}
          modules={quillModules}
          formats={quillFormats}
          theme="snow"
          placeholder="Add a description. Include what students will be able to do after completing the lecture."
        />
      </div>
      
      <div className="flex justify-end items-center gap-2 px-4 py-3 mt-16 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={saveDescription}
          className="px-4 py-1.5 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
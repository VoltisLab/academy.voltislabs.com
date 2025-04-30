"use client";

import { useState, useEffect } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface CourseDescriptionEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function CourseDescriptionEditor({ 
  value, 
  onChange 
}: CourseDescriptionEditorProps) {
  const [editorValue, setEditorValue] = useState<string>(value);

  // Update local state when props change
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    
    // Send data up to parent component
    onChange(content);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-800 mb-1">Course Descriptions</label>
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        placeholder="Enter your course descriptions"
        className="bg-white"
      />
    </div>
  );
}
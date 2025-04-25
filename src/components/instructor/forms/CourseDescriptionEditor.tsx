"use client";

import { useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function CourseDescriptionEditor() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-800 mb-1">Course Descriptions</label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Enter your course descriptions"
        className="bg-white"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, Menu, ChevronDown } from "lucide-react";

const CONTENT_OPTIONS = ["Video", "Attach File", "Captions", "Description", "Lecture Notes"];

export default function CourseSectionsBuilder() {
  const [sections, setSections] = useState([
    { name: "Section name", lectures: ["Lecture name"] },
  ]);

  const addSection = () => {
    setSections([...sections, { name: "Section name", lectures: ["Lecture name"] }]);
  };

  const addLecture = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectures.push("Lecture name");
    setSections(updated);
  };

  const deleteSection = (sectionIndex: number) => {
    setSections(sections.filter((_, i) => i !== sectionIndex));
  };

  const deleteLecture = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectures = updated[sectionIndex].lectures.filter((_, i) => i !== lectureIndex);
    setSections(updated);
  };

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white rounded-md border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Menu className="w-4 h-4 text-gray-400" />
              <span>Section 0{sectionIndex + 1}:</span>
              <span className="text-gray-900">{section.name}</span>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => addLecture(sectionIndex)}><Plus className="w-4 h-4 text-gray-500" /></button>
              <button><Edit3 className="w-4 h-4 text-gray-500" /></button>
              <button onClick={() => deleteSection(sectionIndex)}><Trash2 className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>

          {/* Lectures */}
          {section.lectures.map((lecture, lectureIndex) => (
            <div key={lectureIndex} className="flex items-center justify-between bg-gray-50 border rounded-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Menu className="w-4 h-4 text-gray-400" />
                <span>{lecture}</span>
              </div>
              <div className="flex gap-2 items-center">
                <button className="bg-[#D9D6FB] text-[#2E2C6F] px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1">
                  Contents <ChevronDown className="w-4 h-4" />
                </button>
                <Edit3 className="w-4 h-4 text-gray-500" />
                <Trash2
                  className="w-4 h-4 text-gray-500 cursor-pointer"
                  onClick={() => deleteLecture(sectionIndex, lectureIndex)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={addSection}
        className="w-full bg-[#D9D6FB] text-[#2E2C6F] text-sm font-semibold py-2 rounded-md text-center"
      >
        Add Sections
      </button>
    </div>
  );
}

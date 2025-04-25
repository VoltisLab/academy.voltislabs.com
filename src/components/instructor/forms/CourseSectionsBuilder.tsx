"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Edit3, Menu, ChevronDown, Check } from "lucide-react";
import UploadModal from "../modals/VideoUploadModal";

const CONTENT_OPTIONS = [
  "Video",
  "Attach File",
  "Captions",
  "Description",
  "Lecture Notes",
];

export default function CourseSectionsBuilder() {
  const [sections, setSections] = useState([
    {
      name: "Section name",
      lectures: ["Lecture name"],
      editing: false,
      lectureEditing: [false],
    },
  ]);

  const sectionRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lectureRefs = useRef<(HTMLInputElement | null)[][]>([]);
  const [openContent, setOpenContent] = useState<{
    section: number;
    lecture: number;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<
    "video" | "caption" | "notes" | "description" | "attach"
  >("video");
  const [title, setTitle] = useState("Lecture Video");

  const handleOpen = (newType: typeof type, newTitle: string) => {
    setType(newType);
    setTitle(newTitle);
    setOpen(true);
  };
  const contentDropdownRef = useRef<HTMLDivElement | null>(null);
  
useEffect(() => {
  if (
    typeof document === "undefined" || // <- ADD THIS GUARD
    !openContent
  ) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (
      contentDropdownRef.current &&
      !contentDropdownRef.current.contains(e.target as Node)
    ) {
      setOpenContent(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [openContent]);



  useEffect(() => {
    sections.forEach((section, sIndex) => {
      if (section.editing && sectionRefs.current[sIndex]) {
        sectionRefs.current[sIndex]?.focus();
      }
      section.lectureEditing.forEach((isEditing, lIndex) => {
        if (isEditing && lectureRefs.current[sIndex]?.[lIndex]) {
          lectureRefs.current[sIndex][lIndex]?.focus();
        }
      });
    });
  }, [sections]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        name: "Section name",
        lectures: ["Lecture name"],
        editing: false,
        lectureEditing: [false],
      },
    ]);
  };

  const addLecture = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectures.push("Lecture name");
    updated[sectionIndex].lectureEditing.push(false);
    setSections(updated);
  };

  const deleteSection = (sectionIndex: number) => {
    setSections(sections.filter((_, i) => i !== sectionIndex));
  };

  const deleteLecture = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectures.splice(lectureIndex, 1);
    updated[sectionIndex].lectureEditing.splice(lectureIndex, 1);
    setSections(updated);
  };

  const updateSectionName = (sectionIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].name = value;
    setSections(updated);
  };

  const updateLectureName = (
    sectionIndex: number,
    lectureIndex: number,
    value: string
  ) => {
    const updated = [...sections];
    updated[sectionIndex].lectures[lectureIndex] = value;
    setSections(updated);
  };

  const toggleSectionEdit = (index: number) => {
    const updated = [...sections];
    updated[index].editing = !updated[index].editing;
    setSections(updated);
  };

  const toggleLectureEdit = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectureEditing[lectureIndex] =
      !updated[sectionIndex].lectureEditing[lectureIndex];
    setSections(updated);
  };

  const blurSection = (index: number) => {
    const updated = [...sections];
    updated[index].editing = false;
    setSections(updated);
  };

  const blurLecture = (sectionIndex: number, lectureIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lectureEditing[lectureIndex] = false;
    setSections(updated);
  };

  const toggleContentDropdown = (section: number, lecture: number) => {
    if (openContent?.section === section && openContent?.lecture === lecture) {
      setOpenContent(null);
    } else {
      setOpenContent({ section, lecture });
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="bg-white rounded-md border border-gray-200 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Menu className="w-4 h-4 text-gray-400" />
              <span>Section 0{sectionIndex + 1}:</span>
              {section.editing ? (
                <input
                  ref={(el:any) => (sectionRefs.current[sectionIndex] = el)}
                  type="text"
                  value={section.name}
                  onChange={(e) =>
                    updateSectionName(sectionIndex, e.target.value)
                  }
                  onBlur={() => blurSection(sectionIndex)}
                  className="text-gray-900 focus:outline-none bg-transparent px-1 ring-2 ring-indigo-300 rounded w-64"
                />
              ) : (
                <span
                  className="text-gray-900 cursor-pointer"
                  onClick={() => toggleSectionEdit(sectionIndex)}
                >
                  {section.name}
                </span>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => addLecture(sectionIndex)}>
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
              <button onClick={() => toggleSectionEdit(sectionIndex)}>
                {section.editing ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Edit3 className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <button onClick={() => deleteSection(sectionIndex)}>
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Lectures */}
          {section.lectures.map((lecture, lectureIndex) => (
            <div
              key={lectureIndex}
              className="flex items-center justify-between bg-gray-50 border rounded-md px-4 py-3"
            >
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Menu className="w-4 h-4 text-gray-400" />
                {section.lectureEditing[lectureIndex] ? (
                  <input
                    ref={(el) => {
                      if (!lectureRefs.current[sectionIndex])
                        lectureRefs.current[sectionIndex] = [];
                      lectureRefs.current[sectionIndex][lectureIndex] = el;
                    }}
                    type="text"
                    value={lecture}
                    onChange={(e) =>
                      updateLectureName(
                        sectionIndex,
                        lectureIndex,
                        e.target.value
                      )
                    }
                    onBlur={() => blurLecture(sectionIndex, lectureIndex)}
                    className="text-gray-800 focus:outline-none bg-transparent px-1 ring-2 ring-indigo-300 rounded w-64"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      toggleLectureEdit(sectionIndex, lectureIndex)
                    }
                  >
                    {lecture}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center relative">
                <button
                  onClick={() =>
                    toggleContentDropdown(sectionIndex, lectureIndex)
                  }
                  className="bg-[#D9D6FB] text-[#2E2C6F] px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  Contents <ChevronDown className="w-4 h-4" />
                </button>
                {openContent?.section === sectionIndex &&
                  openContent?.lecture === lectureIndex && (
                    <div
                      ref={contentDropdownRef}
                      className="absolute top-full mt-5 right-0 bg-white border shadow rounded-md py-2 z-50 w-48"
                    >
                      {CONTENT_OPTIONS.map((option) => (
                        <div
                          onClick={() => {
                            handleOpen(
                              option.toLowerCase() as
                                | "video"
                                | "caption"
                                | "notes"
                                | "description"
                                | "attach",
                              option
                            );
                            setOpenContent(null);
                          }}
                          key={option}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                <button
                  onClick={() => toggleLectureEdit(sectionIndex, lectureIndex)}
                >
                  {section.lectureEditing[lectureIndex] ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <Trash2
                  className="w-4 h-4 text-gray-500 cursor-pointer"
                  onClick={() => deleteLecture(sectionIndex, lectureIndex)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
      {open && (
        <UploadModal type={type} title={title} onClose={() => setOpen(false)} />
      )}{" "}
      <button
        onClick={addSection}
        className="w-full bg-[#D9D6FB] text-[#2E2C6F] text-sm font-semibold py-2 rounded-md text-center"
      >
        Add Sections
      </button>
    </div>
  );
}

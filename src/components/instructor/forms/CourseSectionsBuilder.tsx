"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { Plus, Trash2, Edit3, Menu, ChevronDown, Check, Upload, FileText, Video, Type, BookOpen} from "lucide-react";
import { toast } from "react-hot-toast";
import { 
  AttachedFile, 
  CourseSectionInput, 
  Video as VideoType 
} from "@/lib/types";
import { CONTENT_OPTIONS } from "@/lib/utils";
import { uploadFile } from "@/services/fileUploadService";
import { useCourseSectionsUpdate } from "@/services/courseSectionsService";

// Define component props and state types
interface BasicInformationFormProps {
  onSaveNext?: () => void;
  courseId: string | number;
}

interface Lecture {
  name: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: { url: string; name: string }[];
  videos: { url: string; name: string }[];
}

interface Section {
  name: string;
  lectures: Lecture[];
  editing: boolean;
  lectureEditing: boolean[];
}

interface ContentDropdownState {
  section: number;
  lecture: number;
}

interface ModalConfig {
  type: string;
  title: string;
  sectionIndex: number;
  lectureIndex: number;
}

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModalConfig;
}

interface ContentStatus {
  video: boolean;
  file: boolean;
  captions: boolean;
  description: boolean;
  notes: boolean;
}

interface ContentSummaryProps {
  lecture: Lecture;
  sectionIndex: number;
  lectureIndex: number;
}

export interface AttachedFileInput {
  url: string;
}

export interface VideoInput {
  url: string;
}

export interface AttachedFilesInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  attachedFile: AttachedFileInput[];
}

export interface VideoUrlsInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  videos: VideoInput[];
}

export interface LectureInput {
  name: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: AttachedFilesInput;
  videoUrls: VideoUrlsInput;
}

export interface CourseSectionType {
  sectionName: string;
  lectures: LectureInput[];
}

export default function CourseSectionsBuilder({ onSaveNext, courseId }: BasicInformationFormProps) {
  // Initialize sections state with a default section and lecture
  const [sections, setSections] = useState<Section[]>([
    {
      name: "Section name",
      lectures: [
        {
          name: "Lecture name",
          description: "",
          captions: "",
          lectureNotes: "",
          attachedFiles: [],
          videos: []
        }
      ],
      editing: false,
      lectureEditing: [false],
    },
  ]);
  
  // Refs for section and lecture inputs
  const sectionRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lectureRefs = useRef<(HTMLInputElement | null)[][]>([]);
  
  // States for content dropdown and upload modal
  const [openContent, setOpenContent] = useState<ContentDropdownState | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    type: "video",
    title: "Lecture Video",
    sectionIndex: 0,
    lectureIndex: 0
  });
  
  // State for tracking uploads
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Get course update service
  const { updateCourseSections, loading: mutationLoading, error: mutationError } = useCourseSectionsUpdate();
  
  const contentDropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Handle clicks outside content dropdown
  useEffect(() => {
    if (typeof document === "undefined" || !openContent) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentDropdownRef.current &&
        e.target instanceof Node &&
        !contentDropdownRef.current.contains(e.target)
      ) {
        setOpenContent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => document.removeEventListener("mousedown", handleClickOutside as any);
  }, [openContent]);

  // Focus inputs when editing
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

  // Add a new section
  const addSection = (): void => {
    setSections([
      ...sections,
      {
        name: "Section name",
        lectures: [
          {
            name: "Lecture name",
            description: "",
            captions: "",
            lectureNotes: "",
            attachedFiles: [],
            videos: []
          }
        ],
        editing: false,
        lectureEditing: [false],
      },
    ]);
  };

  // Add a new lecture to a section
  const addLecture = (sectionIndex: number): void => {
    const updated = [...sections];
    updated[sectionIndex].lectures.push({
      name: "Lecture name",
      description: "",
      captions: "",
      lectureNotes: "",
      attachedFiles: [],
      videos: []
    });
    updated[sectionIndex].lectureEditing.push(false);
    setSections(updated);
  };

  // Delete a section
  const deleteSection = (sectionIndex: number): void => {
    setSections(sections.filter((_, i) => i !== sectionIndex));
  };

  // Delete a lecture
  const deleteLecture = (sectionIndex: number, lectureIndex: number): void => {
    const updated = [...sections];
    updated[sectionIndex].lectures.splice(lectureIndex, 1);
    updated[sectionIndex].lectureEditing.splice(lectureIndex, 1);
    setSections(updated);
  };

  // Update section name
  const updateSectionName = (sectionIndex: number, value: string): void => {
    const updated = [...sections];
    updated[sectionIndex].name = value;
    setSections(updated);
  };

  // Update lecture name
  const updateLectureName = (sectionIndex: number, lectureIndex: number, value: string): void => {
    const updated = [...sections];
    updated[sectionIndex].lectures[lectureIndex].name = value;
    setSections(updated);
  };

  // Toggle section edit mode
  const toggleSectionEdit = (index: number): void => {
    const updated = [...sections];
    updated[index].editing = !updated[index].editing;
    setSections(updated);
  };

  // Toggle lecture edit mode
  const toggleLectureEdit = (sectionIndex: number, lectureIndex: number): void => {
    const updated = [...sections];
    updated[sectionIndex].lectureEditing[lectureIndex] =
      !updated[sectionIndex].lectureEditing[lectureIndex];
    setSections(updated);
  };

  // Exit section edit mode
  const blurSection = (index: number): void => {
    const updated = [...sections];
    updated[index].editing = false;
    setSections(updated);
  };

  // Exit lecture edit mode
  const blurLecture = (sectionIndex: number, lectureIndex: number): void => {
    const updated = [...sections];
    updated[sectionIndex].lectureEditing[lectureIndex] = false;
    setSections(updated);
  };

  // Toggle content dropdown
  const toggleContentDropdown = (section: number, lecture: number): void => {
    if (openContent?.section === section && openContent?.lecture === lecture) {
      setOpenContent(null);
    } else {
      setOpenContent({ section, lecture });
    }
  };

  // Handle opening the content modal
  const handleOpenModal = (type: string, title: string, sectionIndex: number, lectureIndex: number): void => {
    setModalConfig({
      type,
      title,
      sectionIndex,
      lectureIndex
    });
    setOpenModal(true);
    setOpenContent(null);
  };

  // Handle file upload for videos
  const handleVideoUpload = async (file: File, sectionIndex: number, lectureIndex: number): Promise<void> => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'VIDEO');
      
      if (url) {
        const updated = [...sections];
        updated[sectionIndex].lectures[lectureIndex].videos.push({
          url,
          name: file.name
        });
        setSections(updated);
        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
      setOpenModal(false);
    }
  };

  // Handle file upload for attachments
  const handleFileUpload = async (file: File, sectionIndex: number, lectureIndex: number): Promise<void> => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'RESOURCE');
      
      if (url) {
        const updated = [...sections];
        updated[sectionIndex].lectures[lectureIndex].attachedFiles.push({
          url,
          name: file.name
        });
        setSections(updated);
        toast.success("File attached successfully!");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to attach file. Please try again.");
    } finally {
      setIsUploading(false);
      setOpenModal(false);
    }
  };

  // Update text content (captions, description, lecture notes)
  const updateTextContent = (sectionIndex: number, lectureIndex: number, type: string, value: string): void => {
    const updated = [...sections];
    
    if (type === 'captions') {
      updated[sectionIndex].lectures[lectureIndex].captions = value;
    } else if (type === 'description') {
      updated[sectionIndex].lectures[lectureIndex].description = value;
    } else if (type === 'lectureNotes') {
      updated[sectionIndex].lectures[lectureIndex].lectureNotes = value;
    }
    
    setSections(updated);
    setOpenModal(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
  };

  // Content status indicators
  const getContentStatus = (lecture: Lecture): ContentStatus => {
    const status: ContentStatus = {
      video: lecture.videos.length > 0,
      file: lecture.attachedFiles.length > 0,
      captions: Boolean(lecture.captions && lecture.captions.trim() !== ""),
      description: Boolean(lecture.description && lecture.description.trim() !== ""),
      notes: Boolean(lecture.lectureNotes && lecture.lectureNotes.trim() !== "")
    };
    
    return status;
  };

  // Handle form submission to save course sections
  const handleSaveCourseSections = async (e?: MouseEvent<HTMLButtonElement>): Promise<void> => {
    if (e) e.preventDefault();
    
    try {
      // Prepare course sections data according to the GraphQL schema
      const courseSections: CourseSectionType[] = sections.map(section => ({
        sectionName: section.name,
        lectures: section.lectures.map(lecture => ({
          name: lecture.name,
          description: lecture.description || "",
          captions: lecture.captions || "",
          lectureNotes: lecture.lectureNotes || "",
          attachedFiles: {
            action: "ADD",
            attachedFile: lecture.attachedFiles.map(file => ({ url: file.url }))
          },
          videoUrls: {
            action: "ADD",
            videos: lecture.videos.map(video => ({ url: video.url }))
          }
        }))
      }));
  
      const courseIdNumber = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
  
      // Call the mutation
      const result = await updateCourseSections({
        courseId: courseIdNumber,
        courseSections
      });
  
      if (result.updateCourseInfo.success) {
        toast.success("Course sections saved successfully!");
        if (onSaveNext) onSaveNext();
      } else {
        toast.error(result.updateCourseInfo.message || "Failed to save course sections");
      }
    } catch (error) {
      console.error("Error saving course sections:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  // Remove content item
  const removeContentItem = (sectionIndex: number, lectureIndex: number, contentType: string, itemIndex?: number): void => {
    const updated = [...sections];
    switch (contentType) {
      case 'video':
        if (itemIndex !== undefined) {
          updated[sectionIndex].lectures[lectureIndex].videos.splice(itemIndex, 1);
        }
        break;
      case 'file':
        if (itemIndex !== undefined) {
          updated[sectionIndex].lectures[lectureIndex].attachedFiles.splice(itemIndex, 1);
        }
        break;
      case 'captions':
        updated[sectionIndex].lectures[lectureIndex].captions = '';
        break;
      case 'description':
        updated[sectionIndex].lectures[lectureIndex].description = '';
        break;
      case 'notes':
        updated[sectionIndex].lectures[lectureIndex].lectureNotes = '';
        break;
    }
    setSections(updated);
    toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} removed`);
  };

  // Content summary component
  const ContentSummary = ({ lecture, sectionIndex, lectureIndex }: ContentSummaryProps) => {
    const status = getContentStatus(lecture);
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {status.video && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Video className="w-3 h-3" />
            <span>
              Video{lecture.videos.length > 1 ? `s (${lecture.videos.length})` : ''}
            </span>
            <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-600" 
              onClick={() => removeContentItem(sectionIndex, lectureIndex, 'video', 0)}
            />
          </div>
        )}
        {status.file && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>
              File{lecture.attachedFiles.length > 1 ? `s (${lecture.attachedFiles.length})` : ''}
            </span>
            <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-600" 
              onClick={() => removeContentItem(sectionIndex, lectureIndex, 'file', 0)}
            />
          </div>
        )}
        {status.captions && (
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Type className="w-3 h-3" />
            <span>Captions</span>
            <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-600" 
              onClick={() => removeContentItem(sectionIndex, lectureIndex, 'captions')}
            />
          </div>
        )}
        {status.description && (
          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Type className="w-3 h-3" />
            <span>Description</span>
            <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-600" 
              onClick={() => removeContentItem(sectionIndex, lectureIndex, 'description')}
            />
          </div>
        )}
        {status.notes && (
          <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Notes</span>
            <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-600" 
              onClick={() => removeContentItem(sectionIndex, lectureIndex, 'notes')}
            />
          </div>
        )}
      </div>
    );
  };

  // Modal for handling different content types
  const ContentModal = ({ isOpen, onClose, config }: ContentModalProps) => {
    if (!isOpen) return null;
    
    const { type, title, sectionIndex, lectureIndex } = config;
    const lecture = sections[sectionIndex]?.lectures[lectureIndex];
    
    if (!lecture) return null;
    
    const [textContent, setTextContent] = useState<string>(
      type === 'Lecture Notes' 
        ? lecture.lectureNotes || '' 
        : type === 'Description'
          ? lecture.description || ''
          : type === 'Captions'
            ? lecture.captions || ''
            : ''
    );
    const [file, setFile] = useState<File | null>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
    
    const handleSubmit = () => {
      if (type === 'Video' && file) {
        handleVideoUpload(file, sectionIndex, lectureIndex);
      } else if (type === 'Attach File' && file) {
        handleFileUpload(file, sectionIndex, lectureIndex);
      } else if (['Captions', 'Description', 'Lecture Notes'].includes(type)) {
        // Convert "Lecture Notes" to "lectureNotes"
        const fieldName = type === 'Lecture Notes' ? 'lectureNotes' : type.toLowerCase();
        updateTextContent(sectionIndex, lectureIndex, fieldName, textContent);
      }
    };
    
    
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          
          {(type.toLowerCase() === 'video' || type.toLowerCase() === 'attach file') && (
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : `Click to upload ${type.toLowerCase() === 'video' ? 'video' : 'file'}`}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={type.toLowerCase() === 'video' ? 'video/*' : '*/*'}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
          
          {['captions', 'description', 'lecture notes'].includes(type.toLowerCase()) && (
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder={`Enter ${type.toLowerCase()} here...`}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            ></textarea>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sections and lectures */}
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
                  ref={(el) => {
                    sectionRefs.current[sectionIndex] = el;
                  }}
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
              <button 
                onClick={() => addLecture(sectionIndex)}
                className="hover:bg-gray-100 p-1 rounded-full"
                title="Add lecture"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
              <button 
                onClick={() => toggleSectionEdit(sectionIndex)}
                className="hover:bg-gray-100 p-1 rounded-full"
                title={section.editing ? "Save" : "Edit section name"}
              >
                {section.editing ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Edit3 className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <button 
                onClick={() => deleteSection(sectionIndex)}
                className="hover:bg-gray-100 p-1 rounded-full"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Lectures */}
          {section.lectures.map((lecture, lectureIndex) => (
            <div
              key={lectureIndex}
              className="flex flex-col bg-gray-50 border rounded-md px-4 py-3"
            >
              <div className="flex items-center justify-between">
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
                      value={lecture.name}
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
                      {lecture.name}
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
                        className="absolute top-full mt-1 right-0 bg-white border shadow-lg rounded-md py-2 z-50 w-48"
                      >
                        {CONTENT_OPTIONS.map((option) => (
                          <div
                            onClick={() => {
                              handleOpenModal(
                                option,
                                `Add ${option}`,
                                sectionIndex,
                                lectureIndex
                              );
                            }}
                            key={option}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            {option === "Video" && <Video className="w-4 h-4" />}
                            {option === "Attach File" && <FileText className="w-4 h-4" />}
                            {option === "Captions" && <Type className="w-4 h-4" />}
                            {option === "Description" && <Type className="w-4 h-4" />}
                            {option === "Lecture Notes" && <BookOpen className="w-4 h-4" />}
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  <button
                    onClick={() => toggleLectureEdit(sectionIndex, lectureIndex)}
                    className="hover:bg-gray-100 p-1 rounded-full"
                    title={section.lectureEditing[lectureIndex] ? "Save" : "Edit lecture name"}
                  >
                    {section.lectureEditing[lectureIndex] ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <button
                    className="hover:bg-gray-100 p-1 rounded-full"
                    title="Delete lecture"
                    onClick={() => deleteLecture(sectionIndex, lectureIndex)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Content Summary */}
              <ContentSummary 
                lecture={lecture} 
                sectionIndex={sectionIndex} 
                lectureIndex={lectureIndex}
              />
            </div>
          ))}
        </div>
      ))}
      
      {/* Content modal */}
      <ContentModal 
        isOpen={openModal} 
        onClose={() => setOpenModal(false)} 
        config={modalConfig}
      />
      
      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={addSection}
          className="flex-1 bg-[#D9D6FB] text-[#2E2C6F] text-sm font-semibold py-2 rounded-md text-center"
        >
          Add Section
        </button>
        <button
          onClick={handleSaveCourseSections}
          disabled={mutationLoading}
          className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-md text-center disabled:opacity-70"
        >
          {mutationLoading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
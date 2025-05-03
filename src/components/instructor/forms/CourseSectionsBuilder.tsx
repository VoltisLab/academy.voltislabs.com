// components/CourseBuilder.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Plus } from 'lucide-react';
import { ContentType, ResourceTabType, Section, CourseSectionInput, LectureInput } from '@/lib/types';
import { useSections } from '@/hooks/useSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useModal } from '@/hooks/useModal';
import { ContentTypeSelector } from '../ContentTypeSelector';
import { ActionButtons } from '../ActionButtons';
import SectionItem from '../SectionItem';
import AddResourceModal from '../AddResourceModal';
import DescriptionEditorModal from '../DescriptionEditorModal';
import { useCourseSectionsUpdate } from '@/services/courseSectionsService';

interface CourseBuilderProps {
  onSaveNext?: () => void;
  courseId: number | undefined;
}

// Simple section form (not a modal)
const SectionForm: React.FC<{
  onAddSection: (title: string, objective: string) => void;
  onCancel: () => void;
}> = ({ onAddSection, onCancel }) => {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddSection(title, objective);
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-4">
      <div className="flex justify-between items-center p-3 bg-gray-50">
        <h3 className="font-semibold">New Section:</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={80}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {title.length}/80
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What will students be able to do at the end of this section?
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Enter a Learning Objective"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {objective.length}/200
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CourseBuilder: React.FC<CourseBuilderProps> = ({ 
  onSaveNext, 
  courseId 
}) => {
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [showContentTypeSelector, setShowContentTypeSelector] = useState<boolean>(false);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTabType>(ResourceTabType.DOWNLOADABLE_FILE);
  const [showSectionForm, setShowSectionForm] = useState<boolean>(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
const [draggedLecture, setDraggedLecture] = useState<string | null>(null);
const [dragTarget, setDragTarget] = useState<{
  sectionId: string | null;
  lectureId: string | null;
}>({ sectionId: null, lectureId: null });
  
const { 
  sections, 
  setSections, // Add this line to get the setSections function
  addSection, 
  addLecture,
  deleteSection,
  deleteLecture,
  toggleSectionExpansion,
  updateSectionName,
  updateLectureName,
  moveSection,
  moveLecture,
  updateLectureContent,
  saveDescription: saveSectionDescription,
  updateLectureWithUploadedContent,
  handleLectureDrop
} = useSections([]);
  
  const contentSectionModal = useModal();
  const resourceModal = useModal();
  const descriptionModal = useModal();
  
  const { 
    isUploading, 
    uploadProgress, 
    fileInputRef,
    triggerFileUpload, 
    handleFileSelection 
  } = useFileUpload(
    updateLectureWithUploadedContent,
    () => resourceModal.close()
  );
  
  const { updateCourseSections, loading: mutationLoading, error: mutationError } = useCourseSectionsUpdate();
  
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      // Fix for the closest method by casting to Element instead of Node
      const target = e.target as Element;
      if (editingSectionId && !target.closest('.section-edit')) {
        setEditingSectionId(null);
      }
      
      if (editingLectureId && !target.closest('.lecture-edit')) {
        setEditingLectureId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingSectionId, editingLectureId]);
  
  // Toggle description editor
  const toggleDescriptionEditor = (sectionId: string, lectureId: string, currentText: string = "") => {
    descriptionModal.toggle(sectionId, lectureId);
    if (!descriptionModal.isOpen) {
      setCurrentDescription(currentText);
    }
  };
  
  // Save description
  const saveDescription = () => {
    if (!descriptionModal.activeSection) return;
    
    const { sectionId, lectureId } = descriptionModal.activeSection;
    saveSectionDescription(sectionId, lectureId, currentDescription);
    descriptionModal.close();
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string, lectureId?: string) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true);
    
    if (lectureId) {
      setDraggedLecture(lectureId);
      e.dataTransfer.setData("lectureId", lectureId);
    } else {
      setDraggedSection(sectionId);
    }
    
    e.dataTransfer.setData("sectionId", sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedSection(null);
    setDraggedLecture(null);
    setDragTarget({ sectionId: null, lectureId: null });
  };

  const handleDragOver = (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    // Update the drop target
    setDragTarget({
      sectionId: targetSectionId,
      lectureId: targetLectureId || null
    });
  };
  

  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => {
      e.preventDefault();
      setIsDragging(false);
      
      // Get the dragged item data
      const sourceSectionId = e.dataTransfer.getData("sectionId");
      const sourceLectureId = e.dataTransfer.getData("lectureId");
      
      if (!sourceSectionId) return; // No valid data, abort
      
      // Case 1: We're dragging a lecture
      if (sourceLectureId && sourceLectureId.trim() !== "") {
        handleLectureDrop(sourceSectionId, sourceLectureId, targetSectionId, targetLectureId);
        return;
      }
      
      // Case 2: We're dragging a section (and not dropping onto a lecture)
      if (!targetLectureId) {
        // Find section indices
        const sourceIndex = sections.findIndex(s => s.id === sourceSectionId);
        const targetIndex = sections.findIndex(s => s.id === targetSectionId);
        
        // Skip if source or target not found, or if dropping onto itself
        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
          return;
        }
        
        // Create a new array with the section moved to the new position
        const newSections = [...sections];
        const [movedSection] = newSections.splice(sourceIndex, 1);
        newSections.splice(targetIndex, 0, movedSection);
        
        // Update the state with the new sections array
        setSections(newSections);
        toast.success("Section moved successfully");
      }
    };
  

  const handleDragLeave = () => {
    // Optionally clear drop targets when leaving
    setDragTarget({ sectionId: null, lectureId: null });
  };

  // Handle adding new section with title and objective
  const handleAddSection = (title: string, objective: string) => {
    addSection(title, objective);
    setShowSectionForm(false);
  };

  const handleSaveCourseSections = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    
    try {
      // Map sections to match CourseSectionInput type
      const courseSections: CourseSectionInput[] = sections.map(section => {
        // Map lectures to match LectureInput type
        const lectures: LectureInput[] = section.lectures.map(lecture => ({
          // Ensure name is always a string, never undefined
          name: lecture.name ?? lecture.title ?? "",
          description: lecture.description || "",
          captions: lecture.captions || "",
          lectureNotes: lecture.lectureNotes || "",
          contentType: lecture.contentType,
          attachedFiles: {
            action: "ADD",
            attachedFile: lecture.attachedFiles.map(file => ({ url: file.url }))
          },
          videoUrls: {
            action: "ADD",
            videos: lecture.videos.map(video => ({ url: video.url }))
          }
        }));
        
        return {
          sectionName: section.name,
          lectures: lectures
        };
      });

      const courseIdNumber = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
      const result = await updateCourseSections({courseId: courseIdNumber, courseSections});

      if (result.updateCourseInfo.success) {
        toast.success("Course curriculum saved successfully!");
        if (onSaveNext) onSaveNext();
      } else {
        toast.error(result.updateCourseInfo.message || "Failed to save course curriculum");
      }
    } catch (error) {
      console.error("Error saving course curriculum:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };
  
  return (
    <div className="xl:max-w-6xl w-full xl:mx-auto py-6 xl:px-8">
      <div className="mb-6 flex md:flex-row flex-col justify-between items-center">
        <h1 className="md:text-2xl text-xl font-bold text-gray-900">Course Curriculum Builder</h1>
        <div className="space-x-3 flex sm:justify-between">
        <button
            type="button"
            onClick={handleSaveCourseSections}
            disabled={mutationLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {mutationLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={handleSaveCourseSections}
            disabled={mutationLoading}
            className="inline-flex items-center xl: px-1 xl:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {mutationLoading ? 'Saving...' : 'Save and Continue'}
          </button>
        </div>
      </div>
      
      {mutationError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {mutationError.message || "Error saving course curriculum"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 sm:p-6 border-b">
          <p className="text-gray-500 mb-4">
            Create your course curriculum by adding sections and curriculum items. Drag to reorder.
          </p>
          
          {/* Render sections */}
          {sections.map((section, index) => (
            <SectionItem
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
            editingSectionId={editingSectionId}
            setEditingSectionId={setEditingSectionId}
            updateSectionName={updateSectionName}
            deleteSection={deleteSection}
            moveSection={moveSection}
            toggleSectionExpansion={toggleSectionExpansion}
            isDragging={isDragging}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={(e) => handleDragOver(e, section.id)}
            handleDragLeave={handleDragLeave}
            handleDrop={(e) => handleDrop(e, section.id)}
            addLecture={addLecture}
            editingLectureId={editingLectureId}
            setEditingLectureId={setEditingLectureId}
            updateLectureName={updateLectureName}
            deleteLecture={deleteLecture}
            moveLecture={moveLecture}
            toggleContentSection={contentSectionModal.toggle}
            toggleAddResourceModal={resourceModal.toggle}
            toggleDescriptionEditor={toggleDescriptionEditor}
            activeContentSection={contentSectionModal.activeSection}
            addCurriculumItem={() => setShowContentTypeSelector(true)}
            draggedSection={draggedSection}
            draggedLecture={draggedLecture}
            dragTarget={dragTarget}
          />
          ))}
          
          {/* Section Form (non-modal, appears directly in the UI) */}
          {showSectionForm && (
            <SectionForm
              onAddSection={handleAddSection}
              onCancel={() => setShowSectionForm(false)}
            />
          )}
          
          {/* Add Section Button */}
          <div className="flex mt-6">
            <button
              onClick={() => setShowSectionForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-indigo-600 bg-white rounded-md text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Section
            </button>
          </div>
          
          {showContentTypeSelector && (
            <div className="absolute z-10 left-0 mt-2">
              <ContentTypeSelector 
                sectionId={sections.length > 0 ? sections[sections.length - 1].id : ''} 
                onSelect={addLecture}
                onClose={() => setShowContentTypeSelector(false)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden file input for file uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (!contentSectionModal.activeSection) return;
          
          const contentType = fileInputRef.current?.getAttribute("accept")?.includes("video") 
            ? ContentType.VIDEO 
            : ContentType.FILE;
            
          handleFileSelection(
            e, 
            contentType, 
            contentSectionModal.activeSection.sectionId, 
            contentSectionModal.activeSection.lectureId
          );
        }}
        className="hidden" 
      />
      
      {/* Modals */}
      {resourceModal.isOpen && resourceModal.activeSection && (
        <AddResourceModal
          activeContentSection={resourceModal.activeSection}
          setShowAddResourceModal={resourceModal.close}
          activeResourceTab={activeResourceTab}
          setActiveResourceTab={setActiveResourceTab}
          sections={sections}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          triggerFileUpload={triggerFileUpload}
        />
      )}
      
      {descriptionModal.isOpen && descriptionModal.activeSection && (
        <DescriptionEditorModal
          activeDescriptionSection={descriptionModal.activeSection}
          setShowDescriptionEditor={descriptionModal.close}
          currentDescription={currentDescription}
          setCurrentDescription={setCurrentDescription}
          saveDescription={saveDescription}
        />
      )}
    </div>
  );
};

export default CourseBuilder;
// components/CourseBuilder.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { ContentType, ResourceTabType, Section } from '@/lib/types';
import { useSections } from '@/hooks/useSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useModal } from '@/hooks/useModal';
import { ContentTypeSelector } from '../ContentTypeSelector';
import { ActionButtons } from '../ActionButtons';
import SectionItem from '../SectionItem';
import AddSectionButton from '../AddSectionButtons';
import AddResourceModal from '../AddResourceModal';
import DescriptionEditorModal from '../DescriptionEditorModal';
import { useCourseSectionsUpdate } from '@/services/courseSectionsService';
import { sectionObject } from '@/lib/utils';

interface CourseBuilderProps {
  onSaveNext?: () => void;
  courseId: number | undefined;
}

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
  
  const { 
    sections, 
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
  } = useSections([sectionObject]);
  
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
      const target = e.target as Node;
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
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string, lectureId?: string) => {
    setIsDragging(true);
    if (lectureId) {
      e.dataTransfer.setData("lectureId", lectureId);
    }
    e.dataTransfer.setData("sectionId", sectionId);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetLectureId?: string) => {
    e.preventDefault();
    setIsDragging(false);

    const sourceSectionId = e.dataTransfer.getData("sectionId");
    const sourceLectureId = e.dataTransfer.getData("lectureId");

    if (sourceLectureId) {
      handleLectureDrop(sourceSectionId, sourceLectureId, targetSectionId, targetLectureId);
    }
  };

  const handleSaveCourseSections = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    
    try {
      const courseSections = sections.map(section => ({
        sectionName: section.name,
        lectures: section.lectures.map(lecture => ({
          name: lecture.name,
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
        }))
      }));

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
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Course Curriculum Builder</h1>
        <div className="space-x-3">
          <button
            type="button"
            onClick={handleSaveCourseSections}
            disabled={mutationLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    handleDragOver={handleDragOver}
    handleDrop={handleDrop}
    addLecture={addLecture} // This function needs to accept ContentItemType
    editingLectureId={editingLectureId}
    setEditingLectureId={setEditingLectureId}
    updateLectureName={updateLectureName}
    deleteLecture={deleteLecture}
    moveLecture={moveLecture}
    toggleContentSection={contentSectionModal.toggle}
    toggleAddResourceModal={resourceModal.toggle}
    toggleDescriptionEditor={toggleDescriptionEditor}
    activeContentSection={contentSectionModal.activeSection}
    addCurriculumItem={() => setShowContentTypeSelector(true)} // This line might need to be updated
  />
))}
          
          <AddSectionButton addSection={addSection} />
          
          {showContentTypeSelector && (
            <div className="absolute z-10 left-0 mt-2">
              <ContentTypeSelector 
                sectionId={sections[sections.length - 1].id} 
                onSelect={addLecture}
                onClose={() => setShowContentTypeSelector(false)}
              />
            </div>
          )}
        </div>
        
        {/* Bottom action bar */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
          <div></div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSaveCourseSections}
              disabled={mutationLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mutationLoading ? 'Saving...' : 'Save and Continue'}
            </button>
          </div>
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
  )
}

export default CourseBuilder;
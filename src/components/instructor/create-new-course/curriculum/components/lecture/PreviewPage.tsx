/*
 * STEP 5: Create Main PreviewPage Component
 * This is the main component that handles the preview display
 */

import React, { useState } from 'react';
import { Lecture, VideoContent, ArticleContent, SectionItem, PreviewType, SourceCodeFile, ExternalResourceItem, ResourcesData } from '@/lib/types';
import SectionSidebar from './StudentPreviewSidebar';
import ContentRenderer from './ContentRenderer';

interface PreviewPageProps {
  lecture: Lecture;
  contentType: PreviewType;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  previewMode: 'instructor' | 'student';
  videoContent?: VideoContent;
  articleContent?: ArticleContent;
  quizContent?: any;
  assignmentContent?: any;
  codingExerciseContent?: any;
  uploadedFiles: Array<{name: string, size: string}>;
  sourceCodeFiles: SourceCodeFile[];
  externalResources: ExternalResourceItem[];
  sectionItems?: SectionItem[];
  sectionTitle?: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({
  lecture,
  contentType,
  setShowPreview,
  previewMode,
  videoContent,
  articleContent,
  quizContent,
  assignmentContent,
  codingExerciseContent,
  uploadedFiles,
  sourceCodeFiles,
  externalResources,
  sectionTitle = "Section 1: ecw",
  sectionItems = []
}) => {
  // State for currently selected item in the sidebar
  const [selectedItemId, setSelectedItemId] = useState<string>(lecture.id || "default-item");
  const [openResourcesDropdowns, setOpenResourcesDropdowns] = useState<Record<string, boolean>>({});
  
  // If no section items were provided, create a default one from current lecture
  const allSectionItems: SectionItem[] = sectionItems.length > 0 ? sectionItems : [
    {
      id: lecture.id || "default-item",
      name: lecture.name || "Default Lecture",
      type: contentType,
      duration: videoContent?.selectedVideoDetails?.duration || "1min",
      hasResources: Boolean(uploadedFiles.length || sourceCodeFiles.length || externalResources.length),
      isCompleted: false
    }
  ];

  // Function to get the content type of the currently selected item
  const getSelectedItemType = (): PreviewType => {
    const selectedItem = allSectionItems.find(item => item.id === selectedItemId);
    return selectedItem?.type || contentType;
  };

  // Function to toggle resource dropdown
  const toggleResourcesDropdown = (itemId: string) => {
    setOpenResourcesDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Resources data for the dropdowns
  const resourcesData: ResourcesData = {
    downloadableFiles: uploadedFiles,
    sourceCodeFiles: sourceCodeFiles,
    externalResources: externalResources
  };

  // Content props to pass to the renderer
  const contentProps = {
    contentType: getSelectedItemType(),
    previewMode,
    lecture,
    videoContent,
    articleContent,
    quizContent,
    assignmentContent,
    codingExerciseContent,
    uploadedFiles,
    sourceCodeFiles,
    externalResources,
    setShowPreview
  };

  // For video content, render the video preview in fullscreen
  const isVideoContent = getSelectedItemType() === 'video';
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto" style={{ width: 'calc(100% - 320px)' }}>
          <ContentRenderer {...contentProps} />
        </div>

        {/* Right sidebar */}
        <SectionSidebar
          sectionTitle={sectionTitle}
          sectionItems={allSectionItems}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          openResourcesDropdowns={openResourcesDropdowns}
          toggleResourcesDropdown={toggleResourcesDropdown}
          resourcesData={resourcesData}
          onClose={() => setShowPreview(false)}
        />
      </div>
    </div>
  );
};

export default PreviewPage;
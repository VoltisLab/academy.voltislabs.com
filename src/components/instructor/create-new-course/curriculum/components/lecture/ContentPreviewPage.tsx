/*
 * STEP 6: Create ContentPreviewPage Component
 * This component integrates with LectureItem and handles section data loading
 */

import React, { useState, useEffect } from 'react';
import { Lecture, PreviewType, SectionItem } from '@/lib/types';
import PreviewPage from './PreviewPage';
import { contentItemTypeToPreviewType } from '@/lib/utils';

// Props for ContentPreviewPage
interface ContentPreviewPageProps {
  lecture: Lecture;
  videoContent: any;
  articleContent: any;
  uploadedFiles: Array<{name: string, size: string}>;
  sourceCodeFiles: any[];
  externalResources: any[];
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  previewMode: 'instructor' | 'student';
  sections: any[];
  sectionId: string;
}

const ContentPreviewPage: React.FC<ContentPreviewPageProps> = ({
  lecture,
  videoContent,
  articleContent,
  uploadedFiles,
  sourceCodeFiles,
  externalResources,
  setShowVideoPreview,
  previewMode,
  sections,
  sectionId
}) => {
  // State for section items
  const [sectionItems, setSectionItems] = useState<SectionItem[]>([]);
  
  // Load section items based on section data
  useEffect(() => {
    // Find the current section in the sections array
    const currentSection = sections.find(section => section.id === sectionId);
    
    if (!currentSection || !currentSection.lectures) {
      // Fallback to just showing the current lecture
      setSectionItems([{
        id: lecture.id || "default-lecture",
        name: lecture.name || "Default Lecture",
        type: videoContent.selectedVideoDetails ? 'video' : (articleContent.text ? 'article' : 'video'),
        duration: "1min",
        hasResources: Boolean(uploadedFiles.length || sourceCodeFiles.length || externalResources.length),
        isCompleted: false
      }]);
      return;
    }
    
    // Map lectures to section items
    const items: SectionItem[] = [];
    
    // Add existing lectures
    currentSection.lectures.forEach((lectureItem: any, index: number) => {
      // Determine content type
      let type: PreviewType = 'video';
      
      if (lectureItem.contentType) {
        type = lectureItem.contentType as PreviewType;
      } else if (lectureItem.id === lecture.id) {
        // For the current lecture use the content we know
        type = videoContent.selectedVideoDetails ? 'video' : (articleContent.text ? 'article' : 'video');
      }
      
      // Check if this lecture has resources
      const hasResources = lectureItem.id === lecture.id 
        ? Boolean(uploadedFiles.length || sourceCodeFiles.length || externalResources.length)
        : Boolean(lectureItem.resources && lectureItem.resources.length);
      
      items.push({
        id: lectureItem.id || `lecture-${index}`,
        name: lectureItem.name || `Lecture ${index + 1}`,
        type: type,
        duration: "1min",
        hasResources: hasResources,
        isCompleted: Boolean(lectureItem.isCompleted)
      });
    });
    
    // Check for and add quiz, assignment, and coding exercise if required
    // This is based on your screenshots showing different types of content
    const hasQuiz = items.some(item => item.type === 'quiz');
    if (!hasQuiz) {
      items.push({
        id: 'quiz-1',
        name: 'Quiz one',
        type: 'quiz',
        duration: '1min',
        hasResources: false,
        isCompleted: false
      });
    }
    
    const hasAssignment = items.some(item => item.type === 'assignment');
    if (!hasAssignment) {
      items.push({
        id: 'assignment-1',
        name: 'Differentiate between client side and server side rendering...',
        type: 'assignment',
        duration: '1min',
        hasResources: false,
        isCompleted: false
      });
    }
    
    const hasCodingExercise = items.some(item => item.type === 'coding-exercise');
    if (!hasCodingExercise) {
      items.push({
        id: 'coding-exercise-1',
        name: 'Write a python script to implement face recognition.',
        type: 'coding-exercise',
        duration: '1min',
        hasResources: false,
        isCompleted: false
      });
    }
    
    setSectionItems(items);
  }, [lecture.id, sections, sectionId, videoContent, articleContent, uploadedFiles, sourceCodeFiles, externalResources]);
  
  // Get the section title
  const sectionTitle = React.useMemo(() => {
    const currentSection = sections.find(section => section.id === sectionId);
    return currentSection?.name || "Section 1: ecw";
  }, [sections, sectionId]);
  
  // Determine content type based on lecture or active content
  const contentType: PreviewType = contentItemTypeToPreviewType(lecture.contentType) || 
  (videoContent.selectedVideoDetails ? 'video' : 
   articleContent.text ? 'article' : 'video');
  
  return (
    <PreviewPage
      lecture={lecture}
      contentType={contentType}
      setShowPreview={setShowVideoPreview}
      previewMode={previewMode}
      videoContent={videoContent}
      articleContent={articleContent}
      uploadedFiles={uploadedFiles}
      sourceCodeFiles={sourceCodeFiles}
      externalResources={externalResources}
      sectionItems={sectionItems}
      sectionTitle={sectionTitle}
    />
  );
};

export default ContentPreviewPage;
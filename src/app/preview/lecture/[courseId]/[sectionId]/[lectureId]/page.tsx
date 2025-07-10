"use client"
import StudentCoursePreview from '@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentCoursePreview'
import { useParams } from 'next/navigation';
import { useSectionService } from '@/services/useSectionService';
import { useEffect, useState } from 'react';
import React from 'react'
import { CourseSection } from '@/api/course/section/queries';
import { AssignmentProvider } from '@/context/AssignmentDataContext';

const Preview = () => {
  const params = useParams();
  
  // Extract all three parameters from the URL
  const courseId = params?.courseId;
  const sectionId = params?.sectionId;
  const lectureId = params?.lectureId;
  
  const { getCourseSections, loading, error } = useSectionService();
  const [sections, setSections] = useState<CourseSection[] | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      if (courseId) {
        try {
          const data = await getCourseSections({ id: parseInt(courseId as string) });
          setSections(data.courseSections);
          console.log("Fetched sections:", data.courseSections);
        } catch (err) {
          console.error("Failed to fetch sections:", err);
        }
      }
    };

    fetchSections();
  }, [courseId]);

  console.log("Course ID:", courseId, "Section ID:", sectionId, "Lecture ID:", lectureId)
  console.log("Sections:", sections)
  
  return (
    <div className="bg-white min-h-screen">
      {sections && sectionId && lectureId ? (
        (() => {
          // Find the current section and lecture from backend data
          const currentSection = sections.find(s => String(s.id) === String(sectionId)) || { id: '', title: '', lectures: [], quiz: [], assignment: [], codingExercises: [], practiceSet: [] };
          const currentLecture = currentSection.lectures?.find(l => String(l.id) === String(lectureId)) || { id: '', title: '', videoUrl: '', description: '', duration: '', resources: [] };

          // Prepare sidebar sections structure
          const sidebarSections = sections.map(section => ({
            id: section.id || '',
            name: section.title || '',
            lectures: (section.lectures as any[]) || [],
            quizzes: (section.quiz as any[]) || [],
            assignments: (section.assignment as any[]) || [],
            codingExercises: (section.codingExercises as any[]) || [],
            isExpanded: false,
          }));

          // Prepare resources for the current lecture
          const uploadedFiles = (currentLecture.resources || [])
            .filter(r => r.type === 'DOWNLOADABLE_FILES')
            .map(r => ({ name: r.title, size: '', lectureId: currentLecture.id || '' }));
          const sourceCodeFiles = (currentLecture.resources || [])
            .filter(r => r.type === 'SOURCE_CODE')
            .map(r => ({ name: r.title, url: r.url, lectureId: currentLecture.id || '' }));
          const externalResources = (currentLecture.resources || [])
            .filter(r => r.type === 'EXTERNAL_RESOURCES')
            .map(r => ({ title: r.title, name: r.title, url: r.url, lectureId: currentLecture.id || '' }));

          // Prepare videoContent for the previewed lecture
          const videoContent = {
            selectedVideoDetails: currentLecture.videoUrl
              ? {
                  id: currentLecture.id || '',
                  url: currentLecture.videoUrl,
                  filename: currentLecture.title || 'Lecture Video',
                  thumbnailUrl: '',
                  isDownloadable: false,
                  duration: currentLecture.duration ? String(currentLecture.duration) : '',
                }
              : null,
            uploadTab: { selectedFile: null },
            libraryTab: { searchQuery: '', selectedVideo: null, videos: [] },
            activeTab: 'uploadVideo',
          };

          const extendedLecture = {
            attachedFiles: [],
            videos: [],
            contentType: 'assignment' as 'assignment',
            isExpanded: false,
            assignmentTitle: '',
            assignmentDescription: '',
            estimatedDuration: 0,
            durationUnit: 'minutes' as 'minutes',
            instructions: '',
            assignmentQuestions: [],
            isPublished: false,
            ...currentLecture,
            duration: currentLecture.duration ? String(currentLecture.duration) : '',
          };

          // Check if the lecture is a video or article
          const isVideoLecture = !!currentLecture.videoUrl && currentLecture.videoUrl.trim() !== '';
          // Type guard for notes
          const hasNotes = (lecture: any): lecture is { notes: string } => typeof lecture.notes === 'string';
          const articleText = !isVideoLecture
            ? (hasNotes(currentLecture) ? currentLecture.notes : currentLecture.description || '')
            : '';
          return (
            <AssignmentProvider initialData={extendedLecture}>
              <StudentCoursePreview
                videoContent={isVideoLecture ? videoContent : { ...videoContent, selectedVideoDetails: null }}
                setShowVideoPreview={() => {}}
                lecture={currentLecture}
                uploadedFiles={uploadedFiles}
                sourceCodeFiles={sourceCodeFiles}
                externalResources={externalResources}
                section={{
                  id: currentSection.id || '',
                  name: currentSection.title || '',
                  sections: sidebarSections,
                  lectures: (currentSection.lectures as any[]) || [],
                  quizzes: (currentSection.quiz as any[]) || [],
                  assignments: (currentSection.assignment as any[]) || [],
                  codingExercises: (currentSection.codingExercises as any[]) || [],
                }}
                articleContent={{ text: articleText }}
              />
            </AssignmentProvider>
          );
        })()
      ) : (
        <div className="text-center py-10">Loading...</div>
      )}
    </div>
  )
}

export default Preview
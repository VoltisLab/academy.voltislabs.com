"use client"
import StudentCoursePreview from '@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentCoursePreview'
import { useParams, useSearchParams } from 'next/navigation';
import { useSectionService } from '@/services/useSectionService';
import { useEffect, useState } from 'react';
import React from 'react'
import { CourseSection } from '@/api/course/section/queries';

const Preview = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const courseId = params?.courseId;
  const lectureId = searchParams?.get('lectureId');
  
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

  console.log("Course ID:", courseId, "Lecture ID:", lectureId)
  console.log("Sections:", sections)
  
  return (
    <div>
        hello world
    </div>
  )
}

export default Preview
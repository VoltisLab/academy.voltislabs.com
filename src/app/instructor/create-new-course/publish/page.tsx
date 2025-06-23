"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";

export default function PublishCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");

  const handleBackToCurriculum = useCallback(() => {
    if (courseId) {
      router.push(`/instructor/create-new-course/curriculum?courseId=${courseId}`);
    }
  }, [router, courseId]);

  const handlePublishCourse = useCallback(() => {
    if (courseId) {
      // TODO: Implement publish course API call
      alert(`Course ${courseId} published!`);
      // router.push(`/instructor/dashboard`);
    }
  }, [courseId]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen flex flex-col items-center justify-center">
      <CourseCreationTabs />
      <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Publish Your Course</h2>
        <p className="text-gray-600 mb-6">
          You're almost there! Review your course details and publish it to make it available to students.
        </p>
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBackToCurriculum}
            className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100"
          >
            ← Back to Curriculum
          </button>
          <button 
            onClick={handlePublishCourse}
            disabled={!courseId}
            className={`px-6 py-3 rounded-md font-medium text-sm ${
              courseId
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Publish Course
          </button>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";
import {
  useCourseInfoUpdate,
  useCourseStatusUpdate,
} from "@/services/useCourseInfoUpdate";
import toast from "react-hot-toast";

export default function PublishCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");

  // Use the course update hook
  const {
    updateCourseStatusInfo,
    loading: mutationLoading,
    error: mutationError,
  } = useCourseStatusUpdate();

  const handlePublishClick = async () => {
    try {
      const publishPromise = updateCourseStatusInfo({
        courseId: Number(courseId), // replace with actual course ID
        status: "PUBLISHED",
      });

      toast.promise(publishPromise, {
        loading: "Publishing course...",
        success: (res) =>
          res?.updateCourse.success
            ? "✅ Course published successfully!"
            : res?.updateCourse.message || "Something went wrong",
        error: (err) => err.message || "❌ Failed to publish course",
      });

      await publishPromise;
    } catch (err) {
      console.error("Error publishing course:", err);
      // toast is already handled by toast.promise
    }
  };

  const handleBackToCurriculum = useCallback(() => {
    if (courseId) {
      router.push(
        `/instructor/create-new-course/curriculum?courseId=${courseId}`
      );
    }
  }, [router, courseId]);

  // const handlePublishCourse = useCallback(() => {
  //   if (courseId) {
  //     // TODO: Implement publish course API call
  //     alert(`Course ${courseId} published!`);
  //     // router.push(`/instructor/dashboard`);
  //   }
  // }, [courseId]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] mx-auto ">
      <CourseCreationTabs />

      <div className="p-6  border-x border-b border-gray-200 w-full h-[calc(100vh-180px)] rounded-b-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Publish Your Course
        </h2>
        <div className="flex flex-col justify-between h-[90%]">
          <p className="text-gray-600">
            You're almost there! Review your course details and publish it to
            make it available to students.
          </p>
          <div className="flex items-center justify-between">
            {/* <button
              onClick={handleBackToCurriculum}
              className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100"
            >
              ← Back to Curriculum
            </button> */}
            <button
              onClick={handlePublishClick}
              disabled={!courseId || mutationLoading}
              className={`px-6 py-3 rounded-md font-medium ml-auto text-sm ${
                courseId
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {mutationLoading ? "Publishing" : "Publish Course"}
            </button>
          </div>
        </div>
      </div>
    </div>

    // <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen flex flex-col items-center justify-center">
    //   <CourseCreationTabs />

    // </div>
  );
}

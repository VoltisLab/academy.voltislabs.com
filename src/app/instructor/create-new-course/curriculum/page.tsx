"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Curriculum } from "@/components/instructor/create-new-course/curriculum/Curriculum";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";

export default function CurriculumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");

  // When the curriculum is saved, redirect to publish step with courseId
  const handleSaveNext = useCallback(() => {
    if (courseId) {
      router.push(`/instructor/create-new-course/publish?courseId=${courseId}`);
    }
  }, [router, courseId]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen">
      <CourseCreationTabs />
      <Curriculum onSaveNext={handleSaveNext} courseId={courseId ? Number(courseId) : undefined} />
    </div>
  );
} 
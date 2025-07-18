"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Curriculum } from "@/components/instructor/create-new-course/curriculum/Curriculum";
import { useCallback, useEffect, useState } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";
import { useSectionService } from "@/services/useSectionService";

export default function CurriculumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");

  //main section data

  // When the curriculum is saved, redirect to publish step with courseId
  const handleSaveNext = useCallback(() => {
    if (courseId) {
      router.push(`/instructor/create-new-course/publish?courseId=${courseId}`);
    }
  }, [router, courseId]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] mx-auto min-h-screen">
      <CourseCreationTabs />

      <div className="px-4">
        <Curriculum
          onSaveNext={handleSaveNext}
          courseId={courseId ? Number(courseId) : undefined}
        />
      </div>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AdvanceInformationForm } from "@/components/instructor/create-new-course/advance-information/AdvancedInformation";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";

export default function AdvancedInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("courseId");

  // When the form is saved, redirect to curriculum step with courseId
  const handleSaveNext = useCallback(() => {
    if (courseId) {
      router.push(
        `/instructor/create-new-course/curriculum?courseId=${courseId}`
      );
    }
  }, [router, courseId]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] mx-auto min-h-screen">
      <CourseCreationTabs />
      <div className="px-4">
        <AdvanceInformationForm
          onSaveNext={handleSaveNext}
          courseId={courseId ? Number(courseId) : undefined}
        />
      </div>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BasicInformationForm } from "@/components/instructor/create-new-course/basic-information/BasicInformationForm";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";

export default function BasicInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");
  const title = searchParams!.get("edit");


  // When the form is saved, redirect to advanced step with courseId
  const handleSaveNext = useCallback(
    (id: number) => {
      title?.trim() ? router.push(`/instructor/create-new-course/advanced?courseId=${id}&edit=${title}`) :
      router.push(`/instructor/create-new-course/advanced?courseId=${id}`)
    },
    [router]
  );

  return (
    <div className="bg-white w-full xl:max-w-[90rem] mx-auto min-h-screen">
      <CourseCreationTabs />

      <div className="px-4">
        <BasicInformationForm
          onSaveNext={handleSaveNext}
          courseId={courseId ? Number(courseId) : undefined}
        />
      </div>
    </div>
  );
}

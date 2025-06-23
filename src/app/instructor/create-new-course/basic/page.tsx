"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BasicInformationForm } from "@/components/instructor/create-new-course/basic-information/BasicInformationForm";
import { useCallback } from "react";
import CourseCreationTabs from "@/components/instructor/create-new-course/layout/CourseCreationTabs";

export default function BasicInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams!.get("courseId");

  // When the form is saved, redirect to advanced step with courseId
  const handleSaveNext = useCallback((id: number) => {
    router.push(`/instructor/create-new-course/advanced?courseId=${id}`);
  }, [router]);

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen">
      <CourseCreationTabs />
      <BasicInformationForm onSaveNext={handleSaveNext} courseId={courseId ? Number(courseId) : undefined} />
    </div>
  );
} 
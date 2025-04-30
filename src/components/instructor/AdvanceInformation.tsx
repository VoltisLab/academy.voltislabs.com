"use client";

import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import dynamic from "next/dynamic"; // <-- import this

// Dynamically import CourseDescriptionEditor with SSR disabled
const CourseDescriptionEditor = dynamic(() => import("./forms/CourseDescriptionEditor"), {
  ssr: false,
});

import CourseObjectivesInput from "./forms/CourseObjectivesInput";
import MediaUploadForm from "./forms/MediaUploadForm";

export function AdvanceInformationForm() {
  return (
    <section className="space-y-10">
      <FormHeader />
      <MediaUploadForm />
      <CourseDescriptionEditor /> {/* now safe, no document error */}
      <CourseObjectivesInput title="What you will teach in this course" />
      <CourseObjectivesInput title="Target Audience" />
      <CourseObjectivesInput title="Course requirements" />
    </section>
  );
}

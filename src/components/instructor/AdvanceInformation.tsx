"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import { uploadFile } from "@/services/fileUploadService";

// Dynamically import CourseDescriptionEditor with SSR disabled
const CourseDescriptionEditor = dynamic(() => import("./forms/CourseDescriptionEditor"), {
  ssr: false,
});

import CourseObjectivesInput from "./forms/CourseObjectivesInput";
import CourseThumbnailUploader from "./forms/CourseThumbnailUploader";

interface BasicInformationFormProps {
  onSaveNext: () => void;
}

export const AdvanceInformationForm = ({ onSaveNext }: BasicInformationFormProps) => {
  // State to store uploaded image URLs
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState<string>("");
  const [secondaryThumbnailUrl, setSecondaryThumbnailUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Handler for primary thumbnail
  const handlePrimaryThumbnailUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'RESOURCE');
      if (url) {
        setCourseThumbnailUrl(url);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handler for secondary thumbnail
  const handleSecondaryThumbnailUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'RESOURCE');
      if (url) {
        setSecondaryThumbnailUrl(url);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-10">
      <FormHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Course Thumbnails with upload handlers */}
        <CourseThumbnailUploader 
          onFileSelect={handlePrimaryThumbnailUpload} 
          isUploading={isUploading} 
          imageUrl={courseThumbnailUrl}
        />
        <CourseThumbnailUploader 
          onFileSelect={handleSecondaryThumbnailUpload}
          isUploading={isUploading}
          imageUrl={secondaryThumbnailUrl}
        />
      </div>
      <CourseDescriptionEditor />
      <CourseObjectivesInput title="What you will teach in this course" />
      <CourseObjectivesInput title="Target Audience" />
      <CourseObjectivesInput title="Course requirements" />
      {/* <FormFooterButtons onNext={onSaveNext} /> */}
    </section>
  );
}
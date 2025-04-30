"use client";

import { useState } from "react";
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

// Dynamically import CourseDescriptionEditor with SSR disabled
const CourseDescriptionEditor = dynamic(() => import("./forms/CourseDescriptionEditor"), {
  ssr: false,
});

import CourseObjectivesInput from "./forms/CourseObjectivesInput";
import CourseThumbnailUploader from "./forms/CourseThumbnailUploader";

// Fixed the mutation - corrected variable names
const UPLOAD_FILE = gql`
  mutation UploadFile($files: [Upload]!, $filetype: FileTypeEnum!) {
    upload(files: $files, filetype: $filetype) {
      baseUrl
      data
      success
    }
  }
`;


interface BasicInformationFormProps {
  onSaveNext: () => void;
}

export const AdvanceInformationForm = ({ onSaveNext }: BasicInformationFormProps) => {
  // State to store uploaded image URLs
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState<string>("");
  const [secondaryThumbnailUrl, setSecondaryThumbnailUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to handle file upload
  const handleFileUpload = async (file: File, setImageUrl: (url: string) => void) => {
    try {
      setIsUploading(true);
      setError(null);
      
      // Call the mutation with the File object directly and RESOURCE as filetype
      const { data, errors } = await apolloClient.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          files: [file],  // Wrap file in array
          filetype: 'RESOURCE'
        },        
        context: {
          includeAuth: true // Include auth token
        },
        fetchPolicy: 'no-cache' // Force network request
      });
      
      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "Error uploading file");
      }
      
      if (data?.upload?.success) {
        // Set the returned URL in state
        setImageUrl(data.upload.baseUrl);
        console.log("File uploaded successfully:", data.upload.baseUrl);
        toast.success("Image uploaded successfully!");
      } else {
        console.error("Upload failed:", data);
        throw new Error("Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      
      if (err instanceof Error) {
        setError(err);
        toast.error(err.message || "Failed to upload image");
      } else {
        setError(new Error("An unexpected error occurred"));
        toast.error("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handler for primary thumbnail
  const handlePrimaryThumbnailUpload = (file: File) => {
    handleFileUpload(file, setCourseThumbnailUrl);
  };
  
  // Handler for secondary thumbnail
  const handleSecondaryThumbnailUpload = (file: File) => {
    handleFileUpload(file, setSecondaryThumbnailUrl);
  };

  return (
    <section className="space-y-10">
      <FormHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Course Thumbnails with upload handlers */}
        <CourseThumbnailUploader 
          onFileSelect={handlePrimaryThumbnailUpload} 
          isUploading={isUploading} 
        />
        <CourseThumbnailUploader 
          onFileSelect={handleSecondaryThumbnailUpload}
          isUploading={isUploading}
        />
      </div>
      <CourseDescriptionEditor />
      <CourseObjectivesInput title="What you will teach in this course" />
      <CourseObjectivesInput title="Target Audience" />
      <CourseObjectivesInput title="Course requirements" />
    </section>
  );
}
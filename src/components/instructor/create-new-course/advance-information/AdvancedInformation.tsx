"use client";

import { MouseEvent, useState } from "react";
import dynamic from "next/dynamic";
import FormHeader from "../../layout/FormHeader";
import { uploadFile } from "@/services/fileUploadService";
import { useCourseInfoUpdate } from "@/services/useCourseInfoUpdate";
import { toast } from "react-hot-toast";
import CourseObjectivesInput from "./components/CourseObjectivesInput";
import CourseThumbnailUploader from "./components/CourseThumbnailUploader";
import { BasicInformationFormProps, CourseInfo } from "@/lib/types";
// Dynamically import CourseDescriptionEditor with SSR disabled
const CourseDescriptionEditor = dynamic(() => import("./components/CourseDescriptionEditor"), {
  ssr: false,
});

export const AdvanceInformationForm = ({ onSaveNext, courseId}: BasicInformationFormProps) => {
  // State to store all course information
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    courseThumbnail: "",
    secondaryThumbnail: "",
    courseDescription: "",
    teachingPoints: ["", "", "", ""],
    targetAudience: ["", "", "", ""],
    courseRequirements: ["", "", "", ""]
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use the course update hook
  const { updateCourseInfo, loading: mutationLoading, error: mutationError } = useCourseInfoUpdate();
  
  // Handler for primary thumbnail
  const handlePrimaryThumbnailUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'RESOURCE');
      if (url) {
        setCourseInfo(prev => ({ ...prev, courseThumbnail: url }));
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
        setCourseInfo(prev => ({ ...prev, secondaryThumbnail: url }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for course description
  const handleDescriptionChange = (content: string) => {
    setCourseInfo(prev => ({ ...prev, courseDescription: content }));
  };

  // Handler for teaching points
  const handleTeachingPointsChange = (points: string[]) => {
    setCourseInfo(prev => ({ ...prev, teachingPoints: points }));
  };

  // Handler for target audience
  const handleTargetAudienceChange = (audience: string[]) => {
    setCourseInfo(prev => ({ ...prev, targetAudience: audience }));
  };

  // Handler for course requirements
  const handleRequirementsChange = (requirements: string[]) => {
    setCourseInfo(prev => ({ ...prev, courseRequirements: requirements }));
  };

  async function handleCourseUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filter out empty strings and prepare arrays
      const teachingPointsArray = courseInfo.teachingPoints.filter(point => point.trim() !== '');
      const targetAudienceArray = courseInfo.targetAudience.filter(item => item.trim() !== '');
      const courseRequirementsArray = courseInfo.courseRequirements.filter(req => req.trim() !== '');
      
      courseId = Number(courseId)
      // Prepare mutation variables
      const mutationVariables = {
        courseId,
        courseThumbnail: courseInfo.courseThumbnail,
        teachingPoints: teachingPointsArray,
        targetAudience: targetAudienceArray,
        courseRequirements: courseRequirementsArray,
        description: courseInfo.courseDescription // Changed from courseDescription to description
      };
      
      console.log("Sending data to backend:", mutationVariables);
      
      // Call the mutation
      const result = await updateCourseInfo(mutationVariables);
      
      if (result.updateCourseInfo.success) {
        toast.success("Course information updated successfully!");
        onSaveNext();
      } else {
        toast.error(result.updateCourseInfo.message || "Failed to update course information");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <FormHeader title="Advanced Information" handleCourseCreation={handleCourseUpdate} loading={loading} />
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-8 gap-4">
        {/* Course Thumbnails with upload handlers */}
        <CourseThumbnailUploader 
          onFileSelect={handlePrimaryThumbnailUpload} 
          isUploading={isUploading} 
          imageUrl={courseInfo.courseThumbnail}
        />
        <CourseThumbnailUploader 
          onFileSelect={handleSecondaryThumbnailUpload}
          isUploading={isUploading}
          imageUrl={courseInfo.secondaryThumbnail}
        />
      </div>
      <CourseDescriptionEditor 
        value={courseInfo.courseDescription}
        onChange={handleDescriptionChange}
      />
      <CourseObjectivesInput 
        title="What you will teach in this course"
        objectives={courseInfo.teachingPoints}
        onObjectivesChange={handleTeachingPointsChange}
      />
      <CourseObjectivesInput 
        title="Target Audience" 
        objectives={courseInfo.targetAudience}
        onObjectivesChange={handleTargetAudienceChange}
      />
      <CourseObjectivesInput 
        title="Course requirements" 
        objectives={courseInfo.courseRequirements}
        onObjectivesChange={handleRequirementsChange}
      />
      <div className="flex items-center justify-between">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
        <button className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100">
          Cancel
        </button>
        <button 
          className="bg-[#2E2C6F] text-white font-medium text-sm px-6 py-2 rounded-md hover:bg-[#25235a]"
          onClick={handleCourseUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Next"}
        </button>
      </div>
    </div>
    </section>
  );
}
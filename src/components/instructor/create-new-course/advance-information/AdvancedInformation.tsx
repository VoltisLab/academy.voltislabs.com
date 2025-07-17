"use client";

import { MouseEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FormHeader from "../../layout/FormHeader";
import { uploadFile } from "@/services/fileUploadService";
import { useCourseInfoUpdate } from "@/services/useCourseInfoUpdate";
import { toast } from "react-hot-toast";
import CourseObjectivesInput from "./components/CourseObjectivesInput";
import CourseThumbnailUploader from "./components/CourseThumbnailUploader";
import { BasicInformationFormProps, CourseInfo } from "@/lib/types";
import { useCoursesData } from "@/services/useCourseDataService";
import { useSearchParams } from "next/navigation";

// Dynamically import CourseDescriptionEditor with SSR disabled
const CourseDescriptionEditor = dynamic(
  () => import("./components/CourseDescriptionEditor"),
  {
    ssr: false,
  }
);

export const AdvanceInformationForm = ({
  onSaveNext,
  courseId,
}: BasicInformationFormProps) => {
      const searchParams = useSearchParams();

  // State to store all course information
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    courseThumbnail: "",
    secondaryThumbnail: "",
    courseDescription: "",
    teachingPoints: ["", "", "", ""],
    targetAudience: ["", "", "", ""],
    courseRequirements: ["", "", "", ""],
  });
  const [isUploading1, setIsUploading1] = useState<boolean>(false);
  const [isUploading2, setIsUploading2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    courseThumbnail: "",
    courseDescription: "",
  });

  const {fetchInstructorCourses} = useCoursesData()

  const title = searchParams?.get("edit")

useEffect(() => {
  const fetchCourse = async() => {
    if(title?.trim()){
      const data =await fetchInstructorCourses({searchValue: title })
      const result = data?.instructorCourses[0]
      if (result) {
        setCourseInfo({
        courseThumbnail: result?.banner?.thumbnail ?? "",
        secondaryThumbnail: result?.banner?.url ?? "",
        courseDescription: result?.description?.replace(/<[^>]+>/g, '')  ?? "",
        teachingPoints: result?.teachingPoints ?? ["", "", "", ""],
        targetAudience: result?.targetAudience ?? ["", "", "", ""],
        courseRequirements: result?.requirements ?? ["", "", "", ""],
        });
      }
      console.log("sssssss", data?.instructorCourses[0]);
    }

  }

  fetchCourse()
},[])









  // Use the course update hook
  const {
    updateCourseInfo,
    loading: mutationLoading,
    error: mutationError,
  } = useCourseInfoUpdate();

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      courseThumbnail: "",
      courseDescription: "",
    };

    let isValid = true;

    if (!courseInfo.courseThumbnail) {
      newErrors.courseThumbnail = "Course thumbnail is required";
      isValid = false;
    }

    if (
      !courseInfo.courseDescription ||
      courseInfo.courseDescription.trim() === "<p></p>"
    ) {
      newErrors.courseDescription = "Course description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handler for primary thumbnail
  const handlePrimaryThumbnailUpload = async (file: File) => {
    try {
      setIsUploading1(true);
      const url = await uploadFile(file, "RESOURCE");

      if (url) {
        setCourseInfo((prev) => ({ ...prev, courseThumbnail: url }));
        setErrors((prev) => ({ ...prev, courseThumbnail: "" }));
      }
    } finally {
      setIsUploading1(false);
    }
  };

  // Handler for secondary thumbnail
  const handleSecondaryThumbnailUpload = async (file: File) => {
    try {
      setIsUploading2(true);
      const url = await uploadFile(file, "RESOURCE");
      if (url) {
        setCourseInfo((prev) => ({ ...prev, secondaryThumbnail: url }));
      }
    } finally {
      setIsUploading2(false);
    }
  };

  // Handler for course description
  const handleDescriptionChange = (content: string) => {
    setCourseInfo((prev) => ({ ...prev, courseDescription: content }));
    if (content && content.trim() !== "<p></p>") {
      setErrors((prev) => ({ ...prev, courseDescription: "" }));
    }
  };

  // Handler for teaching points
  const handleTeachingPointsChange = (points: string[]) => {
    setCourseInfo((prev) => ({ ...prev, teachingPoints: points }));
  };

  // Handler for target audience
  const handleTargetAudienceChange = (audience: string[]) => {
    setCourseInfo((prev) => ({ ...prev, targetAudience: audience }));
  };

  // Handler for course requirements
  const handleRequirementsChange = (requirements: string[]) => {
    setCourseInfo((prev) => ({ ...prev, courseRequirements: requirements }));
  };

  async function handleCourseUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("There are some required fields you might need to fill");
      return;
    }

    setLoading(true);

    try {
      // Filter out empty strings and prepare arrays
      const teachingPointsArray = courseInfo.teachingPoints.filter(
        (point) => point.trim() !== ""
      );
      const targetAudienceArray = courseInfo.targetAudience.filter(
        (item) => item.trim() !== ""
      );
      const courseRequirementsArray = courseInfo.courseRequirements.filter(
        (req) => req.trim() !== ""
      );

      courseId = Number(courseId);
      // Prepare mutation variables - banner as object with thumbnail and url
      const mutationVariables = {
        courseId,
        banner: {
          thumbnail: courseInfo.courseThumbnail,
          url: courseInfo.secondaryThumbnail || courseInfo.courseThumbnail,
        },
        teachingPoints: teachingPointsArray,
        targetAudience: targetAudienceArray,
        requirements: courseRequirementsArray,
        description: courseInfo.courseDescription,
      };

      console.log("Sending data to backend:", mutationVariables);

      // Call the mutation
      const result = await updateCourseInfo(mutationVariables);

      if (result.updateCourse.success) {
        toast.success("Course information updated successfully!");
        onSaveNext();
      } else {
        toast.error(
          result.updateCourse.message || "Failed to update course information"
        );
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <FormHeader
        title="Advanced Information"
        handleCourseCreation={handleCourseUpdate}
        loading={loading}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-8 gap-4">
        {/* Course Thumbnails with upload handlers */}
        <div>
          <CourseThumbnailUploader
            onFileSelect={handlePrimaryThumbnailUpload}
            isUploading={isUploading1}
            imageUrl={courseInfo.courseThumbnail}
            required
          />
          {errors.courseThumbnail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.courseThumbnail}
            </p>
          )}
        </div>
        <CourseThumbnailUploader
          onFileSelect={handleSecondaryThumbnailUpload}
          isUploading={isUploading2}
          imageUrl={courseInfo.secondaryThumbnail}
        />
      </div>
      <div>
        <CourseDescriptionEditor
          value={courseInfo.courseDescription}
          onChange={handleDescriptionChange}
        />
        {errors.courseDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.courseDescription}
          </p>
        )}
      </div>
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
};

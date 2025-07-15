"use client";
import StudentCoursePreview from "@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentCoursePreview";
import QuizPreview from "@/components/instructor/create-new-course/curriculum/components/quiz/QuizPreview";
import AssignmentPreview from "@/components/instructor/create-new-course/curriculum/components/assignment/AssignmentPreview";
import CodingExercisePreview from "@/components/instructor/create-new-course/curriculum/components/code/CodingExercisePreview";
import { useParams, useRouter } from "next/navigation";
import { useSectionService } from "@/services/useSectionService";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { CourseSection } from "@/api/course/section/queries";
import {
  AssignmentProvider,
  useAssignment,
} from "@/context/AssignmentDataContext";
import { useAssignmentService } from "@/services/useAssignmentService";
import { usePreviewContext } from "@/app/preview/layout";

const Preview = () => {
  const params = useParams();
  const router = useRouter();

  // Safely extract params, handling possible array values
  const type = Array.isArray(params?.type)
    ? params.type[0]
    : params?.type ?? "";
  const courseId = Array.isArray(params?.courseId)
    ? params.courseId[0]
    : params?.courseId ?? "";
  const sectionId = Array.isArray(params?.sectionId)
    ? params.sectionId[0]
    : params?.sectionId ?? "";
  const itemId = Array.isArray(params?.itemId)
    ? params.itemId[0]
    : params?.itemId ?? "";

  const { getCourseSections, loading, error } = useSectionService();
  const [sections, setSections] = useState<CourseSection[] | null>(null);

  const { assignmentData, setAssignmentData } = useAssignment();
  const { getAssignment } = useAssignmentService();
  const fetchAssignment = useCallback(async () => {
    if (!itemId) return;
    try {
      const data = await getAssignment({ id: Number(itemId) });
      console.log("data", data);
      setAssignmentData({
        id: data?.id,
        attachedFiles: [],
        contentType: "assignment",
        isExpanded: false,
        title: data?.title,
        description: data?.description,
        estimatedDuration: data?.estimatedDurationMinutes,
        durationUnit: "minutes",
        instructionalVideo: data?.instructionVideo,
        instructionalResource: data?.instructionDownloadableResource,
        instructions: data?.instructions,
        assignmentQuestions: data?.questions,
        maxPoints: data?.maxPoints,
        solutionVideo: data?.solutionVideo,
        solutionResource: data?.solutionDownloadableResource,
        dueDate: data?.dueDate,
        createdAt: data?.createdAt,
        isPublished: data?.isPublished,
      });
    } catch (err) {}
  }, [getAssignment, itemId, setAssignmentData]);

  useEffect(() => {
    if (type !== "assignment") return;
    if (itemId) fetchAssignment();
  }, [itemId]);

  useEffect(() => {
    const fetchSections = async () => {
      if (courseId) {
        try {
          const data = await getCourseSections({
            id: parseInt(courseId as string),
          });

          console.log("data", data);
          setSections(data.courseSections);
        } catch (err) {
          console.error("Failed to fetch sections:", err);
        }
      }
    };
    fetchSections();
  }, [courseId]);

  // Find the current section

  const currentSection = sections?.find(
    (s) => String(s.id) === String(sectionId)
  ) || {
    id: "",
    title: "",
    lectures: [],
    quiz: [],
    assignment: [],
    codingExercises: [],
    practiceSet: [],
  };

  // console.log("Current Section:", currentSection);

  // Prepare sidebar sections structure
  const sidebarSections = (sections ?? []).map((section) => ({
    id: section.id || "",
    name: section.title || "",
    lectures: (section.lectures as any[]) || [],
    quizzes: (section.quiz as any[]) || [],
    assignments: (section.assignment as any[]) || [],
    codingExercises: (section.codingExercises as any[]) || [],
    isExpanded: false,
  }));

  // Sidebar click handler
  const handleSidebarClick = (
    itemType: string,
    courseId: string,
    sectionId: string,
    itemId: string
  ) => {
    router.push(`/preview/${itemType}/${courseId}/${sectionId}/${itemId}`);
  };

  // Find the item based on type
  let currentItem: any = null;
  let previewComponent: React.ReactNode = null;

  if (type === "lecture") {
    currentItem = currentSection.lectures?.find(
      (l: any) => String(l.id) === String(itemId)
    );
    // Prepare resources for the current lecture
    const uploadedFiles = (currentItem?.resources || [])
      .filter((r: any) => r.type === "DOWNLOADABLE_FILES")
      .map((r: any) => ({
        name: r.title,
        size: "",
        lectureId: currentItem.id || "",
      }));
    const sourceCodeFiles = (currentItem?.resources || [])
      .filter((r: any) => r.type === "SOURCE_CODE")
      .map((r: any) => ({
        name: r.title,
        url: r.url,
        lectureId: currentItem.id || "",
      }));
    const externalResources = (currentItem?.resources || [])
      .filter((r: any) => r.type === "EXTERNAL_RESOURCES")
      .map((r: any) => ({
        title: r.title,
        name: r.title,
        url: r.url,
        lectureId: currentItem.id || "",
      }));
    const isVideoLecture =
      !!currentItem?.videoUrl && currentItem.videoUrl.trim() !== "";
    const videoContent = {
      selectedVideoDetails: isVideoLecture
        ? {
            id: currentItem.id || "",
            url: currentItem.videoUrl,
            filename: currentItem.title || "Lecture Video",
            thumbnailUrl: "",
            isDownloadable: false,
            duration: currentItem.duration ? String(currentItem.duration) : "",
          }
        : null,
      uploadTab: { selectedFile: null },
      libraryTab: { searchQuery: "", selectedVideo: null, videos: [] },
      activeTab: "uploadVideo",
    };
    const extendedLecture = {
      attachedFiles: [],
      videos: [],
      contentType: isVideoLecture ? "video" : "article",
      isExpanded: false,
      assignmentTitle: "",
      assignmentDescription: "",
      estimatedDuration: 0,
      durationUnit: "minutes" as "minutes",
      instructions: "",
      assignmentQuestions: [],
      isPublished: false,
      ...currentItem,
      duration: currentItem?.duration ? String(currentItem.duration) : "",
    };
    // Type guard for notes
    const hasNotes = (lecture: any): lecture is { notes: string } =>
      typeof lecture?.notes === "string";
    const articleText = !isVideoLecture
      ? hasNotes(currentItem)
        ? currentItem.notes
        : currentItem?.description || ""
      : "";
    previewComponent = (
      // <AssignmentProvider initialData={extendedLecture}>
      <StudentCoursePreview
        courseId={courseId}
        activeItem={currentItem}
        videoContent={
          isVideoLecture
            ? videoContent
            : { ...videoContent, selectedVideoDetails: null }
        }
        setShowVideoPreview={() => {}}
        uploadedFiles={uploadedFiles}
        sourceCodeFiles={sourceCodeFiles}
        externalResources={externalResources}
        section={{
          id: currentSection.id || "",
          name: currentSection.title || "",
          sections: sidebarSections,
          lectures: currentSection.lectures as any[],
          quizzes: (currentSection.quiz as any[]) || [],
          assignments: (currentSection.assignment as any[]) || [],
          codingExercises: (currentSection.codingExercises as any[]) || [],
        }}
        articleContent={{ text: articleText }}
      />
      // </AssignmentProvider>
    );
  } else if (type === "quiz") {
    let quizItem = currentSection.quiz?.find(
      (q: any) => String(q.id) === String(itemId)
    );
    let quizForPreview = undefined;
    if (quizItem) {
      quizForPreview = {
        id: quizItem.id || "",
        title:
          "name" in quizItem &&
          typeof quizItem.name === "string" &&
          quizItem.name
            ? quizItem.name
            : quizItem.title,
        description: quizItem.description || "",
        questions: Array.isArray(quizItem.questions)
          ? quizItem.questions.map((q: any) => ({
              id: q.id || "",
              text: q.text || q.name || "",
              answerChoices: Array.isArray(q.answerChoices)
                ? q.answerChoices.map((a: any) => ({
                    id: a.id || a.order || 0,
                    text: a.text || "",
                    order: a.order || 0,
                    isCorrect: !!a.isCorrect,
                    explanation: a.explanation || "",
                  }))
                : [],
              orders: q.orders || [],
              relatedLecture: q.relatedLecture
                ? {
                    id: q.relatedLecture.id || 0,
                    title: q.relatedLecture.title || "",
                    videoUrl: q.relatedLecture.videoUrl || "",
                    notes: q.relatedLecture.notes || "",
                    description: q.relatedLecture.description || "",
                  }
                : undefined,
              type: q.type || "multiple-choice",
            }))
          : [],
      };
    } else {
      quizForPreview = {
        id: "",
        title: "Quiz",
        description: "",
        questions: [],
      };
    }
    const emptyVideoContent = {
      uploadTab: { selectedFile: null },
      libraryTab: { searchQuery: "", selectedVideo: null, videos: [] },
      activeTab: "uploadVideo",
      selectedVideoDetails: null,
    };
    previewComponent = (
      <StudentCoursePreview
        courseId={courseId}
        activeItem={quizForPreview}
        videoContent={emptyVideoContent}
        setShowVideoPreview={() => {}}
        section={{
          id: currentSection.id || "",
          name: currentSection.title || "",
          sections: sidebarSections,
          lectures: currentSection.lectures as any[],
          quizzes: (currentSection.quiz as any[]) || [],
          assignments: (currentSection.assignment as any[]) || [],
          codingExercises: (currentSection.codingExercises as any[]) || [],
        }}
        articleContent={{ text: "" }}
      />
    );
  } else if (type === "assignment") {
    previewComponent = (
      <AssignmentPreview
        assignmentData={assignmentData}
        // expandedView={expandedView}
        // toggleExpandedView={toggleExpandedView}
      />
    );
  } else if (type === "coding-exercise") {
    currentItem = currentSection.codingExercises?.find(
      (c: any) => String(c.id) === String(itemId)
    );
    const emptyVideoContent = {
      uploadTab: { selectedFile: null },
      libraryTab: { searchQuery: "", selectedVideo: null, videos: [] },
      activeTab: "uploadVideo",
      selectedVideoDetails: null,
    };
    previewComponent = (
      <StudentCoursePreview
        courseId={courseId}
        activeItem={currentItem}
        videoContent={emptyVideoContent}
        setShowVideoPreview={() => {}}
        section={{
          id: currentSection.id || "",
          name: currentSection.title || "",
          sections: sidebarSections,
          lectures: currentSection.lectures as any[],
          quizzes: (currentSection.quiz as any[]) || [],
          assignments: (currentSection.assignment as any[]) || [],
          codingExercises: (currentSection.codingExercises as any[]) || [],
        }}
        articleContent={{ text: "" }}
      />
    );
  } else {
    previewComponent = (
      <div className="text-center py-10">Invalid preview type.</div>
    );
  }

  return <div className="bg-white">{previewComponent}</div>;
};

export default Preview;

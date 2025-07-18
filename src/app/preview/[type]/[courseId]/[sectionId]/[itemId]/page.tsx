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
import ReportAbuseModal from "@/components/instructor/create-new-course/curriculum/components/lecture/modals/ReportAbuseModal";
import LearningReminderModal from "@/components/instructor/create-new-course/curriculum/components/lecture/modals/LearningReminderModal";
import { ArrowBigLeft, ArrowLeft, X } from "lucide-react";
import { usePreviewContext } from "@/context/PreviewContext";
import ContentInformationDisplay from "@/components/instructor/create-new-course/curriculum/components/lecture/components/ContentInformationDisplay";
// import { usePreviewContext } from "@/app/preview/layout";

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
  const {
    setShowQuizShortcut,
    setShowVideoShortcut,
    showQuizShortcut,
    showVideoShortcut,
    expandedView,
    toggleExpandedView,
  } = usePreviewContext();
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
      <StudentCoursePreview
        videoContent={
          isVideoLecture
            ? videoContent
            : { ...videoContent, selectedVideoDetails: null }
        }
        setShowVideoPreview={() => {}}
        lecture={currentItem}
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
    );
  } else if (type === "quiz") {
    let quizItem = currentSection.quiz?.find(
      (q: any) => String(q.id) === String(itemId)
    );
    // Ensure the quiz object has the correct structure and fallback for missing questions
    console.log("Quiz Item:", quizItem);
    const quizIndex = currentSection.quiz?.findIndex(
      (q: any) => String(q.id) === String(itemId)
    );
    let quizForPreview = undefined;
    if (quizItem) {
      quizForPreview = {
        id: quizItem.id || "",
        title: quizItem.title || "Quiz",
        description: quizItem.description || "",
        questions: Array.isArray(quizItem.questions)
          ? quizItem.questions.map((q: any) => ({
              id: q.id || "",
              text: q.text || "",
              answerChoices: Array.isArray(q.answerChoices)
                ? q.answerChoices
                : [],
              orders: q.orders || [],
              relatedLecture: q.relatedLecture || null,
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
    previewComponent = (
      <QuizPreview quiz={quizForPreview} quizIndex={quizIndex + 1} />
    );
  } else if (type === "assignment") {
    previewComponent = <AssignmentPreview assignmentData={assignmentData} />;
  } else if (type === "coding-exercise") {
    currentItem = currentSection.codingExercises?.find(
      (c: any) => String(c.id) === String(itemId)
    );
    // Map currentItem to CodingExercisePreviewData structure
    const codingExercisePreviewData = currentItem
      ? {
          exercise: {
            id: currentItem.id || "",
            title: currentItem.title || "Coding Exercise",
            language: currentItem.language || "javascript",
            version: currentItem.version || "",
            learningObjective: currentItem.learningObjective || "",
            contentType: "coding-exercise" as const,
          },
          content: {
            instructions: currentItem.instructions || "",
            hints: currentItem.hints || "",
            solutionExplanation: currentItem.solutionExplanation || "",
            files: currentItem.files || [],
            solutionCode: currentItem.solutionCode || "",
            testCode: currentItem.testCode || "",
          },
          testResults: currentItem.testResults || null,
        }
      : {
          exercise: {
            id: "",
            title: "Coding Exercise",
            language: "javascript",
            version: "",
            learningObjective: "",
            contentType: "coding-exercise" as const,
          },
          content: {
            instructions: "",
            hints: "",
            solutionExplanation: "",
            files: [],
            solutionCode: "",
            testCode: "",
          },
          testResults: null,
        };
    previewComponent = (
      <CodingExercisePreview
        data={codingExercisePreviewData}
        onClose={() => {}}
      />
    );
  } else {
    previewComponent = (
      <div className="text-center py-10">Invalid preview type.</div>
    );
  }

  return (
    <div className="bg-white relative">
      {showQuizShortcut ? (
        <div className="bg-black h-[70vh] flex items-center justify-center p-8">
          <button
            onClick={() => setShowQuizShortcut(false)}
            className="absolute top-8 right-[500px] text-white hover:text-white focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="bg-black text-white rounded-lg p-5 h-full max-w-2xl relative text-center justify-center items-center flex flex-col gap-20">
            <div className="flex items-center mb-6 text-center">
              <h2 className="text-2xl font-bold text-center">
                Keyboard shortcuts
              </h2>
              <span className="ml-2 text-white bg-gray-700 px-2">?</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-10">
                <span>Select answer 1-9</span>
                <div className="flex space-x-1">
                  <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono min-w-[24px] text-center">
                    1-9
                  </kbd>
                </div>
              </div>

              <div className="flex items-center justify-between gap-10">
                <span>Check answer / Next question</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                  →
                </kbd>
              </div>

              <div className="flex items-center justify-between gap-10">
                <span>Skip question</span>
                <div className="flex items-center space-x-1">
                  <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                    Shift
                  </kbd>
                  <span className="text-gray-400">+</span>
                  <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                    →
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showVideoShortcut ? (
        <div className="bg-black h-[70vh] flex items-center justify-center p-8">
          <div className="bg-black text-white rounded-lg p-6 max-w-2xl w-full mx-4 relative border border-gray-700">
            <button
              onClick={() => setShowVideoShortcut(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center mb-6">
              <h2 className="text-xl font-semibold">Keyboard shortcuts</h2>
              <span className="ml-2 text-gray-400">?</span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { action: "Play / pause", key: "Space" },
                { action: "Go back 5s", key: "←" },
                { action: "Go forward 5s", key: "→" },
                { action: "Speed slower", key: "Shift + ←" },
                { action: "Speed faster", key: "Shift + →" },
                { action: "Volume up", key: "↑" },
                { action: "Volume down", key: "↓" },
                { action: "Mute", key: "M" },
                { action: "Fullscreen", key: "F" },
                { action: "Exit fullscreen", key: "ESC" },
                { action: "Add note", key: "B" },
                { action: "Toggle captions", key: "C" },
                { action: "Content information", key: "I" },
              ].map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{shortcut.action}</span>
                  <kbd className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono min-w-[60px] text-center">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-y-auto">{previewComponent}</div>
      )}
      {/* Modals */}
      {/* <LearningReminderModal
        isOpen={showLearningModal}
        onClose={() => setShowLearningModal(false)}
      /> */}
      {expandedView && (
        <button
          onClick={() => toggleExpandedView()}
          className="absolute right-0 top-1/2 -translate-y-full px-4 py-2 flex gap-3 items-center rounded-l-md translate-x-31 duration-500 hover:translate-x-0 text-white bg-[#6d28d2] text-sm font-bold"
        >
          <ArrowLeft />
          <span>Course content</span>
        </button>
      )}
    </div>
  );
};

export default Preview;

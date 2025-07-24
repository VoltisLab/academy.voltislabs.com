"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSectionService } from "@/services/useSectionService";
import { useParams, useRouter } from "next/navigation";
import StudentPreviewSidebar from "@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentPreviewSidebar";
import { AssignmentProvider } from "@/context/AssignmentDataContext";
import { PreviewProvider, usePreviewContext } from "@/context/PreviewContext";
import LearningReminderModal from "@/components/instructor/create-new-course/curriculum/components/lecture/modals/LearningReminderModal";
import PreviewHeader from "@/components/instructor/create-new-course/curriculum/components/lecture/components/PreviewHeader";
import { ProgressProvider } from "@/context/ProgressContext";
import { VideoProgressProvider } from "./VideoProgressContext";
import NotesManager from "./NoteManager";  // <--- New file/component

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const courseId = (params as any)?.courseId?.toString();
  const { getCourseSections } = useSectionService();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const itemId = (params as any)?.itemId?.toString();

  const [showLearningModal, setShowLearningModal] = useState(false);

  // --- Section fetching ---
  useEffect(() => {
    const fetchSections = async () => {
      if (courseId) {
        try {
          const data = await getCourseSections({
            id: parseInt(courseId as string),
          });
          setSections(data.courseSections || []);
        } catch (err) {
          setSections([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSections();
    // eslint-disable-next-line
  }, [courseId]);

  const sidebarSections = useMemo(
    () =>
      sections.map((section) => ({
        id: section.id || "",
        name: section.title || "",
        lectures: section.lectures || [],
        quizzes: section.quiz || [],
        assignments: section.assignment || [],
        codingExercises: section.codingExercises || [],
        isExpanded: true,
      })),
    [sections]
  );

  const { expandedView, parentRef } = usePreviewContext();

  // Sidebar navigation handler
  const handleSidebarClick = (
    itemId: string,
    itemType: string,
    sectionId?: string
  ) => {
    if (!itemId || !itemType) return;
    let foundSectionId = sectionId;
    if (!foundSectionId && sidebarSections.length > 0) {
      for (const section of sidebarSections) {
        if (
          section.lectures.some((l: any) => l.id === itemId) ||
          section.quizzes.some((q: any) => q.id === itemId) ||
          section.assignments.some((a: any) => a.id === itemId) ||
          section.codingExercises.some((c: any) => c.id === itemId)
        ) {
          foundSectionId = section.id;
          break;
        }
      }
    }
    if (courseId && foundSectionId && itemId && itemType) {
      window.location.href = `/preview/${itemType}/${courseId}/${foundSectionId}/${itemId}`;
    }
  };

  return (
    <AssignmentProvider>
      <ProgressProvider>
        <VideoProgressProvider>
          <PreviewHeader title={sections[0]?.course?.title} />
          <div className="flex flex-row w-full bg-white">
            {/* Main preview window and bottom tabs (scrollable as a unit) */}
            <div
              ref={parentRef}
              className={`flex flex-col overflow-y-auto ${
                expandedView ? "w-full" : "w-[76vw]"
              }`}
            >
              {children}
              {/* NotesManager handles all notes logic and UI */}
              <NotesManager
                itemId={itemId}
                expandedView={expandedView}
                onOpenLearningModal={() => setShowLearningModal(true)}
              />
              <LearningReminderModal
                isOpen={showLearningModal}
                onClose={() => setShowLearningModal(false)}
              />
            </div>
            {/* Sidebar on the right, fixed width, scrollable */}
            <div
              className={`border-l border-gray-200 overflow-y-auto ${
                expandedView ? "w-0" : "w-[24vw]"
              }`}
            >
              <StudentPreviewSidebar
                currentLectureId={itemId}
                setShowVideoPreview={() => {}}
                sections={sidebarSections}
                onSelectItem={handleSidebarClick}
              />
            </div>
          </div>
        </VideoProgressProvider>
      </ProgressProvider>
    </AssignmentProvider>
  );
}

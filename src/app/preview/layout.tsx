'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useSectionService } from "@/services/useSectionService";
import { useParams } from "next/navigation";
import StudentPreviewSidebar from "@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentPreviewSidebar";
import BottomTabsContainer from "@/components/instructor/create-new-course/curriculum/components/lecture/components/BottomTabsContainer";
import { useRouter } from "next/navigation";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = (params as any)?.courseId?.toString();
  const { getCourseSections } = useSectionService();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const itemId = (params as any)?.itemId?.toString();

  // Bottom tabs state
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "announcements" | "reviews" | "learning-tools">("overview");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      if (courseId) {
        try {
          const data = await getCourseSections({ id: parseInt(courseId as string) });
          setSections(data.courseSections || []);
        } catch (err) {
          setSections([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSections();
  }, [courseId]);

  // Prepare sidebar sections structure with isExpanded: true by default
  const sidebarSections = useMemo(() => sections.map((section) => {
    // Map lectures, quizzes, assignments, codingExercises to unified contentItems array
    const lectures = (section.lectures || []).map((l: any) => ({
      id: l.id,
      name: l.title || l.name || "Lecture",
      type: "lecture",
      duration: l.duration,
      isCompleted: l.isCompleted,
      isActive: false,
    }));
    const quizzes = (section.quiz || []).map((q: any) => ({
      id: q.id,
      name: q.title || q.name || "Quiz",
      type: "quiz",
      duration: q.duration,
      isCompleted: q.isCompleted,
      isActive: false,
    }));
    const assignments = (section.assignment || []).map((a: any) => ({
      id: a.id,
      name: a.title || a.name || "Assignment",
      type: "assignment",
      duration: a.duration,
      isCompleted: a.isCompleted,
      isActive: false,
    }));
    const codingExercises = (section.codingExercises || []).map((c: any) => ({
      id: c.id,
      name: c.title || c.name || "Coding Exercise",
      type: "coding-exercise",
      duration: c.duration,
      isCompleted: c.isCompleted,
      isActive: false,
    }));
    return {
      id: section.id || "",
      name: section.title || "",
      contentItems: [
        ...lectures,
        ...quizzes,
        ...assignments,
        ...codingExercises,
      ],
      isExpanded: true,
    };
  }), [sections]);

  // Sidebar navigation handler
  const handleSidebarClick = (itemId: string, itemType: string, sectionId?: string) => {
    if (!itemId || !itemType) return;
    // Find the sectionId for the item if not provided
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
      router.push(`/preview/${itemType}/${courseId}/${foundSectionId}/${itemId}`);
    }
  };

  return (
    <div className="flex flex-row bg-white">
      {/* Main preview window and bottom tabs (scrollable as a unit) */}
      <div className="flex-1 flex flex-col  overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto" >
          {children}
          {/* Bottom tabs always visible */}
          <BottomTabsContainer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            isExpanded={false}
            selectedItemData={{}}
            activeItemType={"lecture"}
            progress={0}
            formatTime={() => ""}
            notes={[]}
            onCreateNote={() => {}}
            onSaveNote={() => {}}
            onCancelNote={() => {}}
            onEditNote={() => {}}
            onDeleteNote={() => {}}
            isAddingNote={false}
            currentNoteContent={""}
            setCurrentNoteContent={() => {}}
            selectedLectureFilter={""}
            setSelectedLectureFilter={() => {}}
            selectedSortOption={""}
            setSelectedSortOption={() => {}}
            getSortedNotes={() => []}
            onOpenLearningModal={() => {}}
            activeItemId={itemId}
          />
        </div>
      </div>
      {/* Sidebar on the right, fixed width, scrollable */}
      <div className="w-[24vw] border-l border-gray-200 overflow-y-auto flex-shrink-0">
        <StudentPreviewSidebar
          currentLectureId={itemId}
          setShowVideoPreview={() => {}}
          sections={sidebarSections}
          onSelectItem={handleSidebarClick}
        />
      </div>
    </div>
  );
} 
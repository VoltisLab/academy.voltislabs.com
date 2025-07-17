"use client";

import React, {
  useEffect,
  useState,
  useMemo,
} from "react";
import { useSectionService } from "@/services/useSectionService";
import { useParams } from "next/navigation";
import StudentPreviewSidebar from "@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentPreviewSidebar";
import BottomTabsContainer from "@/components/instructor/create-new-course/curriculum/components/lecture/components/BottomTabsContainer";
import { useRouter } from "next/navigation";
import { AssignmentProvider } from "@/context/AssignmentDataContext";
import { PreviewProvider, usePreviewContext } from "@/context/PreviewContext";
import LearningReminderModal from "@/components/instructor/create-new-course/curriculum/components/lecture/modals/LearningReminderModal";
import PreviewHeader from "@/components/instructor/create-new-course/curriculum/components/lecture/components/PreviewHeader";

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

  // Bottom tabs state
  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "announcements" | "reviews" | "learning-tools"
  >("overview");
  const [showSearch, setShowSearch] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);

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
  }, [courseId]);

  // Prepare sidebar sections structure with isExpanded: true by default
  const sidebarSections = useMemo(
    () =>
      sections.map((section) => {
        return {
          id: section.id || "",
          name: section.title || "",
          lectures: section.lectures || [],
          quizzes: section.quiz || [],
          assignments: section.assignment || [],
          codingExercises: section.codingExercises || [],
          isExpanded: true,
        };
      }),
    [sections]
  );

  // Sidebar navigation handler
  const handleSidebarClick = (
    itemId: string,
    itemType: string,
    sectionId?: string
  ) => {
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
      window.location.href = `/preview/${itemType}/${courseId}/${foundSectionId}/${itemId}`;
    }
  };

  // const [expandedView, setExpandedView] = useState(false);
  // const toggleExpandedView = () => setExpandedView(!expandedView);
  // const parentRef = useRef<HTMLDivElement>(null);

  const { expandedView, parentRef } = usePreviewContext();

  return (
    <AssignmentProvider>
      <PreviewHeader progress={75} completedText="3 of 4 complete." title={sections[0]?.course?.title}/>
      <div className="flex flex-row w-full bg-white">
        {/* Main preview window and bottom tabs (scrollable as a unit) */}
        <div
          ref={parentRef}
          className={`flex flex-col overflow-y-auto ${
            expandedView ? "w-full" : "w-[76vw]"
          }`}
        >
          {children}
          {/* Bottom tabs always visible */}
          <BottomTabsContainer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            isExpanded={expandedView}
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
            onOpenLearningModal={() => setShowLearningModal(true)}
            activeItemId={itemId}
          />
          {/* Learning Reminder Modal */}
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
    </AssignmentProvider>
  );
}

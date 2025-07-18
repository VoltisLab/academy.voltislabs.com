"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSectionService } from "@/services/useSectionService";
import { useParams, useRouter } from "next/navigation";
import StudentPreviewSidebar from "@/components/instructor/create-new-course/curriculum/components/lecture/components/StudentPreviewSidebar";
import BottomTabsContainer from "@/components/instructor/create-new-course/curriculum/components/lecture/components/BottomTabsContainer";
import { AssignmentProvider } from "@/context/AssignmentDataContext";
import { PreviewProvider, usePreviewContext } from "@/context/PreviewContext";
import LearningReminderModal from "@/components/instructor/create-new-course/curriculum/components/lecture/modals/LearningReminderModal";
import PreviewHeader from "@/components/instructor/create-new-course/curriculum/components/lecture/components/PreviewHeader";
import LectureVideoNoteContext from "@/services/LectureVideoNoteService";

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

  // --- Notes State ---
  const [notes, setNotes] = useState<any[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const {saveLectureVideoNote, fetchLectureNotes, updateLectureVideoNote, deleteLectureVideoNote} = LectureVideoNoteContext()

  // --- Notes Handlers ---
  const onCreateNote = () => {
    setIsAddingNote(true);
    setEditingNoteId(null);
    setCurrentNoteContent("");
  };

  const fetchNotes = async() => {
    const note = await fetchLectureNotes({ lectureId: Number(itemId) });
    setNotes(note)
  }
  useEffect(() => {

    fetchNotes()
  }, [])



  const onSaveNote = async () => {
  if (!currentNoteContent?.trim()) return;

  if (editingNoteId) {
    // --- Update note to backend ---
    const success = await updateLectureVideoNote({
      lectureVideoNoteId: Number(editingNoteId), // must be the backend ID!
      notes: currentNoteContent,
      setLoading, // optional
      // setError,   // optional
    });

    if (success) {
      fetchNotes(); // refresh notes list from backend
    }
  } else {
    // --- Save note to backend ---
    // Replace this with actual time logic from your player:
    const seconds = 21;
    const toIsoTime = (s:any) => {
      const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
      const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const secs = String(s % 60).padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    };

    const isoTime = toIsoTime(seconds);

    const noteFromServer = await saveLectureVideoNote({
      lectureId: Number(itemId),
      notes: currentNoteContent,
      time: isoTime,
      setLoading,
      // setError,
    });

    console.log(noteFromServer);
    if (noteFromServer) {
      
      fetchNotes();
    }
  }
  setCurrentNoteContent("");
  setIsAddingNote(false);
  setEditingNoteId(null);
};

  const onCancelNote = () => {
    setIsAddingNote(false);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };

  const onEditNote = (id: string) => {
    const note = notes?.find((n) => n.id === id);
    if (note) {
      setCurrentNoteContent(note.notes);
      setIsAddingNote(true);
      setEditingNoteId(id);
    }
  };

  const onDeleteNote = async (id: string) => {
  // Delete on backend first
  const res = await deleteLectureVideoNote({
    lectureVideoNoteId: Number(id), // This must be the backend ID!
    setLoading, // optional
    // setError, // optional
  });

  if (res?.success) {
    // Remove locally only if backend succeeded
    await fetchNotes()
    // Optionally: refetch notes for perfect sync
    // fetchNotes();
  } else {
    // Optionally: show error message (e.g., toast)
    // toast.error("Failed to delete note");
  }
};

  const getSortedNotes = () => {
    // Example: most recent first
    return [...notes].sort((a, b) => Number(b.id) - Number(a.id));
  };

  // --- Filter & Sort ---
  const [selectedLectureFilter, setSelectedLectureFilter] = useState("All lectures");
  const [selectedSortOption, setSelectedSortOption] = useState("Sort by most recent");

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

  const { expandedView, parentRef } = usePreviewContext();

  return (
    <AssignmentProvider>
      <PreviewHeader progress={75} completedText="3 of 4 complete." title={sections[0]?.course?.title}/>
      <div className="flex flex-row w-full bg-white">
        {/* Main preview window and bottom tabs (scrollable as a unit) */}
        <div
          ref={parentRef}
          className={`flex flex-col overflow-y-auto ${expandedView ? "w-full" : "w-[76vw]"}`}
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
            notes={notes}
            onCreateNote={onCreateNote}
            onSaveNote={onSaveNote}
            onCancelNote={onCancelNote}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
            isAddingNote={isAddingNote}
            currentNoteContent={currentNoteContent}
            setCurrentNoteContent={setCurrentNoteContent}
            selectedLectureFilter={selectedLectureFilter}
            setSelectedLectureFilter={setSelectedLectureFilter}
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            getSortedNotes={getSortedNotes}
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
          className={`border-l border-gray-200 overflow-y-auto ${expandedView ? "w-0" : "w-[24vw]"}`}
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

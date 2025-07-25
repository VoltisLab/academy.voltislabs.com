"use client";
import { useState, useEffect } from "react";
import BottomTabsContainer from "@/components/instructor/create-new-course/curriculum/components/lecture/components/BottomTabsContainer";
import LectureVideoNoteContext from "@/services/LectureVideoNoteService";
import { useVideoProgress } from "./VideoProgressContext";

// Add props you need from layout
export default function NotesManager({
  itemId,
  expandedView,
  onOpenLearningModal,
}: {
  itemId: string;
  expandedView: boolean;
  onOpenLearningModal: () => void;
}) {
  // Notes state and handlers
  const [notes, setNotes] = useState<any[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const {
    saveLectureVideoNote,
    fetchLectureNotes,
    updateLectureVideoNote,
    deleteLectureVideoNote,
  } = LectureVideoNoteContext();

  // Get video progress context at the top level
  const { videoState } = useVideoProgress();

  // Format seconds to "HH:MM:SS"
  const formatTime = (s: number) => {
    const hrs = String(Math.floor(s / 3600)).padStart(2, "0");
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const secs = String(Math.floor(s % 60)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "announcements" | "reviews" | "learning-tools"
  >("overview");
  const [showSearch, setShowSearch] = useState(false);

  // Filter & Sort
  const [selectedLectureFilter, setSelectedLectureFilter] =
    useState("All lectures");
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Sort by most recent"
  );

  const onCreateNote = () => {
    setIsAddingNote(true);
    setEditingNoteId(null);
    setCurrentNoteContent("");
  };

  const fetchNotes = async () => {
    const note = await fetchLectureNotes({ lectureId: Number(itemId), sortBy: selectedSortOption !== "Sort by most recent"? "OLDEST" : "MOST_RECENT" });
    setNotes(note);
  };

  console.log("notee===", notes)

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [itemId, selectedSortOption]);

  const onSaveNote = async () => {
    if (!currentNoteContent?.trim()) return;

    if (editingNoteId) {
      const success = await updateLectureVideoNote({
        lectureVideoNoteId: Number(editingNoteId),
        notes: currentNoteContent,
      });

      if (success) {
        fetchNotes();
      }
    } else {
      // SAFE: Called at top level in this child of VideoProgressProvider
      const seconds = Math.floor(videoState.progress);
      const isoTime = formatTime(seconds);

      const noteFromServer = await saveLectureVideoNote({
        lectureId: Number(itemId),
        notes: currentNoteContent,
        time: isoTime,
      });

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
    const res = await deleteLectureVideoNote({
      lectureVideoNoteId: Number(id),
    });

    if (res?.success) {
      await fetchNotes();
    }
  };

  const getSortedNotes = () => {
    return notes;
  };

  return (
    <BottomTabsContainer
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showSearch={showSearch}
      setShowSearch={setShowSearch}
      isExpanded={expandedView}
      selectedItemData={{}}
      activeItemType={"lecture"}
      progress={videoState.progress}
      formatTime={formatTime}
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
      onOpenLearningModal={onOpenLearningModal}
      activeItemId={itemId}
    />
  );
}

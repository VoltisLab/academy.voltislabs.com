import { DELETE_LECTURE_VIDEO_NOTE, SAVE_LECTURE_VIDEO_NOTE, UPDATE_LECTURE_VIDEO_NOTE } from "@/api/course/mutation";
import { GET_LECTURE_NOTES } from "@/api/course/queries";
import { apolloClient } from "@/lib/apollo-client";

const LectureVideoNoteContext = () => {
    const saveLectureVideoNote = async ({
      lectureId,
      notes,
      time, 
      setLoading, 
      setError,  
    }: {
      lectureId: number;
      notes: string;
      time: string;
      setLoading?: (v: boolean) => void;
      setError?: (e: Error | null) => void;
    }) => {
      try {
        setLoading?.(true);
        setError?.(null);
    
        const { data, errors } = await apolloClient.mutate({
          mutation: SAVE_LECTURE_VIDEO_NOTE,
          variables: { lectureId, notes, time },
          context: { includeAuth: true },
          fetchPolicy: "no-cache",
        });
    
        if (errors) {
          console.log("GraphQL errors saving note:", errors);
          throw new Error(errors[0]?.message || "Failed to save note");
        }
    
        if (data && data.saveLectureVideoNote?.lectureVideoNote) {
          // Optionally show a toast here
          return data.saveLectureVideoNote.lectureVideoNote;
        }
        throw new Error("Note not returned by API");
      } catch (err) {
        console.error("Error saving lecture video note:", err);
        setError?.(
          err instanceof Error ? err : new Error("Failed to save lecture video note")
        );
        return null;
      } finally {
        setLoading?.(false);
      }
    };

const updateLectureVideoNote = async ({
  lectureVideoNoteId,
  notes,
  setLoading,
  setError,
}: {
  lectureVideoNoteId: number;
  notes: string;
  setLoading?: (v: boolean) => void;
  setError?: (e: Error | null) => void;
}) => {
  try {
    setLoading?.(true);
    setError?.(null);

    const { data, errors } = await apolloClient.mutate({
      mutation: UPDATE_LECTURE_VIDEO_NOTE,
      variables: { lectureVideoNoteId, notes },
      context: { includeAuth: true }, 
      fetchPolicy: "no-cache",
    });

    if (errors) {
      console.log("GraphQL errors updating note:", errors);
      throw new Error(errors[0]?.message || "Failed to update note");
    }

    if (data?.updateLectureVideoNote?.success) {
      // Optionally show a toast here
      return true;
    }
    throw new Error("Update unsuccessful");
  } catch (err) {
    console.error("Error updating lecture video note:", err);
    setError?.(
      err instanceof Error ? err : new Error("Failed to update lecture video note")
    );
    return false;
  } finally {
    setLoading?.(false);
  }
};

const deleteLectureVideoNote = async ({
  lectureVideoNoteId,
  setLoading,
  setError,
}: {
  lectureVideoNoteId: number;
  setLoading?: (v: boolean) => void;
  setError?: (e: Error | null) => void;
}) => {
  try {
    setLoading?.(true);
    setError?.(null);

    const { data, errors } = await apolloClient.mutate({
      mutation: DELETE_LECTURE_VIDEO_NOTE,
      variables: { lectureVideoNoteId },
      context: { includeAuth: true }, // Uncomment if needed
      fetchPolicy: "no-cache",
    });

    if (errors) {
      console.log("GraphQL errors deleting note:", errors);
      throw new Error(errors[0]?.message || "Failed to delete note");
    }

    if (data?.deleteLectureVideoNote?.success) {
      // Optionally show a toast here
      return {
        success: true,
        message: data.deleteLectureVideoNote.message,
      };
    }
    throw new Error("Delete unsuccessful");
  } catch (err) {
    console.error("Error deleting lecture video note:", err);
    setError?.(
      err instanceof Error ? err : new Error("Failed to delete lecture video note")
    );
    return { success: false, message: "" };
  } finally {
    setLoading?.(false);
  }
};

const fetchLectureNotes = async ({
  lectureId,
//   sortBy = "MOST_RECENT",
  setLoading,
  setError,
}: {
  lectureId: number;
//   sortBy?: string;
  setLoading?: (v: boolean) => void;
  setError?: (e: Error | null) => void;
}) => {
  try {
    setLoading?.(true);
    setError?.(null);

    const { data, errors } = await apolloClient.query({
      query: GET_LECTURE_NOTES,
      variables: { lectureId },
       context: { includeAuth: true }, // Uncomment if needed
      fetchPolicy: "network-only",
    });

    if (errors) {
      console.log("GraphQL errors fetching notes:", errors);
      throw new Error(errors[0]?.message || "Failed to fetch lecture notes");
    }

    if (data && data.userLectureVideoNotes) {
      return data.userLectureVideoNotes;
    }
    throw new Error("No lecture notes found");
  } catch (err) {
    console.error("Error fetching lecture notes:", err);
    setError?.(
      err instanceof Error ? err : new Error("Failed to fetch lecture notes")
    );
    return [];
  } finally {
    setLoading?.(false);
  }
};

return {
    saveLectureVideoNote,
    updateLectureVideoNote,
    deleteLectureVideoNote,
    fetchLectureNotes
}
}
export default LectureVideoNoteContext

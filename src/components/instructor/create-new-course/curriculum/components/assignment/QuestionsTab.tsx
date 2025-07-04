import RichTextEditor from "../../RichTextEditor";
import { AssignmentQuestion, ExtendedLecture } from "@/lib/types";
import { useAssignmentService } from "@/services/useAssignmentService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const QuestionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  assignmentId?: number;
  fetchAssignment: () => Promise<void>;
}> = ({ data, onChange, assignmentId, fetchAssignment }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [currentQuestionContent, setCurrentQuestionContent] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isAddingNewQuestion, setIsAddingNewQuestion] = useState(false);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const existingQuestions = data.assignmentQuestions || [];
    setQuestions(existingQuestions);

    if (existingQuestions.length === 0) {
      setIsAddingNewQuestion(true);
    }
  }, [data.assignmentQuestions]);

  const {
    createAssignmentQuestion,
    updateAssignmentQuestion,
    deleteAssignmentQuestion,
  } = useAssignmentService();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async () => {
    setIsSubmitting(true);
    // Remove empty paragraphs and HTML tags
    const cleanContent = currentQuestionContent
      .replace(/<p><br><\/p>/g, "")
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!cleanContent) {
      toast.error("Question content cannot be empty");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingQuestionId) {
        const existing = questions.find((q) => q.id === editingQuestionId);
        if (!existing) {
          toast.error("Question not found.");
          return;
        }

        const response = await updateAssignmentQuestion({
          assignmentQuestionId: Number(editingQuestionId),
          text: cleanContent,
          order: existing.order ?? 1,
        });

        const updated = response.updateAssignmentQuestion.assignmentQuestion;

        const updatedQuestions = questions.map((q) =>
          q.id === editingQuestionId
            ? {
                ...q,
                text: updated.text, // Use text instead of content
                order: updated.order,
              }
            : q
        );

        fetchAssignment();
        setQuestions(updatedQuestions);
        onChange("assignmentQuestions", updatedQuestions);
        setEditingQuestionId(null);
        toast.success("Question updated successfully!");
      } else {
        const response = await createAssignmentQuestion({
          assignmentId: Number(id),
          text: cleanContent,
          order: questions.length + 1,
          required: false,
          maxPoints: 0,
        });

        const newQuestion: AssignmentQuestion = {
          id: response.createAssignmentQuestion.assignmentQuestion.id,
          text: cleanContent, // Use text instead of content
          order: questions.length + 1,
          content: "",
        };

        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        onChange("assignmentQuestions", updatedQuestions);
        toast.success("Question added successfully!");
      }
    } catch (error) {
      console.error("Failed to save question:", error);
      toast.error("Something went wrong while saving the question.");
    } finally {
      setCurrentQuestionContent("");
      setEditingQuestionId(null);
      setIsAddingNewQuestion(false);
      setIsSubmitting(false);
    }
  };

  const startEditing = (question: AssignmentQuestion) => {
    setEditingQuestionId(question.id);
    // Use question.text if available, otherwise fall back to question.content
    setCurrentQuestionContent(question.text || question.content || "");
    setIsAddingNewQuestion(false);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setCurrentQuestionContent("");
    setIsAddingNewQuestion(false);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const confirmDeleteQuestion = async (questionId: string) => {
    setIsDeleting(true);
    try {
      await deleteAssignmentQuestion({
        assignmentQuestionId: parseInt(questionId, 10),
      });
      // Update local state only after successful deletion
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      const reorderedQuestions = updatedQuestions.map((q, index) => ({
        ...q,
        order: index + 1,
      }));

      setQuestions(reorderedQuestions);
      onChange("assignmentQuestions", reorderedQuestions);
      setQuestionToDelete(null);
      toast.success("Question deleted successfully!");

      if (reorderedQuestions.length === 0) {
        setIsAddingNewQuestion(true);
      }
    } catch (error) {
      console.error("Failed to delete assignment question:", error);
      toast.error("Failed to delete question.");
    } finally {
      setIsDeleting(false);
    }
  };

  const startAddingNewQuestion = () => {
    setIsAddingNewQuestion(true);
    setEditingQuestionId(null);
    setCurrentQuestionContent("");
  };

  const renderQuestionEditor = (questionNumber: number) => (
    <>
      <div className="border border-gray-300 rounded mt-2">
        <RichTextEditor
          key={editingQuestionId || "new"}
          value={currentQuestionContent}
          onChange={setCurrentQuestionContent}
          type="assignmentQuestion"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSubmitQuestion}
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer disabled:bg-[rgba(108,40,210,0.3)] disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={cancelEditing}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 cursor-pointer rounded transition"
        >
          Cancel
        </button>
      </div>
    </>
  );

  const renderQuestionDisplay = (question: AssignmentQuestion) => (
    <div className="mt-2">
      <div className="prose max-w-none">
        {question.text ? (
          question.text
            .split("\n")
            .map((paragraph, i) => <p key={i}>{paragraph}</p>)
        ) : question.content ? (
          question.content
            .split("\n")
            .map((paragraph, i) => <p key={i}>{paragraph}</p>)
        ) : (
          <p>No question content available</p>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => startEditing(question)}
          className="px-4 py-1.5 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => setQuestionToDelete(question.id)}
          className="px-4 py-1.5 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-2 py-4 md:p-6 space-y-6">
      {/* info section */}
      {showInfo && (
        <div className="border border-[#6d28d2] rounded p-4">
          <div className="flex items-start gap-3">
            <div className="size-4 border border-[#6d28d2] rounded-full flex items-center justify-center text-[#6d28d2] text-xs flex-shrink-0 mt-1">
              i
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-3">
                Each assignment must include at least one question. You can add
                a maximum of 12 questions.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition">
                  Learn more
                </button>
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-1 text-[#6d28d2] hover:text-purple-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* render questions */}
      {questions.map((question) => (
        <div key={question.id} className="pb-6">
          <h3 className="text-sm font-bold text-gray-900">
            Question {question.order}
          </h3>
          {editingQuestionId === question.id
            ? renderQuestionEditor(question.order)
            : renderQuestionDisplay(question)}
        </div>
      ))}

      {/* new question editor */}
      {isAddingNewQuestion && (
        <div className="pb-6">
          <h3 className="text-sm font-bold text-gray-900">
            Question {questions.length + 1}
          </h3>
          {renderQuestionEditor(questions.length + 1)}
        </div>
      )}

      {/* Add button */}
      {!isAddingNewQuestion && questions.length < 12 && (
        <button
          onClick={startAddingNewQuestion}
          className="px-4 py-1.5 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
        >
          Add More
        </button>
      )}

      {/* delete modal */}
      {questionToDelete && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this question?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteQuestion(questionToDelete)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer disabled:bg-red-300"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsTab;

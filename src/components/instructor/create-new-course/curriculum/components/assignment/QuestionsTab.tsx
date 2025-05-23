import { AssignmentQuestion, ExtendedLecture } from "@/lib/types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const QuestionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
}> = ({ data, onChange }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);

  // Initialize with at least one empty question
  useEffect(() => {
    const existingQuestions = data.assignmentQuestions || [];
    if (existingQuestions.length === 0) {
      const initialQuestion: AssignmentQuestion = {
        id: Date.now().toString(),
        content: '',
        order: 1
      };
      setQuestions([initialQuestion]);
      onChange('assignmentQuestions', [initialQuestion]);
    } else {
      setQuestions(existingQuestions);
    }
  }, [data.assignmentQuestions]);

  const updateQuestion = (questionId: string, content: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, content } : q
    );
    
    // Auto-add a new question if the user is typing in the last question and it's not empty
    const currentQuestionIndex = updatedQuestions.findIndex(q => q.id === questionId);
    const isLastQuestion = currentQuestionIndex === updatedQuestions.length - 1;
    const hasContent = content.trim().length > 0;
    
    if (isLastQuestion && hasContent && updatedQuestions.length < 12) {
      // Check if there's already an empty question at the end
      const hasEmptyLastQuestion = updatedQuestions[updatedQuestions.length - 1]?.content.trim() === '';
      
      if (!hasEmptyLastQuestion) {
        const newQuestion: AssignmentQuestion = {
          id: Date.now().toString() + Math.random(),
          content: '',
          order: updatedQuestions.length + 1
        };
        updatedQuestions.push(newQuestion);
      }
    }
    
    setQuestions(updatedQuestions);
    onChange('assignmentQuestions', updatedQuestions);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) return; // Always keep at least one question
    
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    // Reorder the remaining questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }));
    
    setQuestions(reorderedQuestions);
    onChange('assignmentQuestions', reorderedQuestions);
  };

  const addQuestion = () => {
    if (questions.length >= 12) return;
    
    const newQuestion: AssignmentQuestion = {
      id: Date.now().toString() + Math.random(),
      content: '',
      order: questions.length + 1
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange('assignmentQuestions', updatedQuestions);
  };

  return (
    <div className="p-6 space-y-6">
      {showInfo && (
        <div className="border border-purple-200 bg-purple-50 rounded-md p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
              i
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-3">
                Each assignment must include at least one question. You can add a maximum of 12 questions. Please consider that students will type their answers into a text box next to each question.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-100">
                  Learn more
                </button>
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2 text-purple-600 hover:text-purple-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {questions.map((question, index) => (
        <div key={question.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}
            </h3>
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(question.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove question"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="border border-gray-300 rounded-md">
            <div className="border-b border-gray-200 p-2 flex gap-2">
              <button 
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => {
                  // Simple bold formatting - you can enhance this
                  const textarea = document.querySelector(`textarea[data-question-id="${question.id}"]`) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = textarea.value.substring(start, end);
                    const newText = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end);
                    updateQuestion(question.id, newText);
                  }
                }}
              >
                <strong>B</strong>
              </button>
              <button 
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => {
                  // Simple italic formatting
                  const textarea = document.querySelector(`textarea[data-question-id="${question.id}"]`) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = textarea.value.substring(start, end);
                    const newText = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end);
                    updateQuestion(question.id, newText);
                  }
                }}
              >
                <em>I</em>
              </button>
            </div>
            <textarea
              data-question-id={question.id}
              value={question.content}
              onChange={(e) => updateQuestion(question.id, e.target.value)}
              className="w-full p-3 border-none outline-none resize-none focus:ring-0"
              rows={4}
              placeholder={`Enter question ${index + 1}...`}
            />
          </div>
        </div>
      ))}



      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Submit
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuestionsTab;
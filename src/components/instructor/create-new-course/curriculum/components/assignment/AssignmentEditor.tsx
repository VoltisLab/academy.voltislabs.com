import React, { useState, useRef, JSX } from "react";
import { ArrowLeft } from "lucide-react";
import SolutionsTab from "./SolutionsTab";
import QuestionsTab from "./QuestionsTab";
import BasicInfoTab from "./BasicInfoTab";
import InstructionsTab from "./InstructionsTab";
import toast from "react-hot-toast";
import { ExtendedLecture } from "@/lib/types";
import AssignmentPreview from "./AssignmentPreview";
import { useAssignment } from "@/context/AssignmentDataContext";

interface AssignmentEditorProps {
  initialData?: ExtendedLecture;
  onClose: () => void;
  onSave: (data: ExtendedLecture) => void;
}

// Main Assignment Editor Component
const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  initialData,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("basic-info");

  const { assignmentData, setAssignmentData } = useAssignment();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasAttemptedPublish, setHasAttemptedPublish] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(true);
   const [assignmentStatus, setAssignmentStatus] = useState<
        "overview" | "assignment" | "summary/feedback"
      >("overview");

  const validateAssignment = () => {
    const errors: string[] = [];

    // Basic Info validation
    if (!assignmentData.assignmentTitle?.trim()) {
      errors.push("title");
    }
    if (!assignmentData.assignmentDescription?.trim()) {
      errors.push("description");
    }
    if (
      !assignmentData.estimatedDuration ||
      assignmentData.estimatedDuration <= 0
    ) {
      errors.push("duration");
    }

    // Questions validation
    if (!assignmentData.assignmentQuestions?.length) {
      errors.push("questions");
    } else {
      // Check all questions have answers
      const unansweredQuestions = assignmentData.assignmentQuestions.filter(
        (q: any) => !q.solution?.trim()
      );
      if (unansweredQuestions.length > 0) {
        errors.push("answers");
      }
    }

    // Instructions validation
    if (!assignmentData.assignmentInstructions?.trim()) {
      errors.push("instructions");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublishClick = () => {
    setHasAttemptedPublish(true);
    // if (validateAssignment()) {
    setShowPublishModal(true);
    // }
  };

  const handleConfirmPublish = () => {
    if (!validateAssignment()) {
      setShowPublishModal(false);
      return;
    }

    const publishedData = { ...assignmentData, isPublished: true };
    console.log("Editor saving:", publishedData);
    onSave(publishedData);
    setShowPublishModal(false);
    setPublishSuccess(true);
  };

  const handleErrorClick = (errorType: string) => {
    // Immediately remove just this error from validationErrors
    setValidationErrors((prev) => prev.filter((e) => e !== errorType));

    console.log("Error clicked:", errorType);

    // showValidationErrors();

    // Determine which tab to navigate to
    let targetTab = "basic-info";
    switch (errorType) {
      case "title":
      case "description":
      case "duration":
        targetTab = "basic-info";
        break;
      case "questions":
        targetTab = "questions";
        break;
      case "answers":
        targetTab = "solutions";
        break;
      case "instructions":
        targetTab = "instructions";
        break;
    }

    // Navigate to the tab
    setActiveTab(targetTab);

    // Optional: Scroll to top of content area
    const contentArea = document.querySelector(".flex-1.overflow-auto");
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showValidationErrors = () => {
    const errorMessages: JSX.Element[] = [];

    if (validationErrors.includes("title")) {
      errorMessages.push(
        <ErrorAlert
          key="title"
          message="You need to add a title"
          errorType="title"
        />
      );
    }
    if (validationErrors.includes("description")) {
      errorMessages.push(
        <ErrorAlert
          key="description"
          message="You need to have a description"
          errorType="description"
        />
      );
    }
    if (validationErrors.includes("duration")) {
      errorMessages.push(
        <ErrorAlert
          key="duration"
          message="You need to estimate the duration"
          errorType="duration"
        />
      );
    }
    if (validationErrors.includes("questions")) {
      errorMessages.push(
        <ErrorAlert
          key="questions"
          message="You need to have at least one question"
          errorType="questions"
        />
      );
    }
    if (validationErrors.includes("answers")) {
      errorMessages.push(
        <ErrorAlert
          key="answers"
          message="You need to have answers for all questions"
          errorType="answers"
        />
      );
    }
    if (validationErrors.includes("instructions")) {
      errorMessages.push(
        <ErrorAlert
          key="instructions"
          message="You need to add assignment instructions"
          errorType="instructions"
        />
      );
    }

    return errorMessages;
  };

  // Only show success if all errors are fixed AND we've attempted validation
  const showSuccess = showValidation && validationErrors.length === 0;

  // ErrorAlert component
  const ErrorAlert = ({
    errorType,
    message,
  }: {
    errorType: string;
    message: string;
  }) => (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message}.{" "}
            <button
              onClick={() => handleErrorClick(errorType)}
              className="font-medium text-red-700 hover:text-red-600 underline"
            >
              Click here to fix it
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // SuccessAlert component
  const SuccessAlert = () => (
    <div className="border-l-4 border-green-500 bg-green-50 p-4 mb-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            All requirements are met! Your assignment is now published.
          </p>
        </div>
      </div>
    </div>
  );

  const handleDataChange = (field: string, value: any) => {
    setAssignmentData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(assignmentData);
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "instructions", label: "Instructions" },
    { id: "questions", label: "Questions" },
    { id: "solutions", label: "Solutions" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoTab
            data={assignmentData}
            onChange={handleDataChange}
            onSave={() => console.log("Basic info saved")}
          />
        );
      case "instructions":
        return (
          <InstructionsTab
            data={assignmentData}
            onChange={handleDataChange}
            isEditing={isEditingInstructions}
            onEditToggle={setIsEditingInstructions}
            hasSubmitted={Boolean(assignmentData.assignmentInstructions)}
          />
        );
      case "questions":
        return (
          <QuestionsTab data={assignmentData} onChange={handleDataChange} />
        );
      case "solutions":
        return (
          <SolutionsTab
            data={assignmentData}
            onChange={handleDataChange}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return (
          <BasicInfoTab
            data={assignmentData}
            onChange={handleDataChange}
            onSave={() => console.log("Basic info saved")}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col px-20">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className=" gap-4 w-full">
          <button
            onClick={onClose}
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-purple-100 rounded-md text-purple-600 hover:text-purple-800 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to curriculum
          </button>

          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Assignment
            </h1>
            <button
              onClick={handlePublishClick}
              disabled={assignmentData.isPublished}
              className="px-6 py-2 bg-purple-600 text-white cursor-pointer rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {hasAttemptedPublish && (
        <div className="px-6 py-2">
          {validationErrors.length > 0
            ? showValidationErrors()
            : publishSuccess && <SuccessAlert />}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 ">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 text-sm ${
                  activeTab === tab.id
                    ? "text-gray-800 border-l-4 border-gray-800"
                    : "text-gray-800"
                } hover:bg-gray-100`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>
      </div>

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Publication
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to publish this assignment? Once published,
              students will be able to see and complete it.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {assignmentData.isPublished && (
        <AssignmentPreview setAssignmentStatus={setAssignmentStatus} assignmentData={assignmentData} />
      )}
    </div>
  );
};

export default AssignmentEditor;

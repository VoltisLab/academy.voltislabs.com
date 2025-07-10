"use client";
import React, { useState, useCallback, useEffect, JSX, useMemo } from "react";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import SolutionsTab from "./SolutionsTab";
import QuestionsTab from "./QuestionsTab";
import BasicInfoTab from "./BasicInfoTab";
import InstructionsTab from "./InstructionsTab";
import toast from "react-hot-toast";
import { ExtendedLecture } from "@/lib/types";
import { useAssignment } from "@/context/AssignmentDataContext";
import { UpdateAssignmentVariables } from "@/api/assignment/mutation";
import { useAssignmentService } from "@/services/useAssignmentService";
import { useParams, useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { GetAssignmentQuery } from "@/api/assignment/query";
import AssignmentPreview from "./AssignmentPreview";

export interface AssignmentQuestion {
  id: string;
  content: string;
  order: number;
  solution?: {
    text?: string;
  };
}

export type Video = {
  id: string;
  filename: string;
  type: "Video";
  status: "success" | "failed" | "uploading" | "processing";
  url?: string;
  date: string;
};

interface AssignmentEditorProps {
  initialData?: ExtendedLecture;
  onClose?: () => void;
  onSave: (data: ExtendedLecture) => void;
  newAssinment?: number;
}

const initialLibraryVideos: Video[] = [
  {
    id: "5",
    filename: "Aetflix.mp4",
    type: "Video",
    status: "success",
    date: "05/08/2025",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "4",
    filename: "Betflix.mp4",
    type: "Video",
    status: "success",
    date: "05/08/2025",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "3",
    filename: "f.webm",
    type: "Video",
    status: "success",
    date: "05/08/2025",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "2",
    filename: "detflix.mp4",
    type: "Video",
    status: "success",
    date: "05/07/2025",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "1",
    filename: "cetflix.mp4",
    type: "Video",
    status: "success",
    date: "05/07/2025",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  initialData,
  newAssinment,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasAttemptedPublish, setHasAttemptedPublish] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [libraryVideos, setLibraryVideos] =
    useState<Video[]>(initialLibraryVideos);
  const [sortByNameAsc, setSortByNameAsc] = useState(false);
  const [sortByDateAsc, setSortByDateAsc] = useState(false);
  const [showTab, setShowTab] = useState(false);

  const { assignmentData, setAssignmentData } = useAssignment();
  const { getAssignment } = useAssignmentService();

  const toggleSortByName = () => {
    setSortByNameAsc((prev) => !prev);
    setSortByDateAsc(false);
  };

  const toggleSortByDate = () => {
    setSortByDateAsc((prev) => !prev);
    setSortByNameAsc(false);
  };

  const validateAssignment = () => {
    const errors: string[] = [];
    if (!assignmentData.title?.trim()) errors.push("title");
    if (!assignmentData.description?.trim()) errors.push("description");
    if (
      !assignmentData.estimatedDuration ||
      assignmentData.estimatedDuration <= 0
    )
      errors.push("duration");
    // Validate questions and answers
    if (!assignmentData.assignmentQuestions?.length) {
      errors.push("questions");
    } else {
      // Check each question for valid answers
      const hasInvalidAnswers = assignmentData.assignmentQuestions.some(
        (question) => {
          // If no solutions array or empty solutions array
          if (!question.questionSolutions?.length) return true;

          // Check each solution in the question
          return question.questionSolutions.some((solution) => {
            // Consider empty string or whitespace as invalid
            return !solution.text?.trim();
          });
        }
      );

      if (hasInvalidAnswers) errors.push("answers");
    }
    if (!assignmentData.instructions?.trim()) errors.push("instructions");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublishClick = () => {
    setHasAttemptedPublish(true);
    setShowPublishModal(true);
  };

  const fetchAssignment = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getAssignment({ id: Number(id) });
      console.log(data);
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
        isPublished: false,
      });
    } catch (err) {}
  }, [getAssignment, id, setAssignmentData]);

  useEffect(() => {
    if (id) fetchAssignment();
  }, [id]);

  const handleConfirmPublish = () => {
    if (!validateAssignment()) {
      setShowPublishModal(false);
      return;
    }

    const publishedData = { ...assignmentData, isPublished: true };
    // const variables: UpdateAssignmentVariables = {
    //   assignmentId: Number(newAssinment),
    //   title: publishedData.assignmentTitle,
    //   description: publishedData.assignmentDescription,
    //   estimatedDurationMinutes: publishedData.estimatedDuration,
    //   instructions: publishedData.assignmentInstructions,
    //   resourceUrl: publishedData.instructionalResource?.url,
    //   videoUrl: publishedData.instructionalVideo?.url,
    // };
    // await updateAssignment(variables);
    onSave(publishedData);
    setShowPublishModal(false);
    setPublishSuccess(true);
  };

  const handleErrorClick = (errorType: string) => {
    setValidationErrors((prev) => prev.filter((e) => e !== errorType));
    const tabMap: Record<string, string> = {
      title: "basic-info",
      description: "basic-info",
      duration: "basic-info",
      questions: "questions",
      answers: "solutions",
      instructions: "instructions",
    };
    setActiveTab(tabMap[errorType] || "basic-info");
    document
      .querySelector(".flex-1.overflow-auto")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errorMessagesMap: Record<string, string> = {
    title: "You need to add a title",
    description: "You need to have a description",
    duration: "You need to estimate the duration",
    questions: "You need to have at least one question",
    answers: "You need to have answers for all questions",
    instructions: "You need to add assignment instructions",
  };

  const showValidationErrors = () =>
    validationErrors.map((type) => (
      <ErrorAlert
        key={type}
        message={errorMessagesMap[type]}
        errorType={type}
      />
    ));

  const ErrorAlert = ({
    errorType,
    message,
  }: {
    errorType: string;
    message: string;
  }) => (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-2">
      <div className="flex items-center">
        <XCircle className="h-5 w-5 text-red-500" />

        <p className="ml-3 text-sm text-red-700">
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
  );

  const SuccessAlert = () => (
    <div className="border-l-4 border-green-500 bg-green-50 p-4 mb-2">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500" />

        <p className="ml-3 text-sm text-green-700">
          All requirements are met! Your assignment is now published.
        </p>
      </div>
    </div>
  );

  const handleDataChange = (field: string, value: any) => {
    setAssignmentData((prev: any) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "instructions", label: "Instructions" },
    { id: "questions", label: "Questions" },
    { id: "solutions", label: "Solutions" },
  ];

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "basic-info":
        return (
          <BasicInfoTab
            fetchAssignment={fetchAssignment}
            data={assignmentData}
            onChange={handleDataChange}
            onSave={() => {}}
          />
        );
      case "instructions":
        return (
          <InstructionsTab
            fetchAssignment={fetchAssignment}
            data={assignmentData}
            onChange={handleDataChange}
            hasSubmitted={!!assignmentData.instructions}
            libraryVideos={libraryVideos}
            setLibraryVideos={setLibraryVideos}
            sortByNameAsc={sortByNameAsc}
            sortByDateAsc={sortByDateAsc}
            toggleSortByName={toggleSortByName}
            toggleSortByDate={toggleSortByDate}
          />
        );
      case "questions":
        return (
          <QuestionsTab
            fetchAssignment={fetchAssignment}
            data={assignmentData}
            onChange={handleDataChange}
            assignmentId={newAssinment}
          />
        );
      case "solutions":
        return (
          <SolutionsTab
            fetchAssignment={fetchAssignment}
            data={assignmentData}
            onChange={handleDataChange}
            setActiveTab={setActiveTab}
            libraryVideos={libraryVideos}
            setLibraryVideos={setLibraryVideos}
            sortByNameAsc={sortByNameAsc}
            sortByDateAsc={sortByDateAsc}
            toggleSortByName={toggleSortByName}
            toggleSortByDate={toggleSortByDate}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    assignmentData,
    fetchAssignment,
    handleDataChange,
    newAssinment,
    sortByNameAsc,
    sortByDateAsc,
  ]);

  return (
    <div className=" bg-white z-50 flex flex-col max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-2 md:px-6 py-2 md:py-4 flex items-center justify-between">
        <div className="gap-4 w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 py-2 px-2 hover:bg-[rgba(108,40,210,0.125)] font-bold rounded-md text-[#6d28d2] cursor-pointer transition text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to curriculum
          </button>

          <div className="flex items-center justify-between w-full gap-1">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              Create Assignment
            </h1>
            <button
              onClick={handlePublishClick}
              disabled={assignmentData.isPublished}
              className="px-4 py-2 bg-[#6d28d2] text-white cursor-pointer rounded-md hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed transition font-bold text-sm"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {hasAttemptedPublish && (
        <div className="px-2 md:px-6 py-2">
          {validationErrors.length > 0
            ? showValidationErrors()
            : publishSuccess && <SuccessAlert />}
        </div>
      )}

      <button
        onClick={() => setShowTab(!showTab)}
        className={`inline-flex items-center gap-2 py-2 px-2 hover:bg-[rgba(108,40,210,0.125)] font-bold rounded-md text-[#6d28d2] cursor-pointer transition text-sm w-max md:mx-6 mx-2 lg:hidden`}
      >
        <FiMenu size={25} />
      </button>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden lg:mt-10 flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div
          className={`w-full lg:w-64 ${showTab ? "block" : "hidden"} lg:block`}
        >
          <nav className="py-4 px-2 md:px-6 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 text-sm border-l-4  ${
                  activeTab === tab.id
                    ? "text-gray-800 border-gray-800"
                    : "text-gray-800 border-transparent"
                } hover:bg-gray-100 transition`}
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
                className="px-4 py-2 bg-[#6d28d2] text-white rounded-md hover:bg-purple-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {publishSuccess && (
        <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow-md size-full">
          <AssignmentPreview assignmentData={assignmentData} />
        </div>
      )}
    </div>
  );
};

export default AssignmentEditor;

import { ExtendedLecture } from "@/lib/types";
import { useRef, useState } from "react";
import RichTextEditor from "./NewRichTextEditor";
import toast from "react-hot-toast";

const SolutionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  setActiveTab: (tab: string) => void; // Add this line
}> = ({ data, onChange, setActiveTab }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<
    "upload" | "library" | null
  >("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideoUploaded, setShowVideoUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>(
    {}
  );
  const [answerContents, setAnswerContents] = useState<Record<string, string>>(
    {}
  );

  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);

  // Sample library videos
  const libraryVideos = [
    {
      filename: "2024-11-13-175733.webm",
      type: "Video",
      status: "Success",
      date: "05/13/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "Success",
      date: "05/08/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "Success",
      date: "05/07/2025",
    },
  ];

  const handleResourceUpload = (file: File) => {
    onChange("solutionResource", {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  const handleSolutionVideoUpload = (file: File) => {
    onChange("solutionVideo", { file, url: URL.createObjectURL(file) });
    setShowVideoUploaded(true);
    setActiveVideoTab(null);
  };

  const handleVideoSelect = (video: any) => {
    onChange("solutionVideo", {
      file: null,
      url: video.filename,
      filename: video.filename,
    });
    setShowVideoUploaded(true);
    setActiveVideoTab(null);
  };

  const handleChangeVideo = () => {
    setShowChangeCancel(true);
    setShowVideoUploaded(false);
    setActiveVideoTab("upload");
  };

  const handleCancelChange = () => {
    setShowChangeCancel(false);
    setShowVideoUploaded(true);
    setActiveVideoTab(null);
  };

  const startEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: true }));
    setAnswerContents((prev) => ({
      ...prev,
      [questionId]:
        data.assignmentQuestions?.find((q) => q.id === questionId)?.solution ||
        "",
    }));
  };

  const cancelEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    const answerContent = answerContents[questionId] || "";

    if (!answerContent.trim()) {
      toast.error("Answer content cannot be empty");
      return;
    }

    // Update the question with the solution
    const updatedQuestions =
      data.assignmentQuestions?.map((q) =>
        q.id === questionId ? { ...q, solution: answerContent } : q
      ) || [];

    onChange("assignmentQuestions", updatedQuestions);
    setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
    toast.success("Answer saved successfully!");
  };

  const handleDeleteAnswer = (questionId: string) => {
    // Remove the solution from the question
    const updatedQuestions =
      data.assignmentQuestions?.map((q) =>
        q.id === questionId ? { ...q, solution: undefined } : q
      ) || [];

    onChange("assignmentQuestions", updatedQuestions);
  };

  const filteredVideos = libraryVideos.filter((video) =>
    video.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasQuestions =
    data.assignmentQuestions && data.assignmentQuestions.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Video Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Video</h3>

        {!showVideoUploaded ? (
          <>
            {/* Video Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveVideoTab("upload")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeVideoTab === "upload"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Video
                </button>
                <button
                  onClick={() => setActiveVideoTab("library")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ml-8 ${
                    activeVideoTab === "library"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Add from library
                </button>
              </div>
            </div>

            {/* Upload Video Tab Content */}
            {activeVideoTab === "upload" && (
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 max-w-xl w-full border border-zinc-700 py-3 px-4 rounded">
                    {data.solutionVideo?.file
                      ? data.solutionVideo.file.name
                      : "No file selected"}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 cursor-pointer"
                  >
                    Select Video
                  </button>
                </div>
                {showChangeCancel && (
                  <button
                    onClick={handleCancelChange}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Cancel
                  </button>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Note: All files should be at least 720p and less than 4.0 GB.
                </p>
              </div>
            )}

            {/* Library Tab Content */}
            {activeVideoTab === "library" && (
              <div>
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-2 p-1 bg-purple-600 text-white rounded">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Video Library Table */}
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4 font-medium text-sm text-gray-700">
                      <div>Filename</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div className="flex items-center gap-1">
                        Date
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div></div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {filteredVideos.map((video, index) => (
                      <div key={index} className="px-4 py-3 hover:bg-gray-50">
                        <div className="grid grid-cols-5 gap-4 items-center text-sm">
                          <div className="text-gray-900">{video.filename}</div>
                          <div className="text-gray-600">{video.type}</div>
                          <div className="text-blue-600">{video.status}</div>
                          <div className="text-gray-600">{video.date}</div>
                          <div>
                            <button
                              onClick={() => handleVideoSelect(video)}
                              className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                              Select ↗
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-md p-4 bg-gray-100">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-700">
                  {data.solutionVideo?.file?.name ||
                    data.solutionVideo?.url?.split("/").pop() ||
                    "No video selected"}
                </span>
              </div>
            </div>

            <div className="h-80 flex items-center justify-center text-center text-gray-500">
              <p>
                We've uploaded your file, and are processing it to ensure it
                works smoothly on Udemy.
                <br />
                As soon as it's ready, we'll send you an email.
              </p>
            </div>

            {/* Files change and delete buttons */}
            <div className="flex space-x-2 mb-20">
              <button
                onClick={handleChangeVideo}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
              >
                Change
              </button>
              <button
                onClick={() => {
                  // Clear the video state
                  onChange("instructionalVideo", null);

                  // Reset the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }

                  // Reset all related states
                  setShowVideoUploaded(false);
                  setShowChangeCancel(false);
                  setActiveVideoTab("upload");
                }}
                className="px-4 py-2 text-purple-600 hover:text-purple-800 border border-purple-600 rounded-md hover:bg-purple-50 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* No Questions Warning */}
      {!hasQuestions && (
        <div className="border border-orange-300 bg-orange-50 rounded-md p-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
            ⚠
          </div>
          <div className="flex-1">
            <p className="text-gray-700">
              You have no questions yet.{" "}
              <button
                onClick={() => setActiveTab("questions")}
                className="text-purple-600 hover:text-purple-800 font-medium cursor-pointer transition"
              >
                Click here to add questions
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Questions and Answers Section */}
      {hasQuestions && (
        <div className="space-y-8">
          {data.assignmentQuestions?.map((question) => (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-lg font-medium text-gray-900">
                Question {question.order}
              </h3>
              <div className="prose max-w-none mt-2">
                {question.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Answer Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Your Answer
                </h4>

                {editingAnswers[question.id] ? (
                  <>
                    <RichTextEditor
                      value={answerContents[question.id] || ""}
                      onChange={(value) =>
                        setAnswerContents((prev) => ({
                          ...prev,
                          [question.id]: value,
                        }))
                      }
                      placeholder="Enter your answer..."
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSubmitAnswer(question.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer transition hover:bg-purple-700"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => cancelEditingAnswer(question.id)}
                        className="px-4 py-2 text-gray-600 cursor-pointer rounded-md transition hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {question.solution ? (
                      <div className="space-y-2">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: question.solution,
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditingAnswer(question.id)}
                            className="px-4 py-1 text-sm bg-purple-600 text-white rounded-md cursor-pointer transition hover:bg-purple-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setAnswerToDelete(question.id)}
                            className="px-4 py-1 text-sm border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingAnswer(question.id)}
                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Add Answer
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Downloadable Resource */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Downloadable resource
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 max-w-xl w-full border border-zinc-700 py-3 px-4 rounded">
            {data.solutionResource?.file
              ? data.solutionResource.file.name
              : "No file selected"}
          </span>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleResourceUpload(file);
              };
              input.click();
            }}
            className="px-4 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 cursor-pointer transition"
          >
            Select File
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Note: A resource is for any type of document that can be used to help
          students in the lecture. This file is going to be such as a lecture
          extra. Make sure everything is legible and the file size is less than
          1 GB.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSolutionVideoUpload(file);
        }}
        className="hidden"
      />

      {/* Delete confirmation modal */}
      {answerToDelete && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this answer?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAnswerToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAnswer(answerToDelete);
                  setAnswerToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsTab;
